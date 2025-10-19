# CLEANIFY - Open Access Mode

## Overview
This README documents the open access mode implementation for CLEANIFY. The open access mode provides direct access to all features without requiring login or authentication.

## Quick Start

### Start the Simple Server
```bash
cd Backend
node simple-server.cjs
```
The server will run on port 5002 with these endpoints:
- Test endpoint: http://localhost:5002/test
- Auto-login endpoint: http://localhost:5002/auto-login

### Start the Frontend
```bash
cd frontend
npm run dev
```

## How Open Access Works
1. The Simple Server provides an auto-login endpoint that returns a pre-generated admin user and token.
2. The frontend's AuthContext automatically calls this endpoint on load to get admin credentials.
3. All routes and features are accessible without manual login.

## Implementation Details

### Backend
- **simple-server.cjs**: A simplified CommonJS server that provides the auto-login endpoint.
- **open-access-server.js**: A more feature-complete ESM server with additional API endpoints.
- **middleware/auth.js**: Modified to bypass authentication.
- **middleware/devGuest.js**: Updated to always attach admin privileges.

### Frontend
- **src/context/AuthContext.jsx**: Updated to automatically log in as admin on page load.

## Troubleshooting
If you encounter issues:
1. Make sure the server is running on port 5002
2. Check the browser console for any errors
3. Verify that CORS headers are properly set
4. Check that the frontend is pointed to the correct backend URL (http://localhost:5002/auto-login)
