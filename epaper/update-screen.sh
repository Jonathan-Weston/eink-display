#!/bin/bash

LOGFILE="server_log.log"
exec 3>&1 1>> >(while read line; 
    do echo "[$(date '+%Y-%m-%d %H:%M:%S')] $line"; 
    done >> $LOGFILE) 2>&1
echo "Starting servers..." | tee /dev/fd/3

# Start Node.js server
node ~/pi/scraping/server.js | 
    while read line; 
    do echo "[$(date '+%Y-%m-%d %H:%M:%S')] $line"; 
    done >> $LOGFILE &

NODE_PID=$(sudo lsof -ti tcp:5000)
echo "Node server started with PID: $NODE_PID" | tee /dev/fd/3

cd ~/pi/reactapp/build
# Start http-server
npx http-server | 
    while read line; 
    do echo "[$(date '+%Y-%m-%d %H:%M:%S')] $line"; 
    done >> $LOGFILE &
HTTP_SERVER_PID=$(sudo lsof -ti tcp:8080)
echo "http-server started with PID: $HTTP_SERVER_PID" | tee /dev/fd/3

source "/home/jonathanweston/.virtualenvs/pimoroni/bin/activate"
echo "Capturing Screenshot..." | tee /dev/fd/3

# Run the first Python script and wait for completion
cd ~/pi/epaper
python3 capture-screenshot.py | tee /dev/fd/3

echo "Updating screen..." | tee /dev/fd/3

# Run the second Python script after the first one finishes
python3 display-image.py | tee /dev/fd/3

echo "Stopping servers..." | tee /dev/fd/3

# Kill both processes
kill $NODE_PID | tee /dev/fd/3
NODE_PID_2=$(sudo lsof -ti tcp:5000)
echo "PID For Port 5000 searched for result = $NODE_PID_2" | tee /dev/fd/3
kill $HTTP_SERVER_PID | tee /dev/fd/3
HTTP_SERVER_PID_2=$(sudo lsof -ti tcp:8080)
echo "PID For Port 8080 searched for result = $HTTP_SERVER_PID_2" | tee /dev/fd/3
echo "Servers stopped." | tee /dev/fd/3