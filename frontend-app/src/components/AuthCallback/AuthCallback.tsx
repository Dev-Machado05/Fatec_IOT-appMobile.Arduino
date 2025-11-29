// import React, { useEffect, useState } from 'react';
// import { IonSpinner, IonText } from '@ionic/react';
// import { useHistory } from 'react-router-dom';
// import { handleAuthCallback } from '../../hooks/authConnection/functions';
// import { Capacitor } from '@capacitor/core';
// import { App } from '@capacitor/app';

// const AuthCallback: React.FC = () => {
//   const history = useHistory();
//   const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
//   const [message, setMessage] = useState<string>('Processando autenticação...');
  
//   useEffect(() => {
//     const processAuthCallback = async () => {
//       try {
//         let url = '';
        
//         if (Capacitor.isNativePlatform()) {
//           // Em dispositivos nativos, obter a URL do deep link
//           const urlParams = new URLSearchParams(window.location.search);
//           url = window.location.href;
          
//           // Se não houver parâmetros na URL atual, tentar obter do último deep link
//           if (!urlParams.get('access_token')) {
//             // Implementar lógica para capturar o último deep link se necessário
//             setStatus('error');
//             setMessage('Link de autenticação inválido ou expirado.');
//             return;
//           }
//         } else {
//           // Na web, usar a URL atual
//           url = window.location.href;
//         }

//         const result = await handleAuthCallback(url);
        
//         if (result.success) {
//           setStatus('success');
//           setMessage('Autenticação realizada com sucesso! Redirecionando...');
          
//           // Aguardar um momento antes de redirecionar
//           setTimeout(() => {
//             history.replace('/NewPassword');
//           }, 2000);
//         } else {
//           setStatus('error');
//           setMessage(String(result.error) || 'Erro ao processar autenticação');
          
//           // Redirecionar para login após alguns segundos
//           setTimeout(() => {
//             history.replace('/Login');
//           }, 3000);
//         }
//       } catch (error) {
//         console.error('Erro no processamento do callback:', error);
//         setStatus('error');
//         setMessage('Erro inesperado ao processar autenticação');
        
//         setTimeout(() => {
//           history.replace('/Login');
//         }, 3000);
//       }
//     };

//     processAuthCallback();
//   }, [history]);

//   return (
//     <div style={{ 
//       display: 'flex', 
//       flexDirection: 'column', 
//       alignItems: 'center', 
//       justifyContent: 'center', 
//       height: '100vh',
//       padding: '20px',
//       textAlign: 'center'
//     }}>
//       {status === 'loading' && (
//         <>
//           <IonSpinner name="crescent" color="primary" />
//           <IonText style={{ marginTop: '20px' }}>
//             <p>{message}</p>
//           </IonText>
//         </>
//       )}
      
//       {status === 'success' && (
//         <>
//           <div style={{ fontSize: '48px', color: 'green', marginBottom: '20px' }}>✓</div>
//           <IonText color="success">
//             <h2>{message}</h2>
//           </IonText>
//         </>
//       )}
      
//       {status === 'error' && (
//         <>
//           <div style={{ fontSize: '48px', color: 'red', marginBottom: '20px' }}>✗</div>
//           <IonText color="danger">
//             <h2>{message}</h2>
//           </IonText>
//           <IonText style={{ marginTop: '10px' }}>
//             <p>Você será redirecionado automaticamente...</p>
//           </IonText>
//         </>
//       )}
//     </div>
//   );
// };

// export default AuthCallback;