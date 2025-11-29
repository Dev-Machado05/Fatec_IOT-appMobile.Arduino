import { supabase } from "./conection";

// funcao cadastro
export async function signUp(email: string, password: string, name: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
      },
    });
    if (error) {
      console.error("Erro no cadastro:", error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err) {
    console.error("Erro inesperado ao efetuar o cadastro: ", err);
    return { success: false, error: "Erro inesperado" };
  }
}

// funcao login
export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Erro no Login: ", error.message);
      return { success: false, error: error.message };
    }

    //salvar login State
    localStorage.setItem("loged", "true");
    return { success: true, data };
  } catch (err) {
    console.error("Erro ao conectar à conta: ", err);
    return { success: false, error: err };
  }
}

// funcao logout
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Erro no logout:", error.message);
      return { success: false, error: error.message };
    }

    // atualiza login state
    localStorage.setItem("loged", "false");
    return { success: true };
  } catch (err) {
    console.error("Erro inseperado ao efetuar o logout: ", err);
    return { success: false, error: err || "erro inesperado" };
  }
}

// funcao obter usuário
export async function getCurrentUser() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch (err) {
    console.error("Erro ao obter usuário: ", err);
    return null;
  }
}

// funcao mandar email p/ reset
export async function sendResetEmail(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://dev-machado05.github.io/Fatec_redirectSupabase/",
    });
    
    if (error) {
      console.error("Erro ao enviar email de reset:", error.message);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (err) {
    console.error("erro inesperado ao enviar o email", err);
    return { success: false, error: "Erro inesperado ao enviar email" };
  }
}

// funcao nova senha
export async function sendNewPassword(password: string) {
  try {
    const { error } = await supabase.auth.updateUser({ password: password });
    
    if (error) {
      console.error("Erro ao atualizar senha:", error.message);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (err) {
    console.error("Erro inesperado ao atualizar senha:", err);
    return { success: false, error: "Erro inesperado ao atualizar senha" };
  }
}
