import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/router";

export const LogInToken = createContext<{
  token: string | undefined;
  setToken: React.Dispatch<React.SetStateAction<string | undefined>>;
} | null>(null);

function UserContext({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | undefined>();
  const router = useRouter();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = localStorage.getItem("cookieFallback");
        //@ts-ignore
        const currentPath = router.pathname;

        if (storedToken) {
          // If token exists
          setToken(storedToken);
          if (["/", "/login", "/signUp", "/nickname"].includes(currentPath)) {
            // If user is on one of these paths without a token, redirect to "/home"
            router.push("/home");
          }
        } else {
          // If token doesn't exist
          if (!["/signUp", "/login", "/nickname"].includes(currentPath)) {
            // If user is not on one of these paths, redirect to "/signUp"
            router.push("/signUp");
          }
        }
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    fetchToken();
  }, [router, setToken]);

  return (
    <LogInToken.Provider value={{ token, setToken }}>
      {children}
    </LogInToken.Provider>
  );
}

export default UserContext;
