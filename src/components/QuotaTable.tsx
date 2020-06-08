import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import { passingParties, inputsValue } from '../data';
import { getSum } from "../calculations";


export default function QuotaTable(props: any) {
  const {
    quota
  } = props;

  const { districts } = inputsValue;
  const parties = Array.from(passingParties.keys());
  const votesTable = inputsValue.table;

  let mandatesSum = new Array(parties.length).fill(0);
  const additionalMandates = new Array(parties.length).fill(0);
  const additionalMandatesWithMandatesSum = new Array(parties.length).fill(0);

  const [show, setShow] = useState(false);

  function calculateMandatesByDistricts() {
    const allParties = Array.from(votesTable.keys());
    let summedMandates: number[] = [];
    allParties.forEach((party, partyIndex) => {
      if(parties.includes(party)){
        const votesForPartyArray = votesTable.get(party);
        const mandatesForDistrictsArray: number[] = [];
        let mandatesForDistrict = 0;
        if(votesForPartyArray)
        votesForPartyArray.forEach((votes) => {
          mandatesForDistrict = Math.floor(votes/quota);
          mandatesForDistrictsArray.push(mandatesForDistrict);
        })
        summedMandates[partyIndex] = getSum(mandatesForDistrictsArray);
        mandatesSum = summedMandates;
        passingParties.set(party, mandatesForDistrictsArray);
      }
    })
  }

  function calculateAdditionalMandates() {
    const allParties = Array.from(votesTable.keys());

    allParties.forEach((party, partyIndex) => {
      if(parties.includes(party)){
        //находим голоса по партии и округу
        const votesForPartyArray = votesTable.get(party);
        const votesForPartyValues: number[] = []; 
        if(votesForPartyArray){
          votesForPartyArray.forEach((votes) => {
            votesForPartyValues.push(votes);
          })
        }
        //находим мандаты по партии и округу
        const mandatesForPartyArray = passingParties.get(party);
        const mandatesForPartyValues: number[] = [];
        if(mandatesForPartyArray){
          mandatesForPartyArray.forEach((mandates: number) => {
            mandatesForPartyValues.push(mandates);
          })
        }
        //считаем доп.голоса
        let additionalVotes: number[] = [];
        votesForPartyValues.forEach((votesForParty, partyIndex) => {
          let mandatesForParty = mandatesForPartyValues[partyIndex];
          additionalVotes.push(votesForParty - (quota * mandatesForParty));
        })
        //считаем сумму
        let additionalVotesSum = getSum(additionalVotes);
        let addMandates = Math.floor(additionalVotesSum/ quota);
        additionalMandates.push(addMandates);
        let addMandatesSum = mandatesSum[partyIndex] + addMandates;
        additionalMandatesWithMandatesSum[partyIndex] = addMandatesSum;
      }
    })
  }

  function showModal() {
    setShow(show => !show);
  }

  const renderRows = (party: any, partyIndex: number) => {
    calculateMandatesByDistricts();
    calculateAdditionalMandates();
    const tds: any[] = [];
    const tableRow = passingParties.get(party);
    if (!tableRow) return null;

    tableRow.map((value: any) => {
      tds.push(<td>{value}</td>);
    });
    tds.push(<td>{mandatesSum[partyIndex]}</td>);
    tds.push(<td>{additionalMandates[partyIndex]}</td>);
    tds.push(<td>{additionalMandatesWithMandatesSum[partyIndex]}</td>);

    return tds;
  };

  return (
    <>
      <p className="quota">Квота:</p>
      <Table striped bordered size="sm">
        <thead>
          <tr>
            <th></th>
            {districts.map((district: any) => (
              <th>{district}</th>
            ))}
            <th>Всього:</th>
            <th>Додатково:</th>
            <th>Всього:</th>
          </tr>
        </thead>
        <tbody>
          {parties.map((party: any, partyIndex: number) => (
            <tr>
              <td>{party}</td>
              {renderRows(party, partyIndex)}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>Всього:</td>
            <td colSpan={districts.length}></td>
            <td>{getSum(mandatesSum)}</td>
            <td>{getSum(additionalMandates)}</td>
            <td>{getSum(additionalMandatesWithMandatesSum)}</td>
          </tr>
        </tfoot>
      </Table>
      <button type="button" onClick={showModal}>
        Modal
      </button>
      {show && <ModalExample show={show} onHide={() => setShow(false)} />}
    </>
  );
}

function ModalExample(props: any) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Modal heading
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Centered Modal</h4>
        <p>
          Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
          dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
          consectetur ac, vestibulum at eros.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}