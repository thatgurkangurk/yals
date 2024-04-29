mkdir -p /data
chown yals:bunjs /data -R
chmod o+w /data -R

# Command to run
cmd="bun run scripts/start.ts"

if [ -n "$ORIGIN" ]; then
    cmd="ORIGIN=$ORIGIN $cmd"
fi

if [ -n "$PROTOCOL_HEADER" ]; then
    cmd="PROTOCOL_HEADER=$PROTOCOL_HEADER $cmd"
fi

if [ -n "$HOST_HEADER" ]; then
    cmd="HOST_HEADER=$HOST_HEADER $cmd"
fi

# Execute the command
eval "$cmd"
