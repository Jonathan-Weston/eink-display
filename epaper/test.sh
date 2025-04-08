#!/bin/bash

LOGFILE="server_log.log"

exec 3>&1 1>> >(while read line; do echo "[$(date '+%Y-%m-%d %H:%M:%S')] $line"; done >> $LOGFILE) 2>&1
echo "This is the console" 1>&3
echo "this is the log" 1>&2
echo "this is both" | tee /dev/fd/3