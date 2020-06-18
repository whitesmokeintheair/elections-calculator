import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.css";
import App from "./App";
import { SimulationProvider } from "./components/IsSimulationContext";
import Footer from "./components/Footer";

ReactDOM.render(<SimulationProvider><App /><Footer /></SimulationProvider>, document.getElementById("root"));
