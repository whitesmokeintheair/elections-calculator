import {Modal, Tab} from 'react-bootstrap';
import {Button, Form} from 'react-bootstrap';
import React, { useState } from 'react';
import Tabs from 'react-bootstrap/Tabs'

export default function ModalWindow(props: any) {
  const [clickCalculate, setClickCalculate] = useState(false);
  const [key, setKey] = useState("everybody");

  //тут обработать голоса каждого кандидата
  function CalcualteVoiceCandidate() {
    setClickCalculate(clickCalculate => !clickCalculate);
    setKey(key => "rezult");
    console.log(clickCalculate)
  }

  return (
    <Modal
      {...props}
      size="lg"
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

//сюда передать пропсом кандидатов 
function AddCandidate(){
  return (
    <div className="person-voice">
        <div className="form-inputs__left">
          <p className="name-candidate">jsjsf</p>
        </div>
        <div className="form-inputs__right">
          <Form.Control type="text"
                 className="input"
                 placeholder="Голоси"/>
        </div>
    </div>
  );
}