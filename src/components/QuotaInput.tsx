import React, { useState, useMemo } from "react";
import { Form, Button } from "react-bootstrap";
import QuotaTable from "./QuotaTable";
import { passingParties, inputsValue } from "../data";
import { useSimulationContext } from "./IsSimulationContext";

let mandates = 0;
let quota = 0;

export default function OuotaInput(props: any) {
  const { isSimulation } = useSimulationContext()
  const { partiesVotesSum, thresholdVotes, passingPartiesVotes, percentError } = props;
  const [clickCalculate, setClickCalculate] = useState(false);

  const renderTable = useMemo(() => {return <QuotaTable quota={Math.ceil(quota)} mandates={mandates} />;
  }, [ clickCalculate ]);

  if (isSimulation) return <QuotaTable quota={Math.ceil(passingPartiesVotes/120)} mandates={120} />

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
        }
      }
    });
  }

  function calculateQuota() {
    filterPassingParties();
    quota = +(passingPartiesVotes / mandates).toFixed(2);
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
            disabled={percentError}
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