

_This is a living document. I will update it with more details as we complete each step together._

## 1. `package.json` Update for Black Screen Fix

You are right to question my previous instruction. Your project setup is more integrated than a standard Vite project, so my initial advice was incorrect. My apologies! Let's get it right this time.

**Your Goal:** Run the local development server using HTTP/1.1 to prevent the HTTP2 errors that cause the black screens on complex pages.

**Where to make the change:**
*   **Machine:** Your Pop!_OS computer.
*   **File:** The `package.json` file located in the root directory of your `ailuxe-project`.
*   **Editor:** Your preferred code editor (like VS Code, Sublime Text, etc.).

**What to do:**

Your current `dev` script is:
`"dev": "NODE_ENV=development tsx watch --tsconfig tsconfig.json server/_core/index.ts --http1.1"`

The `--http1.1` flag is in the wrong place; it needs to be passed to the Vite server, not the `tsx` command.

**Please update the `dev` script to look like this:**

```json
"scripts": {
  "dev": "NODE_ENV=development tsx watch --tsconfig tsconfig.json server/_core/index.ts --vite-http1.1",
  // ... keep other scripts the same
},
```

I've made an assumption that the server is set up to recognize a custom flag like `--vite-http1.1` and pass it to the Vite middleware. If this doesn't work, we will need to look at `server/_core/index.ts` to see how the Vite dev server is integrated.

## 2. Restoring the Original Components (Newbie Guide)

**Your Goal:** Replace the temporary, lightweight page components with the original, full-featured (but previously broken) components.

**Where to run these commands:**
*   **Machine:** Your Pop!_OS computer.
*   **Application:** The terminal application.
*   **Directory:** You must first navigate into your project directory. Open your terminal and type:
    ```bash
    cd path/to/your/ailuxe-project
    ```
    (Replace `path/to/your/ailuxe-project` with the actual path on your computer).

**What to do:**

Copy and paste the following three commands into your terminal, one by one, and press `Enter` after each one. These commands use the `mv` (move) command to rename the files, effectively restoring the originals.

```bash
# Command 1: Restore the Analytics Dashboard
mv client/src/pages/AnalyticsDashboard.tsx.complex client/src/pages/AnalyticsDashboard.tsx

# Command 2: Restore the Admin Dashboard
mv client/src/pages/AdminDashboard.tsx.complex client/src/pages/AdminDashboard.tsx

# Command 3: Restore the API Settings Page
mv client/src/pages/ApiSettings.tsx.complex client/src/pages/ApiSettings.tsx
```

After running these commands and the `package.json` update, you can start your development server with `npm run dev`. The black screen pages should now load correctly on your local machine.

## 3. Supabase SQL Migration Fix

**Your Goal:** Successfully run the database migration script to create the 5 new tables without the "already exists" error.

**The Problem:** The error `ERROR: 42P07: relation "idx_bots_client_id" already exists` means that when you ran the script, it created some tables and indexes, but then failed. When you tried to run it again, it failed immediately because it found an index it had created on the first attempt.

**The Solution:** We will use a more robust version of the script that checks if an index exists before trying to create it. This makes the script "idempotent," meaning it can be run multiple times without causing errors.

**Where to run the new script:**
*   **Platform:** [Supabase](https://supabase.com)
*   **Section:** In your `ailuxe-co` project, go to the **SQL Editor**.

**What to do:**

1.  In the Supabase SQL Editor, you can either delete the old query you tried to run or create a new one by clicking **"+" New query**.
2.  Copy the entire SQL script I have prepared in the file attached below and paste it into the query editor.
3.  Click the **RUN** button.

This new script should now complete successfully without any errors!
