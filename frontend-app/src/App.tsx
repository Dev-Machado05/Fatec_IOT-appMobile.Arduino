import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import LandingPage from "./pages/LandingPage/LandingPage";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */

import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";
import Home from "./pages/home/home";
import ResetPasswordMailer from "./pages/resetMailer/SendReset";
import ChangePassword from "./pages/ChangePassword/ChangePassword";
import { useDeepLinks } from "./hooks/useDeepLinks";
// import loged from "./hooks/loged";

setupIonicReact();

const App: React.FC = () => {
  // Inicializa o sistema de deep links
  useDeepLinks();

  return (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/LandingPage">
          <LandingPage />
        </Route>
        <Route exact path="/Login">
          <Login />
        </Route>
        <Route exact path="/SignUp">
          <SignUp />
        </Route>
        <Route exact path="/Home">
          <Home />
        </Route>
        <Route exact path="/ResetMailer">
          <ResetPasswordMailer />
        </Route>
        <Route exact path="/NewPassword">
          <ChangePassword />
        </Route>
        <Route exact path="/">
          <Redirect to="/LandingPage" />
        </Route>
        <Route exact path="ValPassword">
          <Redirect to="/LandingPage" /> {/*Retirar isso*/}
          {/* implementar pagina de Validação */}
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
  );
};

export default App;
