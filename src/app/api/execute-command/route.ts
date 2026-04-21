import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

export async function POST(req: Request) {
  try {
    const { command } = await req.json();

    if (!command) {
      return NextResponse.json({ error: "No command provided" }, { status: 400 });
    }

    // Use Docker for sandboxed execution
    // We run the command inside an alpine linux container
    // --rm: remove container after it exits
    // -i: interactive (keep STDIN open even if not attached)
    // --network none: Disable network access for safety
    // --memory 128m: Limit memory usage
    
    // Escape double quotes in the command to pass to sh -c safely
    const escapedCommand = command.replace(/"/g, '\\"');
    const dockerCommand = `docker run --rm --network none --memory 128m alpine sh -c "${escapedCommand}"`;

    try {
      const { stdout, stderr } = await execAsync(dockerCommand, {
        timeout: 10000, // 10 second timeout for the docker run
        maxBuffer: 1024 * 1024, // 1MB output limit
      });

      return NextResponse.json({ 
        stdout: stdout || null, 
        stderr: stderr || null 
      });
    } catch (execError: any) {
      return NextResponse.json({ 
        error: execError.message || "Command execution failed",
        stdout: execError.stdout || null,
        stderr: execError.stderr || null
      });
    }

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
