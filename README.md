# Sistema IoT - Controle de LED com Fotoresistor 📱⚡

Um sistema IoT completo que combina Arduino, APIs middleware e aplicativo móvel para controle inteligente de LED baseado em sensor de luz.

## 📋 Visão Geral

Este projeto implementa um sistema de automação residencial que monitora níveis de luminosidade através de um fotoresistor e controla um LED automaticamente ou manualmente através de um aplicativo móvel. O sistema possui três componentes principais:

- **Arduino**: Hardware com sensor de luz e LED
- **Middleware API**: Servidor backend para comunicação serial e WebSocket
- **Frontend Mobile**: Aplicativo Ionic/React para controle e monitoramento

## 🏗️ Arquitetura do Sistema

```
┌─────────────────┐    Serial    ┌─────────────────┐      API        ┌─────────────────────┐       API       ┌─────────────────┐
│                 │              │                 │                 │                     │                 │                 │
│    Arduino      │◄────────────►│  Middleware API │◄───────────────►│    middleWare       │◄───────────────►│  Mobile App     │
│  (Sensor + LED) │              │   (Node.js)     │                 │  (Node.js/express)  │                 │ (Ionic/React)   │
│                 │              │                 │                 │                     │                 │                 │
└─────────────────┘              └─────────────────┘                 └─────────────────────┘                 └─────────────────┘
```

## 🔧 Componentes

### 🤖 Arduino (`arduino/`)

**Hardware necessário:**
- Arduino Uno/Nano
- Fotoresistor (LDR)
- LED
- Resistores (10kΩ para LDR, 220Ω para LED)

**Funcionalidades:**
- Leitura contínua do fotoresistor (pino A0)
- Controle automático do LED quando luminosidade < 115
- Controle manual via comandos seriais (`led_on`/`led_off`)
- Envio de dados de luminosidade a cada 500ms

### 🌐 Middleware API (`middleware-api/`)

**Tecnologias:**
- Node.js + Express
- SerialPort (comunicação Arduino)
- Socket.IO (WebSocket)
- CORS

**Endpoints:**
- `POST /setLightLevel` - Define nível de luz manualmente
- `POST /toggleLed` - Liga/desliga LED manualmente

**Funcionalidades:**
- Comunicação bidirecional com Arduino via serial
- WebSocket para tempo real com app mobile
- Gerenciamento de estado do LED e luminosidade

### 📱 Frontend Mobile (`frontend-app/`)

**Stack Tecnológico:**
- Ionic 8 + React 19
- Capacitor (deploy nativo)
- TypeScript + Vite
- Supabase (autenticação)
- Cypress (testes E2E)

**Funcionalidades:**
- Sistema completo de autenticação (login/registro)
- Monitoramento em tempo real da luminosidade
- Controle manual do LED
- Reset de senha por email
- Deep linking support
- Deploy Android nativo

## 🚀 Como Executar

### Pré-requisitos
- Node.js 16+
- Arduino IDE
- Android Studio (opcional, para build nativo)
- Cabo USB para Arduino

### 1. Setup do Arduino
```bash
# 1. Conecte o Arduino ao computador
# 2. Abra arduino/arduinoCode/arduinoCode.ino no Arduino IDE
# 3. Selecione a porta COM correta
# 4. Faça upload do código
```

### 2. Middleware API
```bash
cd middleware-api
npm install
node index.js
# Servidor rodando em http://localhost:8080
```

### 3. Arduino Manager (Opcional)
```bash
cd arduinoManager-app
npm install
node index.js
```

### 4. Frontend Mobile
```bash
cd frontend-app
npm install
npm run dev
# Desenvolvimento em http://localhost:8100

# Para build Android:
npm run build
npx cap add android
npx cap run android
```

## 📡 Configuração de Autenticação

O projeto usa Supabase para autenticação. Configure no painel do Supabase:

**Site URLs:**
```
http://localhost:8100
https://seu-dominio.com
```

**Redirect URLs:**
```
io.ionic.starter://auth/callback
http://localhost:8100/auth/callback
```

Consulte `frontend-app/MOBILE_AUTH_SETUP.md` para configuração completa.

## 🔌 Esquema de Conexões

```
Arduino Uno:
├── A0 → Fotoresistor → GND (com resistor 10kΩ)
├── A1 → LED → GND (com resistor 220Ω)
└── USB → Computador (comunicação serial)
```

## 📊 Fluxo de Funcionamento

1. **Arduino** lê continuamente o fotoresistor
2. Se luminosidade ≤ 115: permite controle manual via serial
3. Se luminosidade > 115: LED desliga automaticamente
4. **Middleware API** recebe dados via serial e distribui via WebSocket
5. **Mobile App** recebe dados em tempo real e permite controle manual

## 🧪 Testes

```bash
# Testes unitários
cd frontend-app
npm run test.unit

# Testes E2E com Cypress
npm run test.e2e
```

## 📱 Recursos do App Mobile

- ✅ Login/Registro seguro
- ✅ Monitoramento em tempo real
- ✅ Controle manual de LED
- ✅ Reset de senha
- ✅ Deep linking
- ✅ Build nativo Android
- ✅ Interface responsiva

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **SerialPort** - Comunicação Arduino
- **Socket.IO** - WebSocket real-time

### Frontend
- **Ionic 8** - Framework híbrido
- **React 19** - Interface de usuário
- **Capacitor** - Deploy nativo
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Supabase** - Backend as a Service

### Hardware
- **Arduino** - Microcontrolador
- **C++** - Linguagem do firmware

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é educacional e desenvolvido para fins acadêmicos.

## 👨‍💻 Desenvolvedor

- **Repository**: [Dev-Machado05/Fatec_IOT-appMobile.Arduino](https://github.com/Dev-Machado05/Fatec_IOT-appMobile.Arduino)

---

**💡 Dica**: Para melhor experiência, mantenha o Arduino conectado e os três serviços rodando simultaneamente!