#!/bin/bash

echo "Starting Blood Donation Support System..."
echo

echo "Starting Backend (Spring Boot)..."
cd backend
gnome-terminal --title="Backend" -- bash -c "mvn spring-boot:run; exec bash" &

echo "Waiting for backend to start..."
sleep 10

echo "Starting Frontend (React)..."
cd ..
gnome-terminal --title="Frontend" -- bash -c "npm run dev; exec bash" &

echo
echo "Both applications are starting..."
echo "Backend: http://localhost:8080"
echo "Frontend: http://localhost:3000"
echo
echo "Press Ctrl+C to stop all processes..."
wait 