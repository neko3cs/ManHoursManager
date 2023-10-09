import React from "react";
import ReactDOM from "react-dom/client";
import { CssBaseline } from "@mui/material";
import { Provider } from "react-redux";
import { store } from "./Store";
import { App } from "./App";

export const DATABASE_CONNECTION = "sqlite:ManHoursManager.db";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <CssBaseline />
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);