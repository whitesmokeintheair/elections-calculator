import ModalWindow from './ModalWindow';
import CandidatesList from './CandidatesList';
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
  const [listCandidates, setListCandidates] = useState(false) 

  function showListCandidates() {
    setListCandidates(listCandidates => !listCandidates);
  }

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
        const additionalVotes: number[] = [];
        votesForPartyValues.forEach((votesForParty, partyIndex) => {
          const mandatesForParty = mandatesForPartyValues[partyIndex];
          additionalVotes.push(votesForParty - (quota * mandatesForParty));
        })
        //считаем сумму
        const additionalVotesSum = getSum(additionalVotes);
        const addMandates = Math.ceil(additionalVotesSum/ quota);
        additionalMandates[partyIndex] = addMandates;
        const addMandatesSum = mandatesSum[partyIndex] + addMandates;
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

    console.log(mandatesSum[partyIndex])
    tableRow.forEach((value: any, i: number) => {
      tds.push(<td key={`mandats-for-${party}-${i}`}>{value}</td>);
    });
    tds.push(<td key={`mandats-sum-for-${party}`}>{mandatesSum[partyIndex]}</td>);
    tds.push(<td key={`additional-mandats-for-${party}`}>{additionalMandates[partyIndex]}</td>);
    tds.push(<td key={`all-mandats-for-${party}`}>{additionalMandatesWithMandatesSum[partyIndex]}</td>);

    return tds;
  };

  return (
    <>
      <p className="quota">Квота: {quota}</p>
      <Table striped bordered size="sm">
        <thead>
          <tr>
            <th></th>
            {districts.map((district) => (
              <th key={`disctrict-number-${district}`}>{district}</th>
            ))}
            <th>Всього:</th>
            <th>Додатково:</th>
            <th>Всього:</th>
          </tr>
        </thead>
        <tbody>
          {parties.map((party: any, partyIndex: number) => (
            <tr key={`table-rows-for-${party}`} >
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
        <Button className="button-list" type="button" onClick={showListCandidates}>Cписок партій</Button>
        {listCandidates && <CandidatesList parties={parties}/>}
    </>
    );
}