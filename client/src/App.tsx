import { FC } from "react";

import styles from "/src/assets/scss/app.module.scss";

import { Routes } from "./Routes";

interface AppProps {}

export const App: FC<AppProps> = () => {
  return (
    <div className={styles["app-wrapper"]}>
      <Routes />
    </div>
  );
};
