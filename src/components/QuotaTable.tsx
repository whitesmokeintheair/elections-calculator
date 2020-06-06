import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";
import { Modal } from "react-bootstrap";

function ModalExample(props: any) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Modal heading
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Centered Modal</h4>
        <p>
          Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
          dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
          consectetur ac, vestibulum at eros.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default function QuotaTable(props: any) {
  const {
    data: { districts, parties, threshold }
  } = props;
  const [show, setShow] = useState(false);
  function showModal() {
    setShow(show => !show);
  }
  return (
    <>
      <p className="quota">Квота:</p>
      <Table striped bordered size="sm">
        <thead>
          <tr>
            <th></th>
            {districts.map((district: any) => (
              <th>{district}</th>
            ))}
            <th>Всього:</th>
            <th>Додатково:</th>
            <th>Всього:</th>
          </tr>
        </thead>
        <tbody>
          {parties.map((party: any) => (
            <tr>
              <td>{party}</td>
              {districts.map((district: any) => (
                <td>{district}</td>
              ))}
              <td></td>
              <td></td>
              <td></td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>Всього:</td>
            <td colSpan={districts.length}></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tfoot>
      </Table>
      <button type="button" onClick={showModal}>
        Modal
      </button>
      {show && <ModalExample show={show} onHide={() => setShow(false)} />}
    </>
  );
}
