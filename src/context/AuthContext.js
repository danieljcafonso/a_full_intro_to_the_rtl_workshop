import { createContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { login, register } from "../api/carsAPI";
import useLocalStorage from "../hooks/useLocalStorage";

export const AuthContext = createContext();

export const AuthStore = () => {
  const { mutate } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (data.length) setLoggedUser(data[0]);
    },
  });
  const { mutate: registerMutate } = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      if (data) setLoggedUser(data);
    },
  });

  const [loggedUser, setLoggedUser] = useLocalStorage("loggedUser", null);

  const logout = () => {
    setLoggedUser(null);
  };

  return { login: mutate, register: registerMutate, logout, loggedUser };
};

const AuthProvider = (children) => {
  return <AuthContext.Provider value={AuthStore()} {...children} />;
};

export default AuthProvider;
