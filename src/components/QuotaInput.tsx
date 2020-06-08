import React, { useState, useMemo } from "react";
import { Form, Button } from "react-bootstrap";
import QuotaTable from "./QuotaTable";
import { passingParties, inputsValue } from "../data";

let mandates = 0;
let quota = 0;

export default function OuotaInput(props: any) {
  const { partiesVotesSum, thresholdVotes, passingPartiesVotes } = props;
  const [clickCalculate, setClickCalculate] = useState(false);

  const renderTable = useMemo(() => {return <QuotaTable quota={quota} />;
  }, [clickCalculate]);

  function filterPassingParties() {
    const parties = inputsValue.parties;
    partiesVotesSum.forEach((sum: number, partyIndex: number) => {
      if (sum > thresholdVotes) {
        const party = parties[partyIndex];
        if (!passingParties.get(party)) {
          passingParties.set(
            party,
            new Array(inputsValue.districts.length).fill(0)
          );
          console.log("kek", thresholdVotes);
        }
      }
    });
  }

  function calculateQuota() {
    filterPassingParties();
    quota = passingPartiesVotes / mandates;
  }

  function getValuemandates(event: any) {
    mandates = event.target.value;
    calculateQuota();
    filterPassingParties();
  }

  function CalculateTable() {
    filterPassingParties();
    setClickCalculate(clickCalculate => !clickCalculate);
  }

  return (
    <>
      <Form className="quota-form">
        <div className="form-inputs__left">
          <Form.Control
            onChange={getValuemandates}
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