mkdir -p /data
chown yals:bunjs /data -R
chmod o+w /data -R

ORIGIN=$ORIGIN bun run scripts/start.ts
