import React, { useState } from 'react';

type PartiesTableProps = {
    parties: string[],
    district: number[],
    threshold: number
}
  
let inputsValue : PartiesTableProps = {
    parties: [],
    district: [],
    threshold: 0
};
  
function Input(props: any) {
    function Change(event: any) {
      inputsValue["parties"][props.name] = event.target.value;
      event.preventDefault();
    }
  
    return (
      <input
        name={props.name}
        onChange={Change}
        className="form-inputs__party"
        type="text"
        placeholder="Введіть назву партії"
      />
    );
}
  
export default function FormInputs() {
    const [arrayInputs, setInputs] = useState([<Input name={0} />]);

    function AddInput() {
      setInputs(arrayInputs.concat(<Input name={arrayInputs.length} />));
    }

    function Save() {
      console.log(inputsValue);
    }

    function getValueDistriscts(event: any) {
      let stringDistricts = event.target.value;
      inputsValue["district"] = stringDistricts.split(',').map((dist: any) => parseInt(dist, 10));
    }

    function getValueThreshold(event: any) {
      inputsValue["threshold"] = parseInt(event.target.value, 10);
    }

    return (
      <div className="form-inputs">
        <div className="form-inputs__left">
          <form className="form-inputs__parties">{arrayInputs}</form>
          <button type="button" onClick={AddInput}>
            +
          </button>
        </div>
  
        <div className="form-inputs__right">
          <input
            onChange={getValueDistriscts}
            type="text"
            className="form-inputs__districts"
            placeholder="Введіть округи (через кому)"
          />
          <input
            onChange={getValueThreshold}
            type="text"
            className="form-inputs__threshold"
            placeholder="Введіть прохідний поріг"
          />
          <button type="button" onClick={Save}>
            Згенерувати
          </button>
        </div>
      </div>
    );
}