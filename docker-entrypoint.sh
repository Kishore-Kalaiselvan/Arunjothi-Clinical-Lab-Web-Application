#!/bin/sh

# Start backend
cd /app/backend
node dist/server.js &

# Start frontend
cd /app/frontend
serve -s build -l 3000 &

# Wait for any process to exit
wait -n

# Exit with status of process that exited first
exit $?
