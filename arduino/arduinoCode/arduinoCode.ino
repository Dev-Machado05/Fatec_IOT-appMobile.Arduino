// photoresistor & led pin
const int ptrPin = A0;
const int ledPin = A1;

String serialLine = ""; 

void setup() {
  Serial.begin(9600);
  pinMode(ledPin, OUTPUT);
}

void loop() {
  int ldrValue = analogRead(ptrPin);
  
  if (ldrValue <= 115 ) {
    serialLine = Serial.readStringUntil('\n');
    serialLine.trim();

    if (serialLine == "led_on") {
      digitalWrite(ledPin, HIGH);
    } else if (serialLine == "led_off") {
      digitalWrite(ledPin, LOW);
    }
  } else if (ldrValue > 115) {
    digitalWrite(ledPin, LOW);
  }
  Serial.println(ldrValue);

  delay(500);
}
