import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.css";
import App from "./App";
import { SimulationProvider } from "./components/IsSimulationContext";

ReactDOM.render(<SimulationProvider><App /></SimulationProvider>, document.getElementById("root"));
