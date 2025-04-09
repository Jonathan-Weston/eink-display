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

echo "Node server started..." | tee /dev/fd/3

cd ~/pi/reactapp/build
# Start http-server
npx http-server | 
    while read line; 
    do echo "[$(date '+%Y-%m-%d %H:%M:%S')] $line"; 
    done >> $LOGFILE &
HTTP_SERVER_PID=$(sudo lsof -ti tcp:8080)
echo "http-server started with PID: $HTTP_SERVER_PID" | tee /dev/fd/3

# Log the start of the sleep with a loading bar
echo "Sleeping for 60 seconds at: $(date '+%Y-%m-%d %H:%M:%S')" | tee /dev/fd/3
echo -n "Progress: " | tee /dev/fd/3
for i in {1..120}; do
    echo -n "#" | tee /dev/fd/3
    sleep 1
done

source "/home/jonathanweston/.virtualenvs/pimoroni/bin/activate"
echo "Capturing Screenshot..." | tee /dev/fd/3

# Run the first Python script and wait for completion
cd ~/pi/epaper
python3 capture-screenshot.py | tee /dev/fd/3

echo "Updating screen..." | tee /dev/fd/3

# Run the second Python script after the first one finishes
python3 display-image.py | tee /dev/fd/3

echo "Stopping servers..." | tee /dev/fd/3
NODE_PID=$(sudo lsof -ti tcp:5000)
# Kill both processes
kill $NODE_PID | tee /dev/fd/3
echo "PID For Port 5000 searched for result = $(sudo lsof -ti tcp:5000)" | tee /dev/fd/3

HTTP_SERVER_PID=$(sudo lsof -ti tcp:8080)
kill $HTTP_SERVER_PID | tee /dev/fd/3
echo "PID For Port 8080 searched for result = $(sudo lsof -ti tcp:8080)" | tee /dev/fd/3
echo "Servers stopped." | tee /dev/fd/3

exit 0;