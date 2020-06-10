import ModalWindow from './ModalWindow';
import { CandidatesList, initialCandidatsMap } from './CandidatesList';
import React, { useState } from "react";
import { Table } from "react-bootstrap";
import { passingParties as initialPassingParties, mockPassingParties,  inputsValue, mockInputsValue } from '../data';
import { getSum } from "../calculations";
import { useSimulationContext } from './IsSimulationContext';
import { CandidatsMap, CandidateType } from '../types';

export default function QuotaTable(props: any) {
  const {
    quota
  } = props;

  const { isSimulation } = useSimulationContext()
  const { districts } = isSimulation ? mockInputsValue : inputsValue;
  const passingParties = isSimulation ? mockPassingParties : initialPassingParties;
  const parties = Array.from(passingParties.keys());
  const votesTable = isSimulation ? mockInputsValue.table : inputsValue.table;

  let mandatesSum = new Array(parties.length).fill(0);
  const additionalMandates = new Array(parties.length).fill(0);
  const additionalMandatesWithMandatesSum = new Array(parties.length).fill(0);

  // modal State
  const [ showModal, setModalShow ] = useState(false);
  const [ candidatesByParty ] = useState<CandidatsMap>(initialCandidatsMap(parties)) 
  const [ candidatesByDistrict, setCandidatsByDistrict ] = useState<CandidateType[]>([])
  const [ mandatesCount, setMandatesCount ] = useState(0)

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
          mandatesForDistrict = Math.round(votes/quota);
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
        const addMandates = Math.round(additionalVotesSum/ quota);
        additionalMandates[partyIndex] = addMandates;
        const addMandatesSum = mandatesSum[partyIndex] + addMandates;
        additionalMandatesWithMandatesSum[partyIndex] = addMandatesSum;
      }
    })
  }

  const renderRows = (party: any, partyIndex: number) => {
    calculateMandatesByDistricts();
    calculateAdditionalMandates();
    const tds: any[] = [];
    const tableRow = passingParties.get(party);
    if (!tableRow) return null;

    tableRow.forEach((value: any, i: number) => {
      tds.push(<td onClick={() => {
        const allCandidatsList = candidatesByParty.get(party)
        const currentDistrict = districts[i].toString()
        const candidatesByDistrict = allCandidatsList && allCandidatsList.filter(x => x.district === currentDistrict)

        if (!candidatesByDistrict || !candidatesByDistrict.length)
          return alert(`Немає жодного депутата від партії ${party} на окрузі №${currentDistrict}`)
        
        candidatesByDistrict.sort((a, b) => parseInt(a.number) - parseInt(b.number))
        setCandidatsByDistrict([ ...candidatesByDistrict ])
        setMandatesCount(value)
        setModalShow(true)
      }} key={`mandats-for-${party}-${i}`}>{value}</td>);
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
      {showModal && <ModalWindow hide={() => setModalShow(false)} mandatesCount={mandatesCount} quota={quota/4} candidatesByDistrict={candidatesByDistrict} />}
      <CandidatesList parties={parties} candidatesByParty={candidatesByParty} />
    </>
    );
}