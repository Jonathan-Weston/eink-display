#!/bin/bash

LOGFILE="script_log.log"
echo "Starting servers..." | tee -a $LOGFILE

# Start Node.js server
node ~/pi/scraping/server.js &> $LOGFILE &
NODE_PID=sudo lsof -ti tcp:5000
echo "Node server started with PID: $NODE_PID" | tee -a $LOGFILE

cd ~/pi/reactapp/build
# Start http-server
npx http-server &> $LOGFILE &
HTTP_SERVER_PID=sudo lsof -ti tcp:8080
echo "http-server started with PID: $HTTP_SERVER_PID" | tee -a $LOGFILE

source ~/pimoroni/bin/activate
echo "Starting first script..." | tee -a $LOGFILE

# Run the first Python script and wait for completion
python3 capture-screenshot.py

echo "First script completed. Starting second script..." | tee -a $LOGFILE

# Run the second Python script after the first one finishes
python3 display-image.py

echo "Second script completed." | tee -a $LOGFILE
echo "Stopping servers..." | tee -a $LOGFILE

# Kill both processes
kill $NODE_PID $HTTP_SERVER_PID
echo "Servers stopped." | tee -a $LOGFILE