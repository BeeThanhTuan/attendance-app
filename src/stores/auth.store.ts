import { create } from "zustand";

interface AuthState {
  accessToken: string | null;

  login: (accessToken: string) => void;
  logout: () => void;
  setAccessToken: (accessToken: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: localStorage.getItem("access_token"),

  login: (accessToken) => {
    localStorage.setItem("access_token", accessToken);

    set({
      accessToken,
    });
  },

  setAccessToken: (accessToken) => {
    if (accessToken) {
      localStorage.setItem("access_token", accessToken);
    } else {
      localStorage.removeItem("access_token");
    }

    set({
      accessToken,
    });
  },

  logout: () => {
    localStorage.removeItem("access_token");

    set({
      accessToken: null,
    });
  },
}));