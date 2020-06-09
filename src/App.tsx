import React from "react";
import MainPage from "./components/MainPage";
import { useSimulationContext } from './components/IsSimulationContext'
import BootstrapSwitchButton from 'bootstrap-switch-button-react'

function App() {
  const { toggleSimulation, isSimulation } = useSimulationContext()

  return <>
    <BootstrapSwitchButton
        checked={isSimulation}
        onlabel='Режим симуляції'
        offlabel='Ручний режим'
        onChange={toggleSimulation}
    />
    <MainPage />
  </>;
}

export default App;
