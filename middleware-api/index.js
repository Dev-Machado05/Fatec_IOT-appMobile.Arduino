const express = require("express");
const cors = require("cors");
const { SerialPort } = require("serialport");
const { Server } = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const port = 8080;

app.use(cors());
app.use(express.json());

SerialPort.list().then(ports => console.log(ports));

var lightLevel = 0;
var isLedOn = false;

// WebSocket connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Send current state on connection
  socket.emit('lightLevel', { lightLevel });
  socket.emit('ledState', { led: isLedOn });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

app.post("/setLightLevel", (req, res) => {
  try {
    let rcvLightLevel = req.body.lightLevel;
    if (rcvLightLevel === '' || rcvLightLevel === undefined) {
      lightLevel = 0;
    } else if (parseInt(rcvLightLevel) >= 0){
      lightLevel = parseInt(rcvLightLevel);
    }
    
    // Emit change to all connected clients
    io.emit('lightLevel', { lightLevel });
    
    res.status(200).json({success: true, lightLevel: lightLevel});
  } catch(err) {
    console.error(err);
    res.status(500).json({success: false, error: err.message});
  }
});

app.post("/changeLedState", (req, res) => {
  try {
    let rcvLedState = req.body.led;
    if (rcvLedState === 'on') {
      isLedOn = true; 
    } else if (rcvLedState === 'off') {
      isLedOn = false; 
    } else {
      res.status(500).json({success: false});
    }
    
    res.status(200).json({success: true});
    io.emit('lightLevel', { lightLevel });
  } catch(err) {
    console.error(err);
    res.status(500).json({success: false, error: err.message});
  }
});

app.get("/getLedState", (req, res) => {
  res.status(200).json({led: isLedOn});
});

app.get("/getLightLevel", (req, res) => {
  res.status(200).json({lightLevel: lightLevel});
});

server.listen(port, () => {
  console.log(`server online into http://localhost:${port}`);
});
