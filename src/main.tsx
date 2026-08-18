import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/app/App";
import Providers from "@/app/providers";
import { registerSW } from "virtual:pwa-register";

import "src/styles/globals.css";

// Đăng ký service worker – bắt buộc để PWA hoạt động
registerSW({ immediate: true });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>
);