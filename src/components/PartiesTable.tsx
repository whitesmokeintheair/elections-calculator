import React, { useEffect, useState } from 'react';
import {Table} from 'react-bootstrap';

// type PartiesTableProps = {
//   parties: string[],
//   districts: number[],
//   threshold: number
// }

export default function PartiesTable(props: any) {
  const { data: {districts, parties, threshold} } = props;
  console.log('props', props);

  const districtsVotes = [25000, 15450, 3600];

  const [votesSum, setVotesSum] = useState(new Array(parties.length).fill(0));

  const table = new Map();
  parties.forEach((party: any) => {
    table.set(party, new Array(districts.length).fill(0));
  });

  function handlePercentInput(e: any, index: number, party: string) {
    let inputValue = Number.parseInt(e.target.innerText);
    let tableRow = table.get(party);
    let votesInput = e.target.nextSibling;

    let allDistrictVotes = districtsVotes[index];

    let votesNumber = countVotesFromPercent(inputValue, allDistrictVotes);
    votesInput.innerText = votesNumber;
    tableRow[index] = votesNumber;
    console.log(tableRow);
  }

  const countVotesFromPercent = (percent: number, allDistrictVotes: number) => {
    console.log(allDistrictVotes);
    return Math.floor(percent/100 * allDistrictVotes);
  }

  function handleVotesInput(e: any, index: number, party: string) {
    let inputValue = Number.parseInt(e.target.innerText);
    let tableRow = table.get(party);
    let percentInput = e.target.previousSibling;
    console.log(tableRow);
    console.log('index', index);
    tableRow[index] = inputValue;
    let allDistrictVotes = districtsVotes[index];
    let sum = countVotesForParties(tableRow);
    let votesForParty = votesSum;
    votesForParty[index] = sum;
    console.log('inhandler', votesForParty);
    console.log('init', votesSum);
    setVotesSum([...votesForParty]);
    console.log('after', votesSum);
    percentInput.innerText = countPercent(inputValue, allDistrictVotes);
    console.log(table);
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

  const renderInputRows = (party: any, index: number) =>{
    const tableInputs= new Array();
    
    table.get(party).map((value: any, index: number)=>{
      tableInputs.push(
      <>
      <td contentEditable
      onBlur={
        e => handlePercentInput(e, index, party)
        }>%</td>
      <td contentEditable 
      onBlur={
        e => handleVotesInput(e, index, party)
      }>{value}</td>
      </>)
    })
    tableInputs.push(<td>{votesSum[index]}</td>)

    return tableInputs;
  }
  console.log('table', table);
  return(
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
  )
}