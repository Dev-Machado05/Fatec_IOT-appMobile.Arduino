# Tutorial: Implementando Middleware MQTT em App Ionic/React

Este tutorial explica como integrar o middleware MQTT com um aplicativo Ionic/React para controlar e monitorar dispositivos Arduino.

## 📋 Visão Geral da Arquitetura

```
Arduino ↔ ArduinoManager ↔ Middleware MQTT ↔ App Ionic/React
```

O middleware atua como ponte entre o ArduinoManager e sua aplicação frontend, fornecendo:
- API REST para comandos
- WebSocket para dados em tempo real
- Comunicação MQTT bidirecional

## 🔧 Pré-requisitos

### No Servidor (Middleware)
- Node.js 14+
- Broker MQTT (Mosquitto recomendado)
- Pacotes NPM: `mqtt`, `express`, `socket.io`, `cors`

### No App Ionic/React
- Ionic CLI: `npm install -g @ionic/cli`
- React 18+
- Pacotes necessários (veremos na instalação)

## 🚀 Configuração Inicial

### 1. Preparando o Ambiente Ionic/React

```bash
# Criar novo projeto Ionic/React
ionic start iot-controller blank --type=react

# Navegar para o projeto
cd iot-controller

# Instalar dependências para comunicação
npm install socket.io-client axios @ionic/react @ionic/react-router
```

### 2. Configuração do Middleware

Certifique-se de que o middleware está rodando:

```bash
# No diretório do middleware
node middleware.js
```

O middleware estará disponível em:
- HTTP API: `http://localhost:3001`
- WebSocket: `http://localhost:3001`

## 📱 Implementação no Ionic/React

### 1. Criando o Serviço de Comunicação

Crie `src/services/ArduinoService.ts`:

```typescript
import { io, Socket } from 'socket.io-client';

export interface ArduinoData {
  temperature?: number;
  humidity?: number;
  lightLevel?: number;
  timestamp: string;
}

export interface SystemStatus {
  arduinoManager: boolean;
  mqtt: boolean;
  lastData: ArduinoData | null;
}

class ArduinoService {
  private socket: Socket | null = null;
  private readonly baseUrl = 'http://localhost:3001';
  
  // Callbacks para eventos
  private onDataCallback: ((data: ArduinoData) => void) | null = null;
  private onStatusCallback: ((status: SystemStatus) => void) | null = null;
  private onConnectionCallback: ((connected: boolean) => void) | null = null;

  // Conectar ao WebSocket
  connect(): Promise<boolean> {
    return new Promise((resolve) => {
      this.socket = io(this.baseUrl);
      
      this.socket.on('connect', () => {
        console.log('✅ Conectado ao middleware');
        if (this.onConnectionCallback) {
          this.onConnectionCallback(true);
        }
        resolve(true);
      });

      this.socket.on('disconnect', () => {
        console.log('❌ Desconectado do middleware');
        if (this.onConnectionCallback) {
          this.onConnectionCallback(false);
        }
      });

      // Receber dados do Arduino
      this.socket.on('arduino-data', (data: ArduinoData) => {
        console.log('📨 Dados recebidos:', data);
        if (this.onDataCallback) {
          this.onDataCallback(data);
        }
      });

      // Receber status do sistema
      this.socket.on('system-status', (status: SystemStatus) => {
        console.log('📊 Status do sistema:', status);
        if (this.onStatusCallback) {
          this.onStatusCallback(status);
        }
      });

      // Status do ArduinoManager
      this.socket.on('arduino-manager-status', (status: any) => {
        console.log('🔗 Status ArduinoManager:', status);
      });
    });
  }

  // Desconectar WebSocket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Registrar callbacks
  onData(callback: (data: ArduinoData) => void) {
    this.onDataCallback = callback;
  }

  onSystemStatus(callback: (status: SystemStatus) => void) {
    this.onStatusCallback = callback;
  }

  onConnection(callback: (connected: boolean) => void) {
    this.onConnectionCallback = callback;
  }

  // Enviar comando via WebSocket
  sendCommand(command: string) {
    if (this.socket?.connected) {
      this.socket.emit('send-arduino-command', command);
      console.log('📤 Comando enviado:', command);
    } else {
      console.warn('⚠️ WebSocket não conectado');
    }
  }

  // Controlar LED via WebSocket
  controlLed(state: 'on' | 'off' | 'toggle') {
    if (this.socket?.connected) {
      this.socket.emit('control-led', state);
      console.log('💡 LED controlado:', state);
    } else {
      console.warn('⚠️ WebSocket não conectado');
    }
  }

  // Métodos HTTP alternativos
  async sendCommandHTTP(command: string) {
    try {
      const response = await fetch(`${this.baseUrl}/api/arduino/command`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command }),
      });
      return await response.json();
    } catch (error) {
      console.error('❌ Erro ao enviar comando HTTP:', error);
      throw error;
    }
  }

  async controlLedHTTP(state: 'on' | 'off' | 'toggle') {
    try {
      const response = await fetch(`${this.baseUrl}/api/arduino/led`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ state }),
      });
      return await response.json();
    } catch (error) {
      console.error('❌ Erro ao controlar LED HTTP:', error);
      throw error;
    }
  }

  async getStatus() {
    try {
      const response = await fetch(`${this.baseUrl}/api/status`);
      return await response.json();
    } catch (error) {
      console.error('❌ Erro ao buscar status:', error);
      throw error;
    }
  }
}

export default new ArduinoService();
```

