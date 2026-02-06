import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const fetch = () =>
    {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
        try {
            setUserState(JSON.parse(storedUser));
        } catch (err) {
            console.error("Failed to parse user from localStorage:", err);
            setUserState(null);
        }
        }
        setLoading(false);
    }

    fetch();
  }, []);

  // Wrapper to update state AND localStorage
  const setUser = (newUser) => {
    setUserState(newUser);
    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("user");
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}

// Hook for easy access
export function useUserContext() {
  return useContext(UserContext);
}
