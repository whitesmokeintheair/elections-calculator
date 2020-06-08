import React, { useState, useMemo } from "react";
import { Form, Button } from "react-bootstrap";
import PartiesTable from "./PartiesTable";
import { inputsValue } from "../data";

const isInputs = () => {
  return !!(
    inputsValue.districts.length &&
    inputsValue.parties.length &&
    inputsValue.threshold
  );
};

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
  const [arrayInputs, setInputs] = useState([<Input key="0" name={0} />]);
  const [clickSave, setClickSave] = useState(false);
  const renderTable = useMemo(() => <PartiesTable data={inputsValue} />, [
    clickSave
  ]);

  const fillTable = () => {
    inputsValue.parties.forEach((party: string) => {
      const tableRow = inputsValue.table.get(party)
      console.log(tableRow)
      if (!tableRow || tableRow.length === 0) {
        console.log(tableRow)
        inputsValue.table.set(
          party,
          new Array(inputsValue.districts.length).fill(0)
        );
      }
    });
  };

  function AddInput() {
    setInputs(arrayInputs.concat(<Input name={arrayInputs.length} />));
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
    inputsValue["threshold"] = parseInt(event.target.value, 10);
  }

  return (
    <>
      <Form>
        <div className="form-inputs">
          <div className="form-inputs__left">
            <form className="form-inputs__parties">{arrayInputs}</form>
            <Button
              variant="outline-primary"
              type="button"
              className="button-plus"
              onClick={AddInput}
            >
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
