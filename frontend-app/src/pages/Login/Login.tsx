import {
  IonAlert,
  IonApp,
  IonButton,
  IonContent,
  IonInput,
  IonItem
} from "@ionic/react";
import "./Login.css";
import "../global.css";
import { useEffect, useState } from "react";
import getTheme from "../../components/getTheme/getTheme";
import { signIn } from "../../hooks/authConnection/functions";
import { useHistory } from "react-router";

const Login = () => {
  const history = useHistory();
  // --- variáveis ---

  const [email, setEmail] = useState<string>(
    localStorage.getItem("loginEmail") || ""
  );
  const [password, setPassword] = useState<string>("");
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('')

  // --- funções ---

  const validateItems = (): boolean => {
    if (!email.trim() || !password.trim()) {
      setErrorMessage("preencha os campos antes de continuar...");
      return false;
    }

    // validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Email inválido");
      return false;
    }

    // validação de senha
    if (password.length < 6) {
      setErrorMessage("Senha inválida");
      return false;
    }

    return true;
  };

  async function handleLogin() {
    if (validateItems()) {
      const res = await signIn(email, password);

      if (res.success) {
        console.log("login realizado com sucesso!");
        setShowError(false);
        history.push("/Home");
      } else {
        console.error("Erro ao efetuar o login: ", res.error);
        setErrorMessage("Erro ao efetuar o login");
        setShowError(true);
        // adicionar alert em caso de erro
      }
    }
  }

  // --- useEffects ---

  useEffect(() => {
    localStorage.setItem("loginEmail", email);

    console.log(getTheme());
  }, []);

  return (
    <main className={`login_container ${getTheme()}Default_background`}>
      <section className="login_content">
        <h1 className={`login_title ${getTheme()}_title`}>Login</h1>
        <section className="input_container">
          <IonItem>
            <IonInput
              label="Email:"
              labelPlacement="floating"
              fill="outline"
              type="email"
              placeholder="Digite o seu email..."
              onIonChange={(e) => {
                setEmail(e.detail.value || "");
              }}
            />
          </IonItem>
          <IonItem>
            <IonInput
              label="Senha:"
              labelPlacement="floating"
              fill="outline"
              type="password"
              placeholder="Digite a sua senha..."
              onIonChange={(e) => {
                setPassword(e.detail.value || "");
              }}
            />
          </IonItem>
        </section>
        <section className="link_container">
          <a href="/SignUp">Não tem uma conta? Cadastre-se!</a>
          <a href="/ResetMailer">Esqueceu a senha?</a>
        </section>
        <IonButton
          onClick={() => {
            handleLogin();
          }}
          className={`login_button ${getTheme()}_button `}
          expand="block"
        >
          Conectar-se
        </IonButton>
      </section>
      <IonAlert
        isOpen={showError}
        header="Atenção!!"
        message={errorMessage}
        buttons={["ok"]}
        onDidDismiss={() => {
          setShowError(false);
        }}
      ></IonAlert>
    </main>
  );
};

export default Login;
