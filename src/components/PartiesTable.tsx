import React, { useEffect, useState } from 'react';
import {Table} from 'react-bootstrap';
import { getElectorsCounts } from '../scraper/getElectorsCount'
import QuotaInput from './QuotaInput';

type PartiesTableProps = {
  data: PartiesTableData;
};

export default function PartiesTable(props: PartiesTableProps) {
  const {
    data: { districts, parties, threshold, table = new Map<string, any[]>() }
  } = props;

  const [ districtsVotes, setDistrictsVotes ] = useState<number[]>([])
  const [votesSum, setVotesSum] = useState(new Array(parties.length).fill(0));
  const allVotes = sumVotesForParties(votesSum);
  const thresholdVotes = countVotesFromPercent(threshold, allVotes);
  console.log(allVotes);

  useEffect(() => {
    getElectorsCounts(districts).then((votes) => setDistrictsVotes(votes))
    console.log(districts)
  }, [ districts ])

  function handlePercentInput(
    e: any,
    partyIndex: number,
    partyVotesByDistrictsIndex: number,
    party: string
  ) {
    let inputValue = Number.parseInt(e.target.innerText);
    let tableRow = table.get(party);
    let votesInput = e.target.nextSibling;

    let allDistrictVotes = districtsVotes[partyVotesByDistrictsIndex];

    let votesNumber = countVotesFromPercent(inputValue, allDistrictVotes);
    votesInput.innerText = votesNumber;
    if (tableRow) tableRow[partyVotesByDistrictsIndex] = votesNumber;
    updateMap(party, tableRow);

    let sum = sumVotesForParties(tableRow);
    console.log("sum", sum);
    let votesForParty = votesSum;
    votesForParty[partyIndex] = sum;

    setVotesSum([...votesForParty]);
  }

  function countVotesFromPercent(percent: number, allVotes: number) {
    return Math.floor((percent / 100) * allVotes);
  };

  const updateMap = (key: string, value: any) => {
    table.set(key, value);
  };

  function handleVotesInput(
    e: any,
    partyIndex: number,
    partyVotesByDistrictsIndex: number,
    party: string
  ) {
    let inputValue = Number.parseInt(e.target.innerText);
    let tableRow = table.get(party);
    let percentInput = e.target.previousSibling;

    if(tableRow) tableRow[partyVotesByDistrictsIndex] = inputValue;

    updateMap(party, tableRow);
    let allDistrictVotes = districtsVotes[partyVotesByDistrictsIndex];
    let sum = sumVotesForParties(tableRow);
    let votesForParty = votesSum;
    votesForParty[partyIndex] = sum;

    setVotesSum([...votesForParty]);

    percentInput.innerText = countPercent(inputValue, allDistrictVotes);
  }

  function sumVotesForParties(row: any) {
    let sum = 0;
    row.forEach((votes: number) => {
      sum += votes;
    });
    return sum;
  };

  const countPercent = (percentOf: number, percentFrom: number) => {
    return Math.floor((percentOf * 100) / percentFrom);
  };

  const renderInputRows = (party: any, partyIndex: number) => {
    const tableInputs = new Array();
    const tableRow = table.get(party);
    if (!tableRow) return null;

    tableRow.map((value: any, partyVotesByDistrictsIndex: number) => {
      tableInputs.push(
        <>
          <td
            contentEditable
            onBlur={e =>
              handlePercentInput(
                e,
                partyIndex,
                partyVotesByDistrictsIndex,
                party
              )
            }
          >
            %
          </td>
          <td
            contentEditable
            onBlur={e =>
              handleVotesInput(e, partyIndex, partyVotesByDistrictsIndex, party)
            }
          >
            {value}
          </td>
        </>
      );
    });
    tableInputs.push(<td>{votesSum[partyIndex]}</td>);

    return tableInputs;
  };
  return (
    <>
      <Table striped bordered size="sm">
        <thead>
          <tr>
            <th></th>
            {districts.map((district: any) => (
              <th colSpan={2}>{district}</th>
            ))}
            <th>Всього:</th>
          </tr>
        </thead>
        <tbody>
          {parties.map((party: any, index: number) => (
            <tr>
              <td>{party}</td>
              {renderInputRows(party, index)}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>Всього:</td>
            {districtsVotes.map(votes => (
              <td colSpan={2}>{votes}</td>
            ))}
            <td></td>
          </tr>
        </tfoot>
      </Table>
      <QuotaInput/>
    </>
  );
}
