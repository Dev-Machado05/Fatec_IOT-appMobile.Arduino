import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonText,
  IonButton,
  IonApp,
} from "@ionic/react";
import "./LandingPage.css";
import { useHistory } from "react-router";

const LandingPage: React.FC = () => {
  const history = useHistory();

  return (
    <IonApp className="landingPage_container">
      <IonHeader>
        <IonToolbar>
          <IonTitle>LandingPage</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true}>
        <main className="landingPage_content">
          <IonText>App IOT</IonText>
          <IonButton
            onClick={() => {
              history.push("Login");
            }}
          >
            conecte-se
          </IonButton>
        </  main>
      </IonContent>
    </IonApp>
  );
};

export default LandingPage;
