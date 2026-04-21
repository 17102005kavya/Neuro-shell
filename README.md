# Smart Shell AI

Welcome to **Smart Shell AI**, a full-stack, AI-powered web terminal that translates natural language instructions into safe, executable shell commands. 

Ever wanted to just say *"find all the massive files eating up my disk space"* instead of googling `find . -type f -size +100M`? That's what Smart Shell does, all from a beautiful browser-based interface!

---

## Key Features

### 1. Natural Language to Shell Commands
Powered by the **Google Gemini API**, Smart Shell takes plain English inputs and reliably converts them into precise Linux/Bash commands.

### 2. Intelligent Command Explanation
Before you run a command you don't understand, the AI breaks down exactly what the command does, explaining flags and syntax in beginner-friendly terms.

### 3. Built-in Safety Modes
You don't want AI accidentally deleting your hard drive. Smart Shell includes multiple modes:
* **Safe Mode:** Automatically blocks commands matching dangerous patterns (like `rm -rf /` or `mkfs`).
* **Learning Mode:** Always explains the generated command and asks for your confirmation before executing.
* **Power Mode:** Executes commands directly, relying only on the base safety validation.

### 4.  Secure Docker Sandboxing
Executing dynamically generated commands is risky! To keep your host machine completely safe, Smart Shell executes all generated commands inside a temporary **Docker Sandbox**. 
* Runs an isolated `alpine` Linux container.
* Removes the container immediately after execution (`--rm`).
* Disables network access by default (`--network none`).
* Enforces a hard memory limit (`--memory 128m`).

---

##  Architecture & Tech Stack

This project is built using a modern, unified architecture:

* **Frontend:** [Next.js (App Router)](https://nextjs.org/) + [React](https://react.dev/) + [Tailwind CSS](https://tailwindcss.com/)
* **Backend:** Next.js Serverless API Routes
* **AI Provider:** `@google/genai` (Gemini 2.5 Flash model)
* **Execution Engine:** Local `child_process` orchestrating isolated Docker containers.

### Folder Structure
```text
shell-ai/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── execute-command/    # Handles Docker execution
│   │   │   ├── explain-command/    # Prompts Gemini for explanations
│   │   │   ├── generate-command/   # Prompts Gemini to generate the bash string
│   │   │   └── validate-command/   # Runs RegEx safety checks against command
│   │   ├── globals.css             # Tailwind & Terminal CSS variables
│   │   ├── layout.tsx
│   │   └── page.tsx                # Main application page
│   └── components/
│       ├── ModeSelector.tsx        # UI toggle for Safe/Learning/Power modes
│       └── Terminal.tsx            # Core interactive terminal logic & rendering
├── .env.local                      # Secret API keys
└── package.json
```

---

##  Getting Started

### Prerequisites
1. **Node.js** (v18+ recommended)
2. **Docker Desktop** installed and running on your machine.
3. A **Google Gemini API Key** (Get one from Google AI Studio).

### 1. Installation
Clone or download the project, then install the dependencies:
```bash
npm install
```

### 2. Prepare the Docker Sandbox
Because the app uses an isolated Alpine Linux container, you should pull the image manually the first time so you don't hit the app's 10-second security timeout:
```bash
docker pull alpine
```

### 3. Set Up Environment Variables
Create a file named `.env.local` in the root of the project and add your Gemini API key:
```env
GEMINI_API_KEY=your_actual_api_key_here
```

### 4. Run the App
Start the Next.js development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser and start chatting with your terminal!

---

## ⚠️ Important Note on Networking
By default, the Docker sandbox runs with `--network none` to prevent the AI from downloading malicious payloads or exfiltrating data. 

If you *want* to run commands that require internet access (like `curl` or `ping`), simply open `src/app/api/execute-command/route.ts` and remove the `--network none` flag from the `docker run` command!
