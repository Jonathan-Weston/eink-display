#!/bin/bash

LOGFILE="script_log.log"
source ~/.virtualenvs/pimoroni/bin/activate

echo "Starting first script..." | tee -a $LOGFILE

# Run the first Python script and wait for completion
python3 capture-screenshot.py >> $LOGFILE 2>&1

echo "First script completed. Starting second script..." | tee -a $LOGFILE

# Run the second Python script after the first one finishes
python3 display-image.py >> $LOGFILE 2>&1

echo "Second script completed." | tee -a $LOGFILE
