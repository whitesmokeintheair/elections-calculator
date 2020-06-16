import React, { useEffect, useState } from 'react';
import {Table} from 'react-bootstrap';
import { getElectorsCounts } from '../scraper/getElectorsCount'
import QuotaInput from './QuotaInput';
import { PartiesTableData } from '../types';
import { getSum } from '../calculations';
import { useSimulationContext } from './IsSimulationContext';
import { mockDistrictsAllVoter, mockPartiesVotesSum } from '../data';

type PartiesTableProps = {
  data: PartiesTableData;
};

export default function PartiesTable(props: PartiesTableProps) {
  const {
    data: { districts, parties, threshold, turnout, table = new Map<string, any[]>() }
  } = props;

  const [ allVotesForParties, setAllVotesForParties ] = useState(0);
  const [ thresholdVotes, setThresholdVotes ] = useState(0);
  const [ passingPartiesVotes, setPassingPartiesVotes ] = useState(0);

  const { isSimulation } = useSimulationContext()
  const [ districtsVotes, setDistrictsVotes ] = useState<number[]>([])
  const [ partiesVotesSum, setPartiesVotesSum ] = useState(isSimulation ? mockPartiesVotesSum : new Array(parties.length).fill(0));

  const [ percentError, setPercentError ] = useState(false);

  const updateMap = (key: string, value: any) => {
    table.set(key, value);
  };

  useEffect(() => {
    if (isSimulation) {
      setAllVotesForParties(getSum(partiesVotesSum));
      setThresholdVotes(countVotesWithPercent(threshold, allVotesForParties));
      countPassingPartiesVotes()
      setDistrictsVotes(mockDistrictsAllVoter)
      return
    }

    getElectorsCounts(districts).then((votes) => {
      setDistrictsVotes(votes.map(x => Math.ceil(x * turnout / 100)))
    })
  }, [ allVotesForParties, districts, isSimulation, partiesVotesSum, threshold, turnout ])

  function countPassingPartiesVotes() {
    let votersSum = 0;
    partiesVotesSum.forEach((sum)=>{
      if(sum > thresholdVotes){
        votersSum += sum;
      }
    })
    setPassingPartiesVotes(votersSum)
  }

  function handlePercentInput(
    e: any,
    partyIndex: number,
    partyVotesByDistrictsIndex: number,
    party: string
  ) {
    let inputValue = Number.parseInt(e.target.innerText);
    if(inputValue > 100) {
      setPercentError(true);
      e.target.innerText = 'макс. 100%';
      e.target.className = 'error';
      return;
    }
    if(!inputValue){
      return;
    }
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

    setAllVotesForParties(getSum(partiesVotesSum));
    setThresholdVotes(countVotesWithPercent(threshold, allVotesForParties));

    countPassingPartiesVotes();

    setPartiesVotesSum([...votesForParty]);
  }

  const countVotesWithPercent = (percent: number, allVotes: number) => {
    return Math.round((percent / 100) * allVotes);
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

    if(!inputValue){
      return;
    }

    if(tableRow) tableRow[partyVotesByDistrictsIndex] = inputValue;

    updateMap(party, tableRow);
    let allDistrictVotes = districtsVotes[partyVotesByDistrictsIndex];
    let sumVotesForParties = getSum(tableRow);
    let votesForParty = partiesVotesSum;
    votesForParty[partyIndex] = sumVotesForParties;

    setPartiesVotesSum([...votesForParty]);
    setAllVotesForParties(getSum(partiesVotesSum));
    setThresholdVotes(countVotesWithPercent(threshold, allVotesForParties));
    countPassingPartiesVotes();

    percentInput.innerText = countPercent(inputValue, allDistrictVotes) + '%';
  }

  const countPercent = (percentOf: number, percentFrom: number) => {
    return Math.round((percentOf * 100) / percentFrom);
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
            onInput = {(e: any) => {
                setPercentError(false);
                e.target.className = '';
              }
            }
          >
            {isSimulation ? countPercent(parseInt((table.get(party) as any[])[partyVotesByDistrictsIndex]), districtsVotes[partyVotesByDistrictsIndex]) + '%' :'%'}
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
      <p className="quota">Явка: {turnout}%</p>
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
            {districtsVotes.map((votes, i) => (
              <td
                suppressContentEditableWarning
                contentEditable
                onBlur={e => {
                  const value = parseInt(e.target.innerText);
                  districtsVotes[i] = value
                  setDistrictsVotes([ ...districtsVotes ])
                }}
                key={`all-votest-${votes}`}
                colSpan={2}
              >
                {votes}
              </td>
            ))}
            <td></td>
          </tr>
        </tfoot>
      </Table>
      <QuotaInput percentError={percentError} partiesVotesSum={partiesVotesSum} thresholdVotes={thresholdVotes} passingPartiesVotes={passingPartiesVotes}/>
    </>
  );
}