import {Tab} from 'react-bootstrap';
import {Button, Form} from 'react-bootstrap';
import React, { useState } from 'react';
import Tabs from 'react-bootstrap/Tabs';
import store from 'store'
import { CandidateType, CandidatsMap } from '../types';
import { useSimulationContext } from './IsSimulationContext';

type InputProps = {
  indexOfInput: string,
  nameOfParty: string,
  defaultValue?: CandidateType,
  candidatesByParty: CandidatsMap 
}

type Props = {
  parties: string[],
  candidatesByParty: CandidatsMap
}

type InputValue = 'name' | 'district' | 'number'

export const getCandidatFromMap = ({ indexOfInput, nameOfParty, candidatesByParty }: InputProps) => {
    const candidatesArray = candidatesByParty.get(nameOfParty)
    if (!candidatesArray) return undefined;

    return candidatesArray[parseInt(indexOfInput)]
}

const saveInStore = (party: string, candidatesByParty: CandidatsMap) => {
  const candidatesList = candidatesByParty.get(party)

  if (!candidatesList) return

  store.set(party, candidatesList)
}

const deleteFromStore = (party: string) => {
  store.remove(party)
}

export const initialCandidatsMap = (parties: string[]) => {
  const newCandidatsMap = new Map() as CandidatsMap
  parties.forEach(party => {
    const candidates = store.get(party)
    if (candidates) {
      newCandidatsMap.set(party, candidates)
    }
  })
  return newCandidatsMap
}

const initialCandidatsInputs = ({ parties, candidatesByParty }: Props) => {
  return parties.map(party => {
    const candidates = store.get(party)

    if (candidates) {
      candidatesByParty.set(party, candidates)
      return candidates.map((candidate: CandidateType, i: number) =>
        <InputsParty key={`inputs-number-${i}`} indexOfInput={i.toString()} nameOfParty={party} candidatesByParty={candidatesByParty} defaultValue={candidate}/>
      )
    } else {
      return [<InputsParty key='0' indexOfInput={'0'} candidatesByParty={candidatesByParty} nameOfParty={party}/>]
    }
  })
} 

export function CandidatesList(props: Props) {
    const { parties, candidatesByParty } = props
    const [key, setKey] = useState(0);
    const [arrayInputs, setArrayInputs] = useState(initialCandidatsInputs(props));

    function addInputsToTable() {
        const index = arrayInputs[key].length
        arrayInputs[key].push(<InputsParty key={index} candidatesByParty={candidatesByParty} indexOfInput={index.toString()} nameOfParty={parties[key]} />)
        setArrayInputs([ ...arrayInputs ]);
    }

    return (
        <>
        <div className="candidates-list">
        <Tabs
        id="tab"
        activeKey={key}
        onSelect={(k: React.SetStateAction<string>) => setKey(k as unknown as number)}
        >
            {parties.map((party: any)=> <Tab key={party} eventKey={parties.indexOf(party)} title={party}>
                {arrayInputs[key]}
            </Tab>)}
        </Tabs>
        <Button variant="outline-primary" type="button" className="button-plus candidate-plus" onClick={addInputsToTable}>+</Button>
        <div className='d-flex w-100 justify-content-between'>
            <Button
              variant="outline-primary"
              type="button"
              className="button-cancel"
              onClick={() => {
                const party = parties[key];
                deleteFromStore(party)
                arrayInputs[key] = [<InputsParty candidatesByParty={candidatesByParty} key='0' indexOfInput={'0'} nameOfParty={party}/>]
                candidatesByParty.set(party, [])
                setArrayInputs([ ...arrayInputs ]);
            }}
            >
              Обнулити список
            </Button>
            <Button variant="outline-primary" type="button" className="button-save" onClick={() => saveInStore(parties[key], candidatesByParty)}>Обновити список</Button>
        </div>
        </div>
        </>
    );
}

function InputsParty(props: InputProps) {

    const defaultValue = props.defaultValue || getCandidatFromMap(props)

    function getValue(event: any, type: 'name' | 'district' | 'number'){
        let newArray = props.candidatesByParty.get(props.nameOfParty);
        const value = event.target.value;
        
        if (!newArray) {
            const newObj = {} as any;
            newObj[type] = value
            newArray = [ newObj ]
        } else {
            const index = parseInt(props.indexOfInput);
            const candidate = newArray[index] || {} as any
            candidate[type] = value
            newArray[index] = { ...candidate }
        }
        
        props.candidatesByParty.set(props.nameOfParty, newArray);
    }

    return (
        <>
        <div className="candidate-info">
            <div className="candidate-info__name">
            <Form.Control type="text"
                name={props.indexOfInput}
                defaultValue={defaultValue?.name}
                onChange={(e) => getValue(e, 'name')}
                className="input"
                placeholder="ПІБ"/>
            </div>
            <div className="candidate-info__district">
            <Form.Control type="text"
                name={props.indexOfInput}
                defaultValue={defaultValue?.district}
                onChange={(e) => getValue(e, 'district')}
                className="input candidate-info__district"
                placeholder="Округ"/>
            </div>
            <div className="candidate-info__number">
            <Form.Control type="text"
                name={props.indexOfInput}
                defaultValue={defaultValue?.number}
                onChange={(e) => getValue(e, 'number')}
                className="input candidate-info__number"
                placeholder="Номер по округу"/>
            </div>
            
        </div>
        </>
    );
}

export default CandidatesList