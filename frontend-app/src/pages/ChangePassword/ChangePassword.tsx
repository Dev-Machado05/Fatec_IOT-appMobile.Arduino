import { IonAlert, IonButton, IonInput, IonItem } from "@ionic/react";
import getTheme from "../../components/getTheme/getTheme";
import { useEffect, useState } from "react";
import { sendNewPassword } from "../../hooks/authConnection/functions";
import { useHistory, useParams } from "react-router-dom";
import { supabase } from "../../hooks/authConnection/conection";

const ChangePassword = () => {
  const history = useHistory();
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [isPasswordUpdated, setIsPasswordUpdated] = useState<boolean>(false);
  const [messageTitle, setMessageTitle] = useState<string>("");
  const [redirectUrl, setRedirectUrl] = useState<string>("")
  const [device, setDevice] = useState<"Mobile" | "Desktop">("Desktop");
  const [message, setMessage] = useState<string>("");
  // const { accessToken, refreshToken, accessType } = useParams<{ accessToken: string, refreshToken: string, accessType: string }>();

  // --- funções ---
  async function handleResetPassword() {
    if (newPassword === confirmNewPassword) {
      const resp = await sendNewPassword(newPassword);
      if (resp.success) {
        setMessageTitle("Sucesso!!");
        setMessage("Senha alterada com sucesso, conecte-se com a nova senha");
        setIsPasswordUpdated(true);
      } else if (resp.error) {
        setMessageTitle("Atenção!!");
        setMessage(String(resp.error));
      } else {
        setMessageTitle("Atenção!!");
        setMessage("Um erro inesperado ocorreu, tente novamente mais tarde...");
      }
    } else if (newPassword.trim() === "") {
      setMessageTitle("Aviso!!");
      setMessage("Digite uma senha antes de prosseguir...");
    } else {
      setMessageTitle("Aviso!!");
      setMessage("As senhas digitadas são diferentes...");
    }
    setShowMessage(true);
  }

  // Verificar se usuário tem sessão ativa para reset de senha
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (!session) {
        console.log('Nenhuma sessão ativa encontrada');
        setMessageTitle('Erro de Autenticação');
        setMessage('Sessão expirada. Solicite um novo link de reset.');
        setShowMessage(true);
        setTimeout(() => {
          history.push('/ResetMailer');
        }, 3000);
      } else {
        console.log('Sessão ativa encontrada para reset de senha');
      }
    };
    checkSession();
  }, [history]);

  // useEffect(() => {
  //   setRedirectUrl(`fatecauth://reset-password?access_token=${accessToken}&refresh_token=${refreshToken}&type=${accessType}`)
  // }, [accessToken, refreshToken, accessType]);

  return (
    <main className={`sendReset_container ${getTheme()}Default_background`}>
      <section className="sendReset_content">
        <h1 className={`sendReset_title ${getTheme()}_title`}>
          Reset Password
        </h1>
        <section className="input_container">
          <IonItem>
            <IonInput
              label="Nova senha:"
              labelPlacement="floating"
              fill="outline"
              type="password"
              placeholder="Digite a nova senha..."
              value={newPassword}
              onIonChange={(e) => {
                setNewPassword(e.detail.value || "");
              }}
            />
          </IonItem>
          <IonItem>
            <IonInput
              label="Confirmação senha:"
              labelPlacement="floating"
              fill="outline"
              type="password"
              placeholder="digete a senha novamente..."
              value={confirmNewPassword}
              onIonChange={(e) => {
                setConfirmNewPassword(e.detail.value || "");
              }}
            />
          </IonItem>
        </section>
        <section className="link_container">
          <a href="/Login">já tem uma conta? conecte-se!</a>
        </section>
        <IonButton
          onClick={() => {
            handleResetPassword();
          }}
          className={`sendReset_button ${getTheme()}_button `}
          expand="block"
        >
          Trocar senha
        </IonButton>
      </section>
      <IonAlert
        isOpen={showMessage}
        header={messageTitle}
        message={message}
        buttons={
          isPasswordUpdated && device === "Mobile"
            ? [{ text: "Continuar no site" /* handler?*/ }, { text: "Ir para o App" }]
            : ["ok"]
        }
        onDidDismiss={() => {
          isPasswordUpdated ? history.push("/Login") : setShowMessage(false); // validar o que fazer aqui...
        }}
      ></IonAlert>
    </main>
  );
};

export default ChangePassword;

/*
const {accessToken, refreshToken, type} = useParams();
const appUrl = `fatecauth://reset-password?access_token=${accessToken}&refresh_token=${refreshToken}&type=${type}`;

window.location.href = appUrl;

setTimeout(() => {
  console.error("erro ao redirecionar a tela 'time out'")
},   3000)

*/