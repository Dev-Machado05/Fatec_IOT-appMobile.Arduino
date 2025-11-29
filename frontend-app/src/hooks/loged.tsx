import { useEffect, useState } from "react";
import { supabase } from "./authConnection/conection";

/**
 * Hook: useLogged
 * - Retorna true se a chave `loged` no localStorage for "true"
 * - Escuta evento `storage` para manter o estado sincronizado entre abas
 */
function useLogged(): boolean {
  const [isLogged, setIsLogged] = useState<boolean>(() => {
    return localStorage.getItem("loged") === "true";
  });

  useEffect(() => {
    // valida se existe algum usuario conectado
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const logged = !!user;
      setIsLogged(logged);
      localStorage.setItem("loged", logged.toString());
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const logged = !!session;
      setIsLogged(logged);
      localStorage.setItem("loged", logged.toString());
    });

    // funcao em caso de mundanca de estado
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "loged") {
        setIsLogged(e.newValue === "true");
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => {
      subscription.unsubscribe();
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return isLogged;
}

export default useLogged;