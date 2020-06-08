import {Tab} from 'react-bootstrap';
import {Button, Form} from 'react-bootstrap';
import React, { useState } from 'react';
import Tabs from 'react-bootstrap/Tabs';
import store from 'store'

type CandidatType = {
  name: string,
  district: string,
  number: string
}

type InputProps = {
  indexOfInput: string,
  nameOfParty: string,
  defaultValue?: CandidatType
}

let candidatsByParty = new Map<string, CandidatType[]>();

type InputValue = 'name' | 'district' | 'number'

const getCandidatFromMap = ({ indexOfInput, nameOfParty }: InputProps) => {
    const candidatsArray = candidatsByParty.get(nameOfParty)
    if (!candidatsArray) return undefined;

    return candidatsArray[parseInt(indexOfInput)]
}

const saveInStore = (party: string) => {
  const candidatesList = candidatsByParty.get(party)

  if (!candidatesList) return

  store.set(party, candidatesList)
}

const deleteFromStore = (party: string) => {
  store.remove(party)
}

const initialCandidatsInputs = (parties: string[]) => {
  return parties.map(party => {
    const candidats = store.get(party)

    if (candidats) {
      candidatsByParty.set(party, candidats)
      return candidats.map((candidat: CandidatType, i: number) =>
        <InputsParty key={`inputs-number-${i}`} indexOfInput={i.toString()} nameOfParty={party} defaultValue={candidat}/>
      )
    } else {
      return [<InputsParty key='0' indexOfInput={'0'} nameOfParty={party}/>]
    }
  })
} 

type Props = {
  parties: string[]
}

export default function CandidatesList({ parties }: Props) {
    const [key, setKey] = useState(0);
    const [arrayInputs, setArrayInputs] = useState(initialCandidatsInputs(parties));

    function addInputsToTable() {
        const index = arrayInputs[key].length
        arrayInputs[key].push(<InputsParty key={index} indexOfInput={index.toString()} nameOfParty={parties[key]} />)
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
        <Button variant="outline-primary" type="button" className="button-plus candidat-plus" onClick={addInputsToTable}>+</Button>
        <div className='d-flex w-100 justify-content-space-between'>
            <Button
              variant="outline-primary"
              type="button"
              className="button-cancel"
              onClick={() => {
                const party = parties[key];
                deleteFromStore(party)
                arrayInputs[key] = [<InputsParty key='0' indexOfInput={'0'} nameOfParty={party}/>]
                candidatsByParty.set(party, [])
                setArrayInputs([ ...arrayInputs ]);
            }}
            >
              Обнулити список
            </Button>
            <Button variant="outline-primary" type="button" className="button-save" onClick={() => saveInStore(parties[key])}>Зберегти список</Button>
        </div>
        </div>
        <Button variant="primary" type="button" className="add-candidates-to-table">Додати в таблицю</Button>
        </>
    );
}

function InputsParty(props: InputProps) {

    const defaultValue = props.defaultValue || getCandidatFromMap(props)

    function getValue(event: any, type: 'name' | 'district' | 'number'){
        let newArray = candidatsByParty.get(props.nameOfParty);
        const value = event.target.value;
        
        if (!newArray) {
            const newObj = {} as any;
            newObj[type] = value
            newArray = [ newObj ]
        } else {
            const index = parseInt(props.indexOfInput);
            const candidat = newArray[index] || {} as any
            candidat[type] = value
            newArray[index] = { ...candidat }
        }
        
        candidatsByParty.set(props.nameOfParty, newArray);
    }

    return (
        <>
        <div className="candidat-info">
            <div className="candidat-info__name">
            <Form.Control type="text"
                name={props.indexOfInput}
                defaultValue={defaultValue?.name}
                onChange={(e) => getValue(e, 'name')}
                 className="input"
                 placeholder="ПІБ"/>
            </div>
            <div className="candidat-info__district">
            <Form.Control type="text"
                name={props.indexOfInput}
                defaultValue={defaultValue?.district}
                onChange={(e) => getValue(e, 'district')}
                 className="input candidat-info__district"
                 placeholder="Округ"/>
            </div>
            <div className="candidat-info__number">
            <Form.Control type="text"
                name={props.indexOfInput}
                defaultValue={defaultValue?.number}
                onChange={(e) => getValue(e, 'number')}
                 className="input candidat-info__number"
                 placeholder="Номер по округу"/>
            </div>
            
        </div>
        </>
    );
}