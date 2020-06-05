import React from 'react';
import {Table} from 'react-bootstrap';

export default function PartiesTable(props: any) {
  const { data: {districts, parties, threshold }} = props;

  const districtsVotes = [25000, 15450, 3600];

  const table = new Map();
  parties.forEach((party: any) => {
    let votesByDistricts = new Map();
    districts.forEach((district: any) => {
      votesByDistricts.set(district.toString(), 0);
    })
    table.set(party, votesByDistricts);
  });
  console.log(table);

  function handlePercentInput(e: React.FocusEvent<HTMLTableDataCellElement>) {
    console.log(e.target);
  }

  function handleVotesInput(e: React.FocusEvent<HTMLTableDataCellElement>) {
    console.log(e.target);
  }

  const renderInputRows = () =>{
    const tableInputs= [];
    for(let i = 0; i<districts.length; i++){
      tableInputs.push(<><td contentEditable onBlur={e => handlePercentInput(e)}>%</td>
      <td contentEditable onBlur={e => handleVotesInput(e)}></td></>)
    }
    return tableInputs;
  }

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
    {parties.map((party:any)=>
    <tr>
      <td>{party}</td>
      {renderInputRows()}
      <td></td>
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