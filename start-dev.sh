
#!/bin/bash

# Start the backend server
echo "Starting backend server..."
cd api
python run.py &
BACKEND_PID=$!

# Start the frontend server
echo "Starting frontend server..."
cd ..
npm run dev &
FRONTEND_PID=$!

# Function to handle cleanup on exit
cleanup() {
  echo "Shutting down servers..."
  kill $BACKEND_PID $FRONTEND_PID
  exit 0
}

# Set up trap to handle cleanup on exit
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait
