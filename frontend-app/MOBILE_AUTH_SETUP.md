# Configuração de Autenticação Mobile com Supabase

## Problemas Solucionados

### 1. **URL de Redirect Hardcoded**
- **Problema**: A URL `http://localhost:8100/NewPassword` só funciona em desenvolvimento web
- **Solução**: Implementada detecção automática da plataforma e URLs dinâmicas

### 2. **Armazenamento Local**
- **Problema**: `localStorage` tem limitações em apps móveis
- **Solução**: Implementado `@capacitor/preferences` para armazenamento cross-platform

### 3. **Deep Linking**
- **Problema**: Links de reset de email não funcionam em apps nativos
- **Solução**: Implementado suporte completo a deep links

## Configurações Necessárias

### 1. **Supabase Dashboard**

No painel do Supabase, vá em **Authentication > URL Configuration** e adicione as seguintes URLs:

#### Site URLs:
```
http://localhost:8100
https://seu-dominio.com (para produção)
```

#### Redirect URLs:
```
http://localhost:8100/NewPassword
https://seu-dominio.com/NewPassword
io.ionic.starter://auth/NewPassword
```

### 2. **Configuração do App ID**

No arquivo `capacitor.config.ts`, substitua `io.ionic.starter` pelo seu App ID único:

```typescript
const config: CapacitorConfig = {
  appId: 'com.seudominio.seuapp', // Substitua por seu App ID
  appName: 'Seu App Name',
  // ...
};
```

### 3. **Atualizar AndroidManifest.xml**

Se você mudou o App ID, atualize também o `android/app/src/main/AndroidManifest.xml`:

```xml
<data android:scheme="com.seudominio.seuapp" android:host="auth" />
```

### 4. **URLs de Redirect no Supabase**

Adicione a nova URL com seu App ID nas configurações do Supabase:
```
com.seudominio.seuapp://auth/NewPassword
```

## Como Funciona

### Web (Desenvolvimento)
1. Usuário solicita reset de senha
2. Email enviado com link: `http://localhost:8100/NewPassword?access_token=...`
3. Usuário clica no link e é redirecionado para a página de nova senha

### Mobile (Dispositivo)
1. Usuário solicita reset de senha
2. Email enviado with link: `io.ionic.starter://auth/NewPassword?access_token=...`
3. Usuário clica no link no email
4. App abre automaticamente via deep link
5. Hook `useDeepLinks` processa os tokens
6. Usuário é redirecionado para a página de nova senha

## Funcionalidades Implementadas

### Cross-Platform Storage
```typescript
// Funciona tanto no web quanto no mobile
await Storage.setItem("key", "value");
const value = await Storage.getItem("key");
```

### Deep Link Handler
```typescript
// Automaticamente processa links de autenticação
useDeepLinks(); // Usado no App.tsx
```

### URL Dinâmica para Reset
```typescript
// Automaticamente usa a URL correta baseada na plataforma
const redirectUrl = getRedirectUrl('/NewPassword');
```

## Comandos para Build

### Sincronizar com Capacitor
```bash
npm run build
npx cap sync
```

### Executar no Android
```bash
npx cap run android
```

### Executar no iOS (se configurado)
```bash
npx cap run ios
```

## Testando Deep Links

### Android (via ADB)
```bash
adb shell am start \
  -W -a android.intent.action.VIEW \
  -d "io.ionic.starter://auth/NewPassword?access_token=test&refresh_token=test" \
  io.ionic.starter
```

### iOS (via Simulator)
```bash
xcrun simctl openurl booted "io.ionic.starter://auth/NewPassword?access_token=test&refresh_token=test"
```

## Troubleshooting

### Link de Reset não Abre o App
1. Verifique se o App ID no `capacitor.config.ts` corresponde ao `AndroidManifest.xml`
2. Confirme se a URL está registrada no Supabase
3. Execute `npx cap sync` após mudanças

### Tokens não são Processados
1. Verifique os logs no console para erros
2. Confirme se o `useDeepLinks` hook está sendo chamado no `App.tsx`
3. Teste com URL completa incluindo todos os parâmetros

### App não Abre em Produção
1. Adicione seu domínio de produção nas URLs do Supabase
2. Configure HTTPS para links de produção
3. Teste deep links com o App ID correto

## Segurança

- ✅ Links de reset funcionam apenas uma vez
- ✅ Tokens têm expiração automática
- ✅ Deep links validam tokens antes de processar
- ✅ Redirecionamento seguro para páginas apropriadas