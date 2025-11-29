import { IonAlert, IonButton, IonInput, IonItem } from "@ionic/react";
import "./SendReset.css";
import "../global.css";
import getTheme from "../../components/getTheme/getTheme";
import { useEffect, useState } from "react";
import { sendResetEmail } from "../../hooks/authConnection/functions";

const ResetPasswordMailer = () => {
  const [resetEmail, setResetEmail] = useState<string>(
    localStorage.getItem("resetEmail") || ""
  );
  const [showMessage, setShowMessage] = useState<boolean>();
  const [message, setMessage] = useState<string>();
  const [messageTitle, setMessageTitle] = useState<string>();

  // --- function ---
  async function handleSendResetEmail() {
    const resp = await sendResetEmail(resetEmail);

    if (resp.success) {
      setMessageTitle('Próximo passo:')
      setMessage(
        "Um email para a recuperação da senha foi enviad ao seu email"
      );
    } else if (resp.error) {
      setMessageTitle('Erro:')
      setMessage(String(resp.error));
    } else {
      setMessageTitle('Atenção!')
      setMessage("um erro inesperado ocorreu, tente novamente mais tarde...\nCaso o erro persista, entre em contato conosco");
    }
    setShowMessage(true);
  }

  // --- useEffect ---
  useEffect(() => {
    localStorage.setItem("resetEmail", resetEmail);
  }, [resetEmail]);

  return (
    <main className={`sendReset_container ${getTheme()}Default_background`}>
      <section className="sendReset_content">
        <h1 className={`sendReset_title ${getTheme()}_title`}>
          Reset Password
        </h1>
        <section className="input_container">
          <IonItem>
            <IonInput
              label="Email:"
              labelPlacement="floating"
              fill="outline"
              type="email"
              placeholder="Digite o seu email..."
              value={resetEmail}
              onIonChange={(e) => {
                setResetEmail(e.detail.value || "");
              }}
            />
          </IonItem>
        </section>
        <section className="link_container">
          <a href="/Login">já tem uma conta? conecte-se!</a>
        </section>
        <IonButton
          onClick={() => {
            handleSendResetEmail();
          }}
          className={`sendReset_button ${getTheme()}_button `}
          expand="block"
        >
          Enviar Email
        </IonButton>
      </section>
      <IonAlert
        isOpen={showMessage}
        header={messageTitle}
        message={message}
        buttons={["ok"]}
        onDidDismiss={() => {
          setShowMessage(false);
        }}
      ></IonAlert>
    </main>
  );
};

export default ResetPasswordMailer;
