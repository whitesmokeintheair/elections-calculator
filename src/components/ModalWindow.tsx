import {Modal, Tab} from 'react-bootstrap';
import {Button, Form} from 'react-bootstrap';
import React, { useState } from 'react';
import Tabs from 'react-bootstrap/Tabs';

let voices = [];

export default function ModalWindow(props: any) {
  const [clickCalculate, setClickCalculate] = useState(false);
  const [key, setKey] = useState("everybody");

  
  function CalcualteVoiceCandidate() {
    setClickCalculate(clickCalculate => !clickCalculate);
    setKey(key => "rezult");
    
  }

  return (
    <Modal
      {...props}
      size="md"
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
        <AddCandidate />
      </Tab>
      <Tab eventKey="rezult" title="Результати">
        <p>Результати</p>
      </Tab>
    </Tabs>
      </Modal.Body>
      <Modal.Footer className="modal-buttons">
        <Button onClick={props.onHide}>Закрити</Button>
        <Button onClick={CalcualteVoiceCandidate} disabled={key == "rezult" ? true : false}>Розрахувати</Button>
      </Modal.Footer>
    </Modal>
  );
}


function AddCandidate(){
  function getVoiceCandidate (event: any) {
    
  }

  return (
    <div className="person-voice">
        <div className="form-inputs__left">
          <p className="name-candidate">jsjsf</p>
        </div>
        <div className="form-inputs__right">
          <Form.Control type="text"
                 className="input"
                 placeholder="Голоси"
                 onChange={getVoiceCandidate}/>
        </div>
    </div>
  );
}