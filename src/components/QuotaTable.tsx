import React, { useMemo, useState } from 'react';
import {Table, Button} from 'react-bootstrap';
import ModalWindow from './ModalWindow';


export default function QuotaTable(props: any) {
    const { data: {districts, parties, threshold }} = props;
    const [show, setShow] = useState(false);
    function showModal() {
        setShow(show => !show);
    }
    return(
        <>
        <p className="quota">Квота:</p>
        <Table striped bordered size="sm">
            <thead>
            <tr>
                <th></th>
                    {districts.map((district: any)=><th>{district}</th>)}
                <th>Всього:</th>
                <th>Додатково:</th>
                <th>Всього:</th>
            </tr>
            </thead>
            <tbody>
                {parties.map((party:any)=>
                <tr>
                <td>{party}</td>
                    {districts.map((district: any)=><td>{district}</td>)}
                <td></td>
                <td></td>
                <td></td>
            </tr>)}
            </tbody>
            <tfoot>
            <tr>
                <td>Всього:</td>
                <td colSpan={3}>votes</td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            </tfoot>
        </Table>
        <button type="button" onClick={showModal}>Modal</button>
        {show && <ModalWindow show={show}
        onHide={() => setShow(false)} />}
    </>
    );
}