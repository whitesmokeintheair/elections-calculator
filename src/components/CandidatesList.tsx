import {Tab} from 'react-bootstrap';
import {Button, Form} from 'react-bootstrap';
import React, { useState } from 'react';
import Tabs from 'react-bootstrap/Tabs';

let candidatsByParty = new Map<string, any[]>();

type Props = {
    indexOfInput: string,
    nameOfParty: string
}

type InputValue = 'name' | 'district' | 'number'

const getValueForInput = ({ indexOfInput, nameOfParty }: Props, type: InputValue) => {
    const candidatsArray = candidatsByParty.get(nameOfParty)
    if (!candidatsArray) return undefined;

    const candidat = candidatsArray[parseInt(indexOfInput)]

    return candidat ? candidat[type] : undefined
}

export default function CandidatesList(props: any) {
    const [key, setKey] = useState('0');
    const [arrayInputs, setArrayInputs] = useState(props.parties.map((party: any)=>[<InputsParty key='0' indexOfInput={'0'} nameOfParty={party}/>]));

    function addInputsToTable() {
        const index = arrayInputs[key].length
        arrayInputs[key].push(<InputsParty key={index} indexOfInput={index} nameOfParty={props.parties[key]} />)
        setArrayInputs([ ...arrayInputs ]);
    }

    return (
        <>
        <div className="candidates-list">
        <Tabs
        id="tab"
        activeKey={key}
        onSelect={(k: React.SetStateAction<string>) => setKey(k)}
        >
            {props.parties.map((party: any)=> <Tab key={party} eventKey={props.parties.indexOf(party)} title={party}>
                {arrayInputs[key]}
            </Tab>)}
        </Tabs>
        <Button variant="outline-primary" type="button" className="button-plus candidat-plus" onClick={addInputsToTable}>+</Button>
        <Button variant="outline-primary" type="button" className="button-cancel">Скасувати</Button>
        <Button variant="outline-primary" type="button" className="button-save">Зберегти</Button>
        </div>
        <Button variant="primary" type="button" className="add-candidates-to-table">Додати в таблицю</Button>
        </>
    );
}

function InputsParty(props: Props) {

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
                defaultValue={getValueForInput(props, 'name')}
                onChange={(e) => getValue(e, 'name')}
                 className="input"
                 placeholder="ПІБ"/>
            </div>
            <div className="candidat-info__district">
            <Form.Control type="text"
                name={props.indexOfInput}
                defaultValue={getValueForInput(props, 'district')}
                onChange={(e) => getValue(e, 'district')}
                 className="input candidat-info__district"
                 placeholder="Округ"/>
            </div>
            <div className="candidat-info__number">
            <Form.Control type="text"
                name={props.indexOfInput}
                defaultValue={getValueForInput(props, 'number')}
                onChange={(e) => getValue(e, 'number')}
                 className="input candidat-info__number"
                 placeholder="Номер по округу"/>
            </div>
            
        </div>
        </>
    );
}