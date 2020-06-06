import React, { useState, useMemo } from "react";
import { Form, Button } from "react-bootstrap";
import QuotaTable from "./QuotaTable";

const data = {
  parties: ["OC", "MOD", "react"],
  districts: [123, 124, 125],
  threshold: 123
};

export default function OuotaInput() {
  const [clickCalculate, setClickCalculate] = useState(false);
  const renderTable = useMemo(() => <QuotaTable data={data} />, [
    clickCalculate
  ]);
  let mandate = 0;

  function getValueMandate(event: any) {
    mandate = event.target.value;
  }

  function CalculateTable() {
    setClickCalculate(clickCalculate => !clickCalculate);
  }

  return (
    <>
      <Form className="quota-form">
        <div className="form-inputs__left">
          <Form.Control
            onChange={getValueMandate}
            type="text"
            className="quota-form__input input"
            placeholder="Введіть кількість мандатів"
          />
        </div>
        <div className="form-inputs__left">
          <Button
            variant="primary"
            type="button"
            className="button-calculate"
            onClick={CalculateTable}
          >
            {clickCalculate ? "Скасувати" : "Розрахувати"}
          </Button>
        </div>
      </Form>
      {clickCalculate && renderTable}
    </>
  );
}
