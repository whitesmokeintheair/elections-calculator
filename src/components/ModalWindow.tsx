import {Modal, Tab} from 'react-bootstrap';
import {Button, Form} from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import Tabs from 'react-bootstrap/Tabs';
import { CandidateType } from '../types';
import partition from 'lodash.partition'

type Props = {
  hide: () => void,
  candidatesByDistrict: CandidateType[],
  quota: number,
  mandatesCount: number
}

type ResultsViewProps = {
  candidates: CandidateType[]
}

const ResultsView = ({ candidates }: ResultsViewProps) => (
  <div className='results-list text-center'>
    <div className='results-header row'>
      <div className='col-4'>ПІБ</div>
      <div className='col-4'>Номер на окрузі</div>
      <div className='col-4'>Кількість голосів</div>
    </div>
    {candidates.map((candidate, i) => <div key={`${candidate.name}-${candidate.district}-${i}`} className='results-item row'>
      <div className='col-4'>{candidate.name}</div>
      <div className='col-4'>{candidate.number}</div>
      <div className='col-4'>{candidate.voters}</div>
    </div>)}
  </div>
)

export default function ModalWindow({ hide, candidatesByDistrict, quota, mandatesCount }: Props) {
  const [key, setKey] = useState<string>('everybody');
  const [ calculateClick, setCalculateClick ] = useState(false)
  const [ results, setResults ] = useState<CandidateType[]>([])
  
  function CalcualteVoiceCandidate() {
    setCalculateClick(!calculateClick)
    setKey('result');
  }

  useEffect(() => {
    const [ wins, other ] = partition(candidatesByDistrict, ({ voters }) => voters && voters >= quota)
    
    wins.sort((a, b) => (!(a.voters) || !(b.voters)) ? 0 : b.voters - a.voters)
    const winnersCount = wins.length

    if (winnersCount < mandatesCount)
      wins.push(...other.slice(0, mandatesCount - winnersCount))

    setResults([ ...wins ])
    
  }, [candidatesByDistrict, quota, calculateClick, mandatesCount])

  return (
    <Modal
      size="lg"
      show
      onHide={hide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body>
      <Tabs
      id="tab"
      activeKey={key}
      onSelect={(k: React.SetStateAction<string>) => setKey(k)}
    >
      <Tab eventKey="everybody" title="Всі">
        <AddCandidates candidates={candidatesByDistrict} />
      </Tab>
      <Tab eventKey="result" title="Результати">
        <ResultsView candidates={results} />
      </Tab>
    </Tabs>
      </Modal.Body>
      <Modal.Footer className="modal-buttons">
        <Button onClick={hide}>Закрити</Button>
        <Button onClick={CalcualteVoiceCandidate} disabled={key === 'result' ? true : false}>Розрахувати</Button>
      </Modal.Footer>
    </Modal>
  );
}

type AddCandidateProps = {
  candidates: CandidateType[]
}

function AddCandidates ({ candidates }: AddCandidateProps){
  return <>
    {candidates.map(candidate => 
      <div key={`${candidate.name}-on-${candidate.number}`} className="person-voice">
          <div className="form-inputs__left">
            <p className="name-candidate">{candidate.name}</p>
          </div>
          <div className="form-inputs__right">
            <Form.Control type="text"
                  defaultValue={candidate.voters}
                  className="input"
                  placeholder="Голоси"
                  onChange={(e) => candidate.voters = parseInt(e.target.value)}/>
          </div>
      </div>
    )}
  </>
}