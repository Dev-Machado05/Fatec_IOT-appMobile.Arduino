# FatecAuth - Aplicativo de Autenticação Ionic

## 📱 Sobre o Projeto

FatecAuth é uma aplicação mobile híbrida desenvolvida com Ionic React e Capacitor, focada em autenticação de usuários. O aplicativo oferece funcionalidades completas de gerenciamento de conta, incluindo cadastro, login, reset de senha e autenticação via deep links.

### 🚀 Tecnologias Utilizadas

- **Ionic React** v8.7.11 - Framework para desenvolvimento mobile híbrido
- **React** v19.0.0 - Biblioteca JavaScript para UI
- **Capacitor** v7.4.3 - Runtime nativo para web apps
- **Supabase** v2.79.0 - Backend-as-a-Service com autenticação
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e bundler
- **Axios** - Cliente HTTP
- **Socket.io** - Comunicação em tempo real

## 📋 Funcionalidades

### ✅ Autenticação
- [x] Login de usuários
- [x] Cadastro de novos usuários
- [x] Reset de senha via email
- [x] Validação de senha
- [x] Landing page
- [x] Deep linking para recuperação de senha

### 🔧 Recursos Técnicos
- [x] Armazenamento cross-platform com Capacitor Preferences
- [x] Suporte completo a plataformas móveis (Android)
- [x] Detecção automática de plataforma
- [x] Temas personalizáveis
- [x] Componentes reutilizáveis

## 📁 Estrutura do Projeto

```
src/
├── components/           # Componentes reutilizáveis
│   ├── ExploreContainer/ 
│   ├── AuthCallback/     # Callback de autenticação
│   └── getTheme/        # Utilitários de tema
├── hooks/               # Hooks customizados
│   ├── loged.tsx        # Hook de estado de login
│   ├── useDeepLinks.ts  # Hook para deep links
│   └── authConnection/  # Conexões de autenticação
├── pages/               # Páginas da aplicação
│   ├── LandingPage/     # Página inicial
│   ├── Login/           # Página de login
│   ├── SignUp/          # Página de cadastro
│   ├── ChangePassword/  # Alteração de senha
│   ├── resetMailer/     # Envio de reset por email
│   ├── ValPassword/     # Validação de senha
│   └── home/           # Página principal
└── theme/              # Temas e estilos globais
```

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn
- Android Studio (para builds Android)
- Ionic CLI

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd frontend-app
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto com suas configurações do Supabase:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Execute o projeto
```bash
# Desenvolvimento web
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## 📱 Desenvolvimento Mobile

### Android
```bash
# Adicionar plataforma Android (primeira vez)
ionic capacitor add android

# Sincronizar arquivos
ionic capacitor sync android

# Abrir no Android Studio
ionic capacitor open android

# Build e executar
ionic capacitor run android
```

## 🔧 Configuração do Supabase

### 1. URLs de Configuração
No painel do Supabase, configure as seguintes URLs em **Authentication > URL Configuration**:

**Site URLs:**
```
http://localhost:8100
https://seu-dominio.com
```

**Redirect URLs:**
```
http://localhost:8100/auth/callback
https://seu-dominio.com/auth/callback
io.ionic.fatecauth://auth/callback
```

### 2. Provedores de Autenticação
Configure os provedores necessários no dashboard do Supabase.

## 🧪 Testes

### Testes Unitários
```bash
npm run test.unit
```

### Testes E2E (Cypress)
```bash
npm run test.e2e
```

## 📝 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Gera build de produção |
| `npm run preview` | Preview da build |
| `npm run test.unit` | Executa testes unitários |
| `npm run test.e2e` | Executa testes E2E |
| `npm run lint` | Executa linter |

## 🎨 Customização de Tema

O aplicativo suporta temas personalizáveis através do arquivo `src/theme/variables.css`. Você pode ajustar cores, fontes e outros estilos globais.

## 📄 Documentação Adicional

- [MOBILE_AUTH_SETUP.md](./MOBILE_AUTH_SETUP.md) - Configuração detalhada de autenticação mobile
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Guia de testes
- [ionic-react-tutorial.md](./ionic-react-tutorial.md) - Tutorial Ionic React

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE).

## 👥 Autor

Desenvolvido para o projeto IoT Act.

## 🐛 Problemas Conhecidos

Para problemas relacionados à autenticação mobile, consulte [MOBILE_AUTH_SETUP.md](./MOBILE_AUTH_SETUP.md).

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a [documentação](./MOBILE_AUTH_SETUP.md)
2. Consulte as [issues](../../issues) do repositório
3. Crie uma nova issue se necessário