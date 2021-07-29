import firebase from "firebase";
import { useState, useEffect, useContext, createContext } from "react";

firebase.initializeApp({
  apiKey: "AIzaSyAdPlfS0Cs6cZPy2ItGoTDi9So78u9_6YU",
  authDomain: "studyi-b6a90.firebaseapp.com",
  projectId: "studyi-b6a90",
  storageBucket: "studyi-b6a90.appspot.com",
  messagingSenderId: "890335735465",
  appId: "1:890335735465:web:495c86dbd2badeaebb83b8",
  measurementId: "G-Q7YRFJ8B43",
});

const AuthContext = createContext(null);

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider hook that creates auth object and handles state
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  // Wrap any Firebase methods we want to use making sure ...
  // ... to save the user to state.

  const login = (email, password) => {
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        // Signed in
        setUser(result.user);
        return true;
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // Subscribe to user on mount
  // Because this sets state in the callback it will cause any ...
  // ... component that utilizes this hook to re-render with the ...
  // ... latest auth object.
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log("Authenticated.");
      } else {
        console.log("Not Authenticated.");
      }
      setUser(user);
      setIsAuthenticating(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const values = {
    user,
    isAuthenticating,
    login,
  };

  return (
    <AuthContext.Provider value={values}>
      {!isAuthenticating && children}
    </AuthContext.Provider>
  );
};
