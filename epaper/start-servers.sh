#!/bin/bash

LOGFILE="server_log.log"
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

# Wait for 1 hour (3600 seconds)
sleep 3600

echo "Stopping servers..." | tee -a $LOGFILE

# Kill both processes
kill $NODE_PID $HTTP_SERVER_PID
echo "Servers stopped." | tee -a $LOGFILE