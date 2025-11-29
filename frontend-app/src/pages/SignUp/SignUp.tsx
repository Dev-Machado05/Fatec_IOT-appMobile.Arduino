import {
  IonButton,
  IonInput,
  IonItem,
  IonAlert
} from "@ionic/react";
import getTheme from "../../components/getTheme/getTheme";
import { useEffect, useState } from "react";
import "./SignUp.css";
import "../global.css";
import { signUp } from "../../hooks/authConnection/functions";
import { useHistory } from "react-router";

const SignUp = () => {
  // variáveis

  const [name, setName] = useState<string>(
    localStorage.getItem("name") || ""
  );
  const [email, setEmail] = useState<string>(
    localStorage.getItem("email") || ""
  );
  const [password, setPassword] = useState<string>("");
  const [confPassword, setConfPassword] = useState<string>("");
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [errorTitle, setErrorTitle] = useState<string>("")
  const history = useHistory();

  // --- funções ---

  const validateItems = () => {
    if (email.trim() === "" || password.trim() === "") {
      setErrorMessage("preencha os campos antes de continuar...");
      setErrorTitle('Atenção!!');
      return false;
    }

    // validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("email inválido");
      setErrorTitle('Atenção!!');
      return false;
    }

    // validação de senha
    if (password.length < 6) {
      setErrorMessage("A senha precisa ter no minimo 6 caracteres");
      setErrorTitle('Atenção!!');
      return false;
    }
    
    // confirmação de senha
    if (password !== confPassword) {
      setErrorMessage("As senhas digitadas são diferentes");
      setErrorTitle('Atenção!!');
      return false;
    }

    return true;
  };

  async function handleSignUp() {
    if (validateItems()) {
      const res = await signUp(email, password, name);

      if (res.success) {
        console.log("const");7
        history.push("/Home");
      } else {
        setErrorMessage("Erro ao efetuar o cadastro.");
        setErrorTitle('Atenção!!');
        console.error("Erro ao efetuar o cadastro: ", res.error);
        setShowError(true);
      }
    }

    setShowError(true);
  }

  // useEffects

  useEffect(() => {
    localStorage.setItem("name", name);
    localStorage.setItem("email", email);

    console.log(getTheme());
  }, []);

  return (
    <main className={`signUp_container ${getTheme()}Default_background`}>
      <section className="signUp_content">
        <h1 className={`signUp_title ${getTheme()}_title`}>Sign-Up</h1>
        <section className="input_container">
          <IonItem>
            <IonInput
              label="Nome"
              labelPlacement="floating"
              fill="outline"
              placeholder="Digite o seu nome..."
              type="text"
              onIonChange={(e) => {
                setName(e.detail.value || "");
              }}
            />
          </IonItem>
          <IonItem>
            <IonInput
              label="Email"
              labelPlacement="floating"
              fill="outline"
              placeholder="Digite o seu email..."
              type="email"
              onIonChange={(e) => {
                setEmail(e.detail.value || "");
              }}
            />
          </IonItem>
          <IonItem>
            <IonInput
              label="Senha: "
              labelPlacement="floating"
              fill="outline"
              placeholder="Digite a sua senha..."
              type="password"
              onIonChange={(e) => {
                setPassword(e.detail.value || "");
              }}
            />
          </IonItem>
          <IonItem>
            <IonInput
              label="confirmar senha:"
              labelPlacement="floating"
              fill="outline"
              placeholder="Digite a sua senha novamente..."
              type="password"
              onIonChange={(e) => {
                setConfPassword(e.detail.value || "");
              }}
            />
          </IonItem>
        </section>
        <section className="link_container">
          <a href="/Login">Já tem uma conta? Conecte-se!</a>
          <a href="/ResetMailer">Esqueceu a senha?</a>
        </section>
        <IonButton
          onClick={() => {
            handleSignUp();
          }}
          className={`signUp_button ${getTheme()}_button `}
          expand="block"
        >
          Cadastrar
        </IonButton>
      </section>
      <IonAlert 
      isOpen={showError}
      header={errorTitle}
      message={errorMessage}
      buttons={['ok']}
      onDidDismiss={() => {setShowError(false)}}

      >
      </IonAlert>
    </main>
  );
};

export default SignUp;
