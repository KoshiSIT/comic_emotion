#!/bin/bash
# Set ulimit
ulimit -c unlimited

# Execute the passed command
exec "$@"