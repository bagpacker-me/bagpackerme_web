npx next dev -p 3001 &
PID=$!
sleep 5
curl http://localhost:3001/api/seed-packages
kill $PID
