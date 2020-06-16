import React, { useState, useMemo } from "react";
import { Form, Button } from "react-bootstrap";
import PartiesTable from "./PartiesTable";
import { inputsValue, mockInputsValue } from "../data";
import { useSimulationContext } from "./IsSimulationContext";

const isInputs = () => {
  return !!(
    inputsValue.districts.length &&
    inputsValue.parties.length &&
    inputsValue.threshold
  );
};

export default function PartiesInputs() {
  const { isSimulation } = useSimulationContext()
  const [valueInInput, setValueInInput] = useState('');
  const [clickSave, setClickSave] = useState(false);
  const [ listParties, setList ] = useState(inputsValue.parties)
  const renderTable = useMemo(() => <PartiesTable data={inputsValue} />, [ clickSave ]);
  const [ thresholdError, setThresholdError ] = useState(false);
  const [ turnoutError, setTurnoutError ] = useState(false);

  if (isSimulation) return <PartiesTable data={mockInputsValue} />

  const fillTable = () => {
    inputsValue.parties.forEach((party: string) => {
      const tableRow = inputsValue.table.get(party)
      if (!tableRow || tableRow.length === 0) {
        inputsValue.table.set(
          party,
          new Array(inputsValue.districts.length).fill(0)
        );
      }
    });
  };

  function ChangeInput(event: any) {
    const input = event.target.value;
    setValueInInput(valueInInput => input);
    event.preventDefault();
  }

  function SaveInputValueToArray() {
    const index = inputsValue["parties"].length;
    const parties = valueInInput.split(',');
    parties.forEach((value, i) => {
      inputsValue["parties"][index + i] = value;
    })
    setValueInInput('');
  }

  function SaveInputsValueToArray(e: any) {
    const parties = e.target.value.split(',') as string[]
    inputsValue["parties"] = parties
    setList(parties)
  }

  function Save() {
    setClickSave(clickSave => !clickSave);
    fillTable();
  }

  function getValueDistriscts(event: any) {
    let stringDistricts = event.target.value;
    inputsValue["districts"] = stringDistricts
      .split(",")
      .map((dist: any) => parseInt(dist, 10));
  }

  function getValueThreshold(event: any) {
    const value = parseInt(event.target.value, 10);
    if(value < 100){
      inputsValue["threshold"] = value;
    } else{
      setThresholdError(true);
    }
  }

  function getValueTurnout(event: any) {
    const value = parseInt(event.target.value, 10);
    if(value < 100){
      inputsValue["turnout"] = value;
    } else{
      setTurnoutError(true);
    }
  }

  return (
    <>
      <Form>
        <div className="form-inputs">
          <div className="form-inputs__left">
            <div className="form-inputs_parties">
              <Form.Control
                value={valueInInput}
                onChange={ChangeInput}
                className="form-inputs__party input"
                type="text"
                placeholder="Введіть назву партії"
              />
            </div>
            <Button
              variant="outline-primary"
              type="button"
              className="button-plus"
              onClick={SaveInputValueToArray}
            >
              +
            </Button>
            <Form.Control
              className='mt-3'
              as="textarea"
              rows={2}
              value={listParties}
              onChange={SaveInputsValueToArray}
            />
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
              onInput = {() => setThresholdError(false)}
              type="text"
              className="form-inputs__threshold input"
              placeholder="Введіть прохідний поріг"
            />
            {thresholdError && <span className='error'> Поріг не може бути більше 100% </span>}
            <Form.Control
              onChange={getValueTurnout}
              onInput = {() => setTurnoutError(false)}
              type="text"
              className="form-inputs__turnout input"
              placeholder="Введіть загальну явку"
            />
            {turnoutError && <span className='error'> Явка не може бути більше 100% </span>}
            <Button
              variant="primary"
              type="button"
              className="form-inputs__button-save"
              onClick={Save}
            >
              Згенерувати
            </Button>
          </div>
        </div>
      </Form>
      {isInputs() && renderTable}
    </>
  );
}