import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { registerSW } from "virtual:pwa-register";

registerSW({
  onNeedRefresh() {
    if (confirm("Update tersedia! Muat ulang sekarang?")) {
      location.reload();
    }
  },
  onOfflineReady() {
    console.log("donlodinka siap digunakan offline!");
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
