import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import "/src/assets/scss/global.module.scss";

import { App } from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={{}}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
);
