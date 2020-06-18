import React from "react";
import MainPage from "./components/MainPage";
import { useSimulationContext } from './components/IsSimulationContext'
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import BeforeText from "./components/BeforeText";

function App() {
  const { toggleSimulation, isSimulation } = useSimulationContext()

  return <div id='app'>
    <BeforeText />
    <BootstrapSwitchButton
        checked={isSimulation}
        onlabel='Режим симуляції'
        offlabel='Ручний режим'
        onChange={toggleSimulation}
    />
    <MainPage />
  </div>;
}

export default App;
