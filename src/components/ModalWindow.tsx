import {Modal, Tab} from 'react-bootstrap';
import {Button, Form} from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import Tabs from 'react-bootstrap/Tabs';
import { CandidatType } from './CandidatesList';
import partition from 'lodash.partition'

type Props = {
  hide: () => void,
  candidatsByDistrict: CandidatType[],
  quota: number,
  mandatesCount: number
}

export default function ModalWindow({ hide, candidatsByDistrict, quota, mandatesCount }: Props) {
  const [key, setKey] = useState<string>('everybody');
  const [ calculateClick, setCalculateClick ] = useState(false)
  const [ results, setResults ] = useState<CandidatType[]>([])
  console.log(candidatsByDistrict)
  
  function CalcualteVoiceCandidate() {
    setCalculateClick(!calculateClick)
    setKey('rezult');
  }

  useEffect(() => {
    const [ wins, other ] = partition(candidatsByDistrict, ({ voters }) => voters && voters >= quota)
    
    const winnersCount = wins.length

    console.log(wins, winnersCount)

    if (winnersCount < mandatesCount)
      wins.push(...other.slice(0, mandatesCount - winnersCount))

    console.log(wins, winnersCount)
    setResults([ ...wins ])
    
  }, [candidatsByDistrict, quota, calculateClick, mandatesCount])

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
        <AddCandidates candidats={candidatsByDistrict} />
      </Tab>
      <Tab eventKey="rezult" title="Результати">
        {results.map(({ voters, name, number}) => <div className="form-inputs__left">
            <span className="name-candidate mr-4">{name}</span>
            <span className="number-candidate mr-4">{number}</span>
            <span className="voters-candidate">{voters}</span>
          </div>)}
      </Tab>
    </Tabs>
      </Modal.Body>
      <Modal.Footer className="modal-buttons">
        <Button onClick={hide}>Закрити</Button>
        <Button onClick={CalcualteVoiceCandidate} disabled={key === 'rezult' ? true : false}>Розрахувати</Button>
      </Modal.Footer>
    </Modal>
  );
}

type AddCandidateProps = {
  candidats: CandidatType[]
}

function AddCandidates ({ candidats }: AddCandidateProps){
  return <>
    {candidats.map(candidat => 
      <div key={`${candidat.name}-on-${candidat.number}`} className="person-voice">
          <div className="form-inputs__left">
            <p className="name-candidate">{candidat.name}</p>
          </div>
          <div className="form-inputs__right">
            <Form.Control type="text"
                  defaultValue={candidat.voters}
                  className="input"
                  placeholder="Голоси"
                  onChange={(e) => candidat.voters = parseInt(e.target.value)}/>
          </div>
      </div>
    )}
  </>
}