# Script de Teste - Autenticação Mobile

## Teste 1: Verificar Storage Cross-Platform

```typescript
// Teste no console do navegador/dispositivo
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

const testStorage = async () => {
  console.log('Platform:', Capacitor.getPlatform());
  
  // Testar set
  if (Capacitor.isNativePlatform()) {
    await Preferences.set({ key: 'test', value: 'mobile' });
    const result = await Preferences.get({ key: 'test' });
    console.log('Mobile storage test:', result.value);
  } else {
    localStorage.setItem('test', 'web');
    console.log('Web storage test:', localStorage.getItem('test'));
  }
};
```

## Teste 2: Verificar URL de Redirect

```typescript
// No components ou hooks
import { getRedirectUrl } from '../hooks/authConnection/functions';

console.log('Web URL:', getRedirectUrl('/NewPassword'));
// Esperado Web: http://localhost:8100/NewPassword
// Esperado Mobile: io.ionic.starter://auth/NewPassword
```

## Teste 3: Simular Reset de Email

1. **Web**: Acesse `/ResetMailer`, digite um email e clique em "Enviar Email"
2. **Mobile**: Mesmo processo, mas verifique se a mensagem indica para abrir o link no dispositivo

## Teste 4: Deep Link Manual

### Android (ADB):
```bash
adb shell am start -W -a android.intent.action.VIEW -d "io.ionic.starter://auth/NewPassword?access_token=test123&refresh_token=refresh123" io.ionic.starter
```

### Teste no Navegador:
```javascript
// Simular deep link no console
window.location.href = "io.ionic.starter://auth/NewPassword?access_token=test123&refresh_token=refresh123";
```

## Verificação de Logs

Procure por estes logs no console:

### Sucesso:
- ✅ `Platform: android/ios/web`
- ✅ `Reset email sent with redirect: [URL]`
- ✅ `Deep link recebido: [URL]`

### Erro:
- ❌ `Erro ao processar callback:`
- ❌ `Tokens não encontrados na URL`
- ❌ `Link de autenticação inválido`

## Fluxo Completo de Teste

### Cenário 1: Web Development
1. Abrir `http://localhost:8100/ResetMailer`
2. Inserir email válido
3. Clicar em "Enviar Email"
4. Verificar email recebido
5. Clicar no link do email
6. Deve redirecionar para `/NewPassword`

### Cenário 2: Mobile Device
1. Instalar app no dispositivo: `npx cap run android`
2. Abrir página de reset no app
3. Inserir email válido
4. Clicar em "Enviar Email"
5. Abrir email no mesmo dispositivo
6. Clicar no link do email
7. App deve abrir automaticamente
8. Deve navegar para página de nova senha

## Troubleshooting Checklist

- [ ] `@capacitor/preferences` instalado
- [ ] `npm run build && npx cap sync` executados
- [ ] App ID consistente em `capacitor.config.ts` e `AndroidManifest.xml`
- [ ] URLs registradas no Supabase Dashboard
- [ ] Deep links configurados no AndroidManifest
- [ ] Hook `useDeepLinks` ativo no App.tsx

## URLs para Configurar no Supabase

```
Site URLs:
http://localhost:8100
https://seu-dominio.com

Redirect URLs:
http://localhost:8100/NewPassword
https://seu-dominio.com/NewPassword
io.ionic.starter://auth/NewPassword
```

Substitua `io.ionic.starter` pelo seu App ID real!