### 2. Criando Hooks Personalizados

Crie `src/hooks/useArduino.ts`:

```typescript
import { useState, useEffect } from 'react';
import ArduinoService, { ArduinoData, SystemStatus } from '../services/ArduinoService';

export const useArduino = () => {
  const [arduinoData, setArduinoData] = useState<ArduinoData | null>(null);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Configurar callbacks
    ArduinoService.onData(setArduinoData);
    ArduinoService.onSystemStatus(setSystemStatus);
    ArduinoService.onConnection((connected) => {
      setIsConnected(connected);
      setIsLoading(false);
    });

    // Conectar
    ArduinoService.connect();

    // Cleanup
    return () => {
      ArduinoService.disconnect();
    };
  }, []);

  const sendCommand = (command: string) => {
    ArduinoService.sendCommand(command);
  };

  const controlLed = (state: 'on' | 'off' | 'toggle') => {
    ArduinoService.controlLed(state);
  };

  const refreshStatus = async () => {
    try {
      const status = await ArduinoService.getStatus();
      setSystemStatus(status);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  return {
    arduinoData,
    systemStatus,
    isConnected,
    isLoading,
    sendCommand,
    controlLed,
    refreshStatus,
  };
};
```

### 3. Componente Principal do Dashboard

Crie `src/pages/Dashboard.tsx`:

```tsx
import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonItem,
  IonLabel,
  IonBadge,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
} from '@ionic/react';
import {
  thermometerOutline,
  waterOutline,
  bulbOutline,
  flashOutline,
  wifiOutline,
  refreshOutline,
} from 'ionicons/icons';
import { useArduino } from '../hooks/useArduino';

const Dashboard: React.FC = () => {
  const {
    arduinoData,
    systemStatus,
    isConnected,
    isLoading,
    sendCommand,
    controlLed,
    refreshStatus,
  } = useArduino();

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await refreshStatus();
    event.detail.complete();
  };

  if (isLoading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>IoT Controller</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="loading-container">
            <p>Conectando ao middleware...</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>IoT Controller</IonTitle>
          <IonButton
            slot="end"
            fill="clear"
            onClick={refreshStatus}
          >
            <IonIcon icon={refreshOutline} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        {/* Status da Conexão */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Status do Sistema</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem>
              <IonIcon icon={wifiOutline} slot="start" />
              <IonLabel>Middleware</IonLabel>
              <IonBadge color={isConnected ? 'success' : 'danger'}>
                {isConnected ? 'Conectado' : 'Desconectado'}
              </IonBadge>
            </IonItem>
            <IonItem>
              <IonIcon icon={flashOutline} slot="start" />
              <IonLabel>MQTT</IonLabel>
              <IonBadge color={systemStatus?.mqtt ? 'success' : 'danger'}>
                {systemStatus?.mqtt ? 'Online' : 'Offline'}
              </IonBadge>
            </IonItem>
            <IonItem>
              <IonLabel>Arduino Manager</IonLabel>
              <IonBadge color={systemStatus?.arduinoManager ? 'success' : 'danger'}>
                {systemStatus?.arduinoManager ? 'Conectado' : 'Desconectado'}
              </IonBadge>
            </IonItem>
          </IonCardContent>
        </IonCard>

        {/* Dados dos Sensores */}
        {arduinoData && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Dados dos Sensores</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonGrid>
                <IonRow>
                  <IonCol size="4">
                    <div className="sensor-item">
                      <IonIcon icon={thermometerOutline} size="large" />
                      <h3>{arduinoData.temperature?.toFixed(1) || '--'}°C</h3>
                      <p>Temperatura</p>
                    </div>
                  </IonCol>
                  <IonCol size="4">
                    <div className="sensor-item">
                      <IonIcon icon={waterOutline} size="large" />
                      <h3>{arduinoData.humidity?.toFixed(1) || '--'}%</h3>
                      <p>Umidade</p>
                    </div>
                  </IonCol>
                  <IonCol size="4">
                    <div className="sensor-item">
                      <IonIcon icon={bulbOutline} size="large" />
                      <h3>{arduinoData.lightLevel || '--'}</h3>
                      <p>Luminosidade</p>
                    </div>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCardContent>
          </IonCard>
        )}

        {/* Controles */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Controles</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol>
                  <IonButton
                    expand="block"
                    onClick={() => sendCommand('READ_SENSORS')}
                    disabled={!isConnected}
                  >
                    Ler Sensores
                  </IonButton>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonButton
                    expand="block"
                    color="success"
                    onClick={() => controlLed('on')}
                    disabled={!isConnected}
                  >
                    LED ON
                  </IonButton>
                </IonCol>
                <IonCol>
                  <IonButton
                    expand="block"
                    color="danger"
                    onClick={() => controlLed('off')}
                    disabled={!isConnected}
                  >
                    LED OFF
                  </IonButton>
                </IonCol>
                <IonCol>
                  <IonButton
                    expand="block"
                    color="medium"
                    onClick={() => controlLed('toggle')}
                    disabled={!isConnected}
                  >
                    Toggle
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
```

