import React, { useEffect, useState } from 'react';
import {Table} from 'react-bootstrap';
import { getElectorsCounts } from '../scraper/getElectorsCount'
import QuotaInput from './QuotaInput';
import { passingParties } from '../data';
import { PartiesTableData } from '../types';
import { getSum } from '../calculations';

type PartiesTableProps = {
  data: PartiesTableData;
};

let allVotesForParties = 0;
let thresholdVotes = 0;
let passingPartiesVotes = 0;

export default function PartiesTable(props: PartiesTableProps) {
  const {
    data: { districts, parties, threshold, table = new Map<string, any[]>() }
  } = props;

  const [ districtsVotes, setDistrictsVotes ] = useState<number[]>([])
  const [ partiesVotesSum, setPartiesVotesSum ] = useState(new Array(parties.length).fill(0));

  const updateMap = (key: string, value: any) => {
    table.set(key, value);
  };

  useEffect(() => {
    getElectorsCounts(districts).then((votes) => {
      console.log(votes)
      setDistrictsVotes(votes)
    })
  }, [ districts ])

  function countPassingPartiesVotes() {
    partiesVotesSum.forEach((sum)=>{
      if(sum > thresholdVotes){
        passingPartiesVotes += sum;
      }
    })
  }

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

    let votesNumber = countVotesWithPercent(inputValue, allDistrictVotes);
    votesInput.innerText = votesNumber;
    if (tableRow) tableRow[partyVotesByDistrictsIndex] = votesNumber;
    updateMap(party, tableRow);

    let sumVotesForParties = getSum(tableRow);
    let votesForParty = partiesVotesSum;
    votesForParty[partyIndex] = sumVotesForParties;

    allVotesForParties = getSum(partiesVotesSum);
    thresholdVotes = countVotesWithPercent(threshold, allVotesForParties);

    console.log('here pass', passingParties);
    countPassingPartiesVotes();

    setPartiesVotesSum([...votesForParty]);
  }

  function countVotesWithPercent(percent: number, allVotes: number) {
    return Math.floor((percent / 100) * allVotes);
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
    let sumVotesForParties = getSum(tableRow);
    let votesForParty = partiesVotesSum;
    votesForParty[partyIndex] = sumVotesForParties;

    setPartiesVotesSum([...votesForParty]);

    allVotesForParties = getSum(partiesVotesSum);
    thresholdVotes = countVotesWithPercent(threshold, allVotesForParties);
    countPassingPartiesVotes();

    percentInput.innerText = countPercent(inputValue, allDistrictVotes);
  }

  const countPercent = (percentOf: number, percentFrom: number) => {
    return Math.floor((percentOf * 100) / percentFrom);
  };

  const renderInputRows = (party: string, partyIndex: number) => {
    const tableInputs = [];
    const tableRow = table.get(party);
    if (!tableRow) return null;

    tableRow.forEach((value: any, partyVotesByDistrictsIndex: number) => {
      tableInputs.push(
        <React.Fragment key={`table-input-by-${party}-${partyVotesByDistrictsIndex}`}>
          <td
            suppressContentEditableWarning
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
            suppressContentEditableWarning
            contentEditable
            onBlur={e =>
              handleVotesInput(e, partyIndex, partyVotesByDistrictsIndex, party)
            }
          >
            {value}
          </td>
        </React.Fragment>
      );
    });
    tableInputs.push(<td key={`table-inputs-by-${party}`}>{partiesVotesSum[partyIndex]}</td>);

    return tableInputs;
  };

  return (
    <>
      <Table striped bordered size="sm">
        <thead>
          <tr>
            <th></th>
            {districts.map((district) => (
              <th key={`district-number-${district}`} colSpan={2}>{district}</th>
            ))}
            <th>Всього:</th>
          </tr>
        </thead>
        <tbody>
          {parties.map((party: string, index: number) => (
            <tr key={`table-rows-for-${party}`}>
              <td>{party}</td>
              {renderInputRows(party, index)}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>Всього:</td>
            {districtsVotes.map(votes => (
              <td key={`all-votest-${votes}`} colSpan={2}>{votes}</td>
            ))}
            <td></td>
          </tr>
        </tfoot>
      </Table>
      <QuotaInput partiesVotesSum={partiesVotesSum} thresholdVotes={thresholdVotes} passingPartiesVotes={passingPartiesVotes}/>
    </>
  );
}