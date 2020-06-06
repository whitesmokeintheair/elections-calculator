import React, { useState, useMemo } from 'react';
import {Form, Button} from 'react-bootstrap';
import PartiesTable from './PartiesTable';

type PartiesTableProps = {
    parties: string[],
    districts: number[],
    threshold: number
}
  
let inputsValue : PartiesTableProps = {
    parties: [],
    districts: [],
    threshold: 0
};

const isInputs = () => {
  console.log(!!(inputsValue.districts.length && inputsValue.parties.length && inputsValue.threshold))
  return !!(inputsValue.districts.length && inputsValue.parties.length && inputsValue.threshold)
}
  
function Input(props: any) {
    function Change(event: any) {
      inputsValue["parties"][props.name] = event.target.value;
      event.preventDefault();
    }
  
    return (
      <Form.Control
        name={props.name}
        onChange={Change}
        className="form-inputs__party input"
        type="text"
        placeholder="Введіть назву партії"
      />
    );
}
  
export default function PartiesInputs() {
    const [arrayInputs, setInputs] = useState([<Input key='0' name={0} />]);
    const [clickSave, setClickSave] = useState(false);
    const renderTable = useMemo(() => <PartiesTable data={inputsValue}/>, [clickSave])
    
    function AddInput() {
      setInputs(arrayInputs.concat(<Input key={arrayInputs.length + 1} name={arrayInputs.length} />));
    }

    function Save() {
        setClickSave(clickSave => !clickSave);
    }

    function getValueDistriscts(event: any) {
      let stringDistricts = event.target.value;
      inputsValue["districts"] = stringDistricts.split(',').map((dist: any) => parseInt(dist, 10));
    }

    function getValueThreshold(event: any) {
      inputsValue["threshold"] = parseInt(event.target.value, 10);
    }

    return (
        <>
        <Form>
      <div className="form-inputs">
        <div className="form-inputs__left">
          <form className="form-inputs__parties">{arrayInputs}</form>
          <Button variant="outline-primary" type="button" className="button-plus" onClick={AddInput}>
            +
          </Button>
        </div>
  
        <div className="form-inputs__right">
          <Form.Control
            onChange={getValueDistriscts}
            type="text"
            className="form-inputs__districts input"
            placeholder="Введіть округи (через кому)"
          />
          <Form.Control
            onChange={getValueThreshold}
            type="text"
            className="form-inputs__threshold input"
            placeholder="Введіть прохідний поріг"
          />
          <Button variant="primary" type="button" className="form-inputs__button-save" onClick={Save}>
            Згенерувати
          </ Button>
        </ div>
      </div>
      </Form>
        {isInputs() && renderTable}
      </>
    );
}