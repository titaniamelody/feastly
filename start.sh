#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "Starting backend server..."
cd "$SCRIPT_DIR/backend" && node server.js &
BACKEND_PID=$!

echo "Starting frontend server..."
cd "$SCRIPT_DIR/frontend" && npm run dev &
FRONTEND_PID=$!

echo ""
echo "============================================"
echo "All servers are starting!"
echo "Backend: http://localhost:4000"
echo "Frontend: http://localhost:5173"
echo "Admin Panel: http://localhost:5173/admin"
echo "============================================"
echo ""
echo "Press Ctrl+C to stop all servers..."

# Wait for both processes
wait $BACKEND_PID
