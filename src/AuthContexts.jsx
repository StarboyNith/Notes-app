import React, { createContext, useContext, useEffect, useState } from "react";
import { auth,googleProvider } from "./firebase";
import { signInWithPopup } from "firebase/auth";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  const [navVisible, setNavVisible] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate()
  function toogleNavbar() {
    setNavVisible((prevState) => !prevState);
  }

  async function signup(email, password) {
    return await createUserWithEmailAndPassword(auth, email, password);
  }

  async function login(email, password) {
    return await signInWithEmailAndPassword(auth, email, password);
  }
  async function signInWithGoogle() {
     await signInWithPopup(auth,googleProvider);
     navigate("/")
  }
  

  async function logOut() {
    toogleNavbar();
    return await signOut(auth);
  }
  async function passReset(email) {
    return await sendPasswordResetEmail(auth, email);
  }
  async function changeEmail(email) {
    return await updateEmail(currentUser, email);
  }

  async function changePassword(password) {
    return await updatePassword(currentUser, password);
  }

  async function handleLogOut() {
    try {
      setError("");
      await logOut();
      navigate("/");
    } catch {
      setError("Failed to Logout");
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);
  const value = {
    currentUser,
    signup,
    login,
    signInWithGoogle,
    logOut,
    toogleNavbar,
    navVisible,
    handleLogOut,
    changeEmail,
    changePassword,
  };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
