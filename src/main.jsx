import React from "react";
import App from "./App";
import "./index.css";
import { store } from "./app/store";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import axios from "axios";

axios.defaults.withCredentials = false;
const container = document.getElementById("root");
const root = createRoot(container);
const { PUBLIC_URL } = import.meta.env;
// console.log(import.meta.env.VITE_API_KEY);
root.render(
  <React.StrictMode>
    <Provider store={store} basename={PUBLIC_URL}>
      <App />
    </Provider>
  </React.StrictMode>
);
