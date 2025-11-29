import { App } from '@capacitor/app';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { supabase } from './authConnection/conection';

export const useDeepLinks = () => {
  const history = useHistory();

  useEffect(() => {
    // Check for URL that opened the app initially
    App.getLaunchUrl().then(result => {
      if (result && result.url) {
        console.log('🚀 App was launched with URL:', result.url);
        // Process the launch URL the same way as appUrlOpen
        handleDeepLink(result.url);
      }
    });

    // Listen for URLs when app is already running
    App.addListener('appUrlOpen', (event) => {
      console.log('🔗 App opened with URL:', event.url);
      
      // Parse the URL and navigate accordingly
      const url = new URL(event.url);
      // Para custom schemes como fatecauth://reset-password, o host é o path
      const path = url.hostname || url.pathname.replace('/', '');
      
      console.log('📍 Parsed URL details:');
      console.log('  - Full URL:', event.url);
      console.log('  - Protocol:', url.protocol);
      console.log('  - Hostname:', url.hostname);
      console.log('  - Pathname:', url.pathname);
      console.log('  - Search:', url.search);
      console.log('  - Resolved path:', path);

      const params = new URLSearchParams(url.search);
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      const type = params.get('type');
      
      console.log('🔑 Extracted tokens:');
      console.log('  - Access Token:', accessToken ? 'Present' : 'Missing');
      console.log('  - Refresh Token:', refreshToken ? 'Present' : 'Missing');
      console.log('  - Type:', type);
      
      // Navigate based on deep link
      console.log('🎯 Switching on path:', path);
      switch(path) {
        case 'reset-password':
          console.log('✅ Matched reset-password case');
          // Handle password reset with tokens
          if (accessToken && type === 'recovery') {
            console.log('🔐 Valid tokens found, setting session...');
            // Set session with tokens from the deep link
            supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || ''
            }).then(() => {
              console.log('✅ Session set successfully, navigating to /NewPassword');
              history.push('/NewPassword');
            }).catch(error => {
              console.error('❌ Error setting session:', error);
              history.push('/Login');
            });
          } else {
            console.log('❌ Missing tokens for password reset. AccessToken:', !!accessToken, 'Type:', type);
            history.push('/Login');
          }
          break;
        case 'login':
          console.log('✅ Matched login case, navigating to /Login');
          history.push('/Login');
          break;
        case 'home':
          console.log('✅ Matched home case, navigating to /Home');
          history.push('/Home');
          break;
        default:
          console.log('❌ No matching case found for path:', path, '- navigating to home');
          history.push('/');
      }
    });

    return () => {
      App.removeAllListeners();
    };
  }, [history]);
};
function handleDeepLink(url: string) {
  throw new Error('Function not implemented.');
}

