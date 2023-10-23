import { FC } from "react";
import {
  BrowserRouter as Router,
  Routes as Switch,
  Route,
  Navigate,
} from "react-router-dom";

import { Home } from "./pages/Home";
import { Error } from "./pages/Error";

interface RoutesProps {}

export const Routes: FC<RoutesProps> = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Navigate to="/" />} />
        <Route path="*" element={<Error code={404} />} />
      </Switch>
    </Router>
  );
};
