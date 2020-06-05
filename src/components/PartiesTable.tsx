import React from 'react';
import {Table} from 'react-bootstrap';

// type PartiesTableProps = {
//   districts: number[],
//   parties: string[],
//   threshold: number
// }

export default function PartiesTable(props: any) {
  const { data: {districts, parties, threshold }} = props;

  function handlePercentInput(e: any) {
    console.log('hey');
    console.log(e);
  }

  const renderInputRows = () =>{
    const tableInputs= [];
    for(let i = 0; i<districts.length; i++){
      tableInputs.push(<><td contentEditable onBlur={e => handlePercentInput(e)}>%</td>
      <td contentEditable></td></>)
    }
    return tableInputs;
  }

  const renderFooter = () => {
    const tableFooter = [];
    for(let i = 0; i<districts.length*2; i++){
      tableFooter.push(<td></td>)
    }
    return tableFooter;
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
      {renderFooter()}
      <td></td>
    </tr>
  </tfoot>
</Table>
  )
}