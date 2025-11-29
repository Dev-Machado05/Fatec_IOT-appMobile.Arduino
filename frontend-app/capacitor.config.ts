import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.fatecauth',
  appName: 'fatecAuth',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    App: {
      schemes: ['fatecauth', 'supabaseauth']
    }
  }
};

export default config;
