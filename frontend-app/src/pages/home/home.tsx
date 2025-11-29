import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../../hooks/authConnection/functions";
import "./home.css";

const Home = () => {
  const [user, setUser] = useState<any>("");
  const [ledStatus, setledStatus] = useState<"off" | "on">("off");
  const [iluminationLevel, setIluminationLevel] = useState<number>(0);
  const [iluminationClass, setIluminationClass] =
    useState<string>("carregando...");

  // ------ functions ------

  async function changeLedState () {
    try {
      if (ledStatus === "on") {
        const postResp = await fetch("http://localhost:8080/changeLedState", {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ led: "off" }), // Enviar como objeto
        });
        if (postResp.status === 200) {
          setledStatus("off");
        }
      } else if (ledStatus === "off") {
        const postResp = await fetch("http://localhost:8080/changeLedState", {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ led: "on" }), // Enviar como objeto
        }); 
        if (postResp.status === 200) {
          setledStatus("on");
        }
      }
    } catch (err) {
      console.error("Erro ao alterar o estado do led " + err);
    }
  }

  // ------ useEffect ------

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      setUser(user);
      console.table(user);
      console.log(user?.user_metadata.name);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      console.log("This runs every 5 seconds");
      try {
        const res = await fetch("http://localhost:8080/getLightLevel", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }); 
        const data = await res.json();
        setIluminationLevel(data.lightLevel);
        setIluminationClass(data.lightLevel >= 800 ? 'claro' : data.lightLevel >= 300 ? 'normal' : 'escuro')
      } catch (err) {
        console.error(err);
      }
    }, 750); // tempo
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  if (!user) {
    <h1>Carregando...</h1>;
  } else {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Olá {user?.user_metadata?.name || "Usuário"}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <main className="home_container">
            <section className="arduinoData_container">
              <h1 className="arduinoData_title">Nivel de iluminação</h1>
              <section className="arduinoData_content">
                <p>
                  Classe: <span>{iluminationClass}</span>
                </p>
                <p>
                  Valor Bruto: <span>{iluminationLevel}</span>
                </p>
              </section>
              <IonButton
                disabled={
                  ledStatus === "off" && iluminationLevel > 150
                }
                color={
                  ledStatus === "off" && iluminationLevel > 150
                    ? "danger"
                    : "success"
                }
                onClick={() => {
                  changeLedState();
                }}
              >
                {ledStatus === "off" ? "Ligar LED" : "Desligar LED"}
              </IonButton>
            </section>
          </main>
        </IonContent>
      </IonPage>
    );
  }
};

export default Home;
