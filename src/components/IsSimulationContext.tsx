import React, { useContext, createContext, useState } from 'react';

type Simulation = {
  isSimulation: boolean,
  toggleSimulation?: () => void,
}

export const SimulationContext = createContext<Simulation>({ isSimulation: false });

export const useSimulationContext = () =>
  useContext(SimulationContext)

export const SimulationProvider = (props: React.PropsWithChildren<{}>) => {
  const [ isSimulation, setSimulation  ] = useState(false)
  console.log(isSimulation)
  return <SimulationContext.Provider value={{ isSimulation, toggleSimulation: () => setSimulation(!isSimulation) }}>
    {props.children}
  </SimulationContext.Provider>
}