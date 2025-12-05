# Clerk Dependency Fix

**Issue:** The error shows that Vite cannot resolve `@clerk/clerk-react` from the client code.

**Root Cause:** The project has a monorepo structure where dependencies are installed at the root level, but Vite is trying to resolve them from the `client/src` directory.

## Quick Fix

### Option 1: Stop and Restart the Server

Sometimes Vite's module resolution cache gets confused. Try this:

**In your terminal where the server is running:**

1. Press `Ctrl+C` to stop the server

1. Run: `pnpm dev` again

### Option 2: Clear Cache and Restart

If Option 1 doesn't work:

```bash
# Stop the server (Ctrl+C)

# Clear Vite cache
pnp

# Restart
pnpm dev
```

### Option 3: Reinstall Dependencies

If the error persists:

```bash
# Stop the server (Ctrl+C)

# Remove node_modules and reinstall
rm -rf node_modules
pnpm install

# Restart
pnpm dev
```

## Why This Happens

The project structure has:

- Root `package.json` with all dependencies

- Client code in `client/src/`

- Vite trying to resolve imports from client directory

When you pulled the latest code, Vite's cache might not have updated to recognize the new module locations.

## After the Fix

Once the server restarts successfully, test these URLs again:

- `http://localhost:3000/analytics`

- `http://localhost:3000/admin`

- `http://localhost:3000/api-settings`

They should all load without errors!