### 4. Estilos CSS

Adicione em `src/pages/Dashboard.css`:

```css
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  text-align: center;
}

.sensor-item {
  text-align: center;
  padding: 16px;
}

.sensor-item h3 {
  margin: 8px 0;
  font-size: 1.5em;
  font-weight: bold;
}

.sensor-item p {
  margin: 0;
  color: var(--ion-color-medium);
  font-size: 0.9em;
}

.sensor-item ion-icon {
  color: var(--ion-color-primary);
  margin-bottom: 8px;
}
```

### 5. Configurando as Rotas

Atualize `src/App.tsx`:

```tsx
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
/* ... outros imports CSS do Ionic */

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/dashboard">
          <Dashboard />
        </Route>
        <Route exact path="/">
          <Redirect to="/dashboard" />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
```

## 🎯 Funcionalidades Implementadas

### ✅ Comunicação em Tempo Real
- WebSocket para dados dos sensores
- Atualizações automáticas de status
- Reconexão automática

### ✅ Controles Interativos
- Botões para comandos do Arduino
- Controle de LED (on/off/toggle)
- Leitura manual de sensores

### ✅ Interface Responsiva
- Design adaptativo para mobile/tablet
- Componentes nativos do Ionic
- Indicadores visuais de status

### ✅ Tratamento de Erros
- Estados de carregamento
- Indicadores de conexão
- Fallbacks para conexão offline

## 🔧 Configurações Avançadas

### 1. Configuração de Ambiente

Crie `.env` na raiz do projeto:

```env
REACT_APP_MIDDLEWARE_URL=http://localhost:3001
REACT_APP_MQTT_BROKER=mqtt://localhost:1883
```

### 2. Modo de Produção

Para produção, configure o proxy no `ionic.config.json`:

```json
{
  "name": "iot-controller",
  "integrations": {
    "capacitor": {}
  },
  "type": "react",
  "proxies": [
    {
      "path": "/api",
      "proxyUrl": "http://your-server.com:3001/api"
    }
  ]
}
```

### 3. Build para Mobile

```bash
# Adicionar plataforma
ionic capacitor add android
ionic capacitor add ios

# Build para produção
ionic build

# Sincronizar com plataformas nativas
ionic capacitor sync

# Executar no dispositivo
ionic capacitor run android --livereload --external
ionic capacitor run ios --livereload --external
```

## 🚨 Solução de Problemas

### Problema: WebSocket não conecta
**Solução:** Verifique se o middleware está rodando e se a URL está correta.

### Problema: CORS Error
**Solução:** O middleware já tem CORS configurado. Para desenvolvimento local, use `--livereload --external`.

### Problema: Dados não atualizam
**Solução:** Verifique se o ArduinoManager está publicando nos tópicos MQTT corretos.

### Problema: Comandos não funcionam
**Solução:** Confirme se o ArduinoManager está subscrito ao tópico `arduinoManager/commands`.

## 📚 Próximos Passos

1. **Histórico de Dados:** Implementar armazenamento local de dados dos sensores
2. **Gráficos:** Adicionar Chart.js para visualização de tendências
3. **Notificações:** Push notifications para alertas
4. **Configurações:** Tela para configurar URLs e parâmetros
5. **Offline Mode:** Funcionalidade offline com sincronização

## 🎉 Conclusão

Com esta implementação, você terá um app Ionic/React completo que se comunica com o middleware MQTT para controlar dispositivos Arduino. A arquitetura é escalável e permite adicionar novos sensores e controles facilmente.

Para dúvidas ou melhorias, consulte a documentação do Ionic/React e do Socket.IO.