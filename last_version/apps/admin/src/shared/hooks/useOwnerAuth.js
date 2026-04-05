import { useEffect, useState } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut, getIdTokenResult } from "firebase/auth";
import { auth } from "../api/firebase";

export function useOwnerAuth() {
  const [state, setState] = useState({ loading: true, user: null, claims: null, error: "" });

  useEffect(() => {
    let refreshTimer = null;

    const hydrateUserClaims = async (user, forceRefresh = true) => {
      const token = await getIdTokenResult(user, forceRefresh);
      setState({ loading: false, user, claims: token.claims || {}, error: "" });
    };

    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        if (refreshTimer) {
          clearInterval(refreshTimer);
          refreshTimer = null;
        }
        setState({ loading: false, user: null, claims: null, error: "" });
        return;
      }

      try {
        await hydrateUserClaims(user, true);
      } catch (e) {
        setState((prev) => ({
          ...prev,
          loading: false,
          user,
          error: e.message || "Failed to validate session claims"
        }));
      }

      if (refreshTimer) clearInterval(refreshTimer);
      refreshTimer = setInterval(async () => {
        try {
          if (auth.currentUser) {
            await hydrateUserClaims(auth.currentUser, true);
          }
        } catch (_error) {}
      }, 5 * 60 * 1000);
    });

    return () => {
      if (refreshTimer) clearInterval(refreshTimer);
      unsub();
    };
  }, []);

  return {
    ...state,
    login: async (email, password) => {
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (e) {
        setState((prev) => ({ ...prev, error: e.message || "Login failed" }));
      }
    },
    logout: () => signOut(auth)
  };
}
