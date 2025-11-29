const express = require("express");
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

// Configuration
const SERIAL_PORT_PATH = "COM7"; // Change to your Arduino port
const SERIAL_BAUD_RATE = 9600;
const arduinoPort = new SerialPort({
  path: SERIAL_PORT_PATH,
  baudRate: SERIAL_BAUD_RATE,
  autoOpen: false,
});
const parser = arduinoPort.pipe(new ReadlineParser({ delimiter: "\n" }));

// variaveis
var lightValue = 0; // Inicializar com número
var lastLedState = null; // Para evitar comandos desnecessários

arduinoPort.open((err) => {
  if (err) {
    console.error(`Erro ao abrir a porta ${err.message}`);
    return;
  }

  setInterval(async () => {
    try {
      // envia os dados para a api
      const postResp = await fetch("http://localhost:8080/setLightLevel", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lightLevel: lightValue }), // Enviar como objeto
      });

      // comunica ao arduino
      if (lightValue <= 150) {
        const res = await fetch("http://localhost:8080/getLedState");
        const data = await res.json(); // Parse do JSON

        if (data.led !== lastLedState) {
          // Só envia se mudou
          const command = data.led ? "led_on" : "led_off";
          arduinoPort.write(command + "\n", (err) => {
            if (err) {
              console.error("❌ [Serial] Failed to send:", err);
            } else {
              console.log(`📤 [Serial] Sent to Arduino: ${command}`);
              lastLedState = data.led;
            }
          });
        }
      }
    } catch (err) {
      console.error("❌ [API] Error:", err.message);
    }
  }, 1000);
});

parser.on("data", (data) => {
  const rcvData = parseInt(data.trim());
  console.log("📥 Light Level:", rcvData);
  if (!isNaN(rcvData)) {
    lightValue = rcvData;
  }
});

// Handle port events
arduinoPort.on("close", () => {
  console.log("👋 [Serial] Port closed");
});

arduinoPort.on("error", (err) => {
  console.error("❌ [Serial] Port error:", err.message);
});

console.log("⏳ Waiting for Arduino connection...");
