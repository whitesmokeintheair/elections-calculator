import React, { useEffect, useState } from 'react';
import {Table} from 'react-bootstrap';
import QuotaInput from './QuotaInput';
import { PartiesTableData } from './PartiesInputs';

type PartiesTableProps = {
  data: PartiesTableData
}

export default function PartiesTable(props: PartiesTableProps) {
  const { data: {districts, parties, threshold, table = new Map()} } = props;

  const districtsVotes = [25000, 15450, 3600];

  const [votesSum, setVotesSum] = useState(new Array(parties.length).fill(0));

  function handlePercentInput(e: any, partyIndex: number,partyVotesByDistrictsIndex:number, party: string) {
    let inputValue = Number.parseInt(e.target.innerText);
    let tableRow = table.get(party);
    let votesInput = e.target.nextSibling;

    let allDistrictVotes = districtsVotes[partyVotesByDistrictsIndex];

    let votesNumber = countVotesFromPercent(inputValue, allDistrictVotes);
    votesInput.innerText = votesNumber;
    tableRow[partyVotesByDistrictsIndex] = votesNumber;
    updateMap(party, tableRow);

    let sum = countVotesForParties(tableRow);
    console.log('sum', sum);
    let votesForParty = votesSum;
    votesForParty[partyIndex] = sum;

    setVotesSum([...votesForParty]);
  }

  const countVotesFromPercent = (percent: number, allDistrictVotes: number) => {
    return Math.floor(percent/100 * allDistrictVotes);
  }

  const updateMap = (key: string, value: any) => {
    table.set(key,value);
  }

  function handleVotesInput(e: any, partyIndex: number, partyVotesByDistrictsIndex:number, party: string) {
    let inputValue = Number.parseInt(e.target.innerText);
    let tableRow = table.get(party);
    let percentInput = e.target.previousSibling;

    tableRow[partyVotesByDistrictsIndex] = inputValue;

    updateMap(party, tableRow);
    let allDistrictVotes = districtsVotes[partyVotesByDistrictsIndex];
    let sum = countVotesForParties(tableRow);
    let votesForParty = votesSum;
    votesForParty[partyIndex] = sum;

    setVotesSum([...votesForParty]);

    percentInput.innerText = countPercent(inputValue, allDistrictVotes);
  }

  const countVotesForParties = (row: any) => {
    let sum = 0;
    row.forEach((votes: number)=>{
      sum += votes;
    })
    return sum;
  }

  const countPercent = (percentOf: number, percentFrom: number) => {
    return Math.floor(percentOf * 100 / percentFrom);
  }

  const renderInputRows = (party: any, partyIndex: number) =>{
    const tableInputs= new Array();
    
    table.get(party).map((value: any, partyVotesByDistrictsIndex: number)=>{
      tableInputs.push(
      <>
      <td contentEditable
      onBlur={
        e => handlePercentInput(e, partyIndex, partyVotesByDistrictsIndex, party)
        }>%</td>
      <td contentEditable 
      onBlur={
        e => handleVotesInput(e, partyIndex, partyVotesByDistrictsIndex, party)
      }>{value}</td>
      </>)
    })
    tableInputs.push(<td>{votesSum[partyIndex]}</td>)

    return tableInputs;
  }
  return(
    <>
    <Table striped bordered size="sm">
      <thead>
        <tr>
          <th></th>
          {districts.map((district: any)=><th colSpan={2}>{district}</th>)}
          <th>Всього:</th>
        </tr>
      </thead>
      <tbody>
        {parties.map((party:any, index: number)=>
        <tr>
          <td>{party}</td>
          {renderInputRows(party, index)}
        </tr>)}
      </tbody>
      <tfoot>
        <tr>
          <td>Всього:</td>
          {districtsVotes.map((votes) => <td colSpan={2}>{votes}</td>)}
          <td></td>
        </tr>
      </tfoot>
    </Table>
    </>
  )
}