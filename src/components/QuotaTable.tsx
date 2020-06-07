import React, { useMemo, useState } from 'react';
import {Table, Button} from 'react-bootstrap';
import ModalWindow from './ModalWindow';
import CandidatesList from './CandidatesList';
let data = ['OC', 'PMC', 'MON']

export default function QuotaTable(props: any) {
    const { data: {districts, parties, threshold }} = props;
    const [modal, setShow] = useState(false);
    const [listCandidates, setListCandidates] = useState(false) 

    function showModal() {
        setShow(modal => !modal);
    }

    function showListCandidates() {
        setListCandidates(listCandidates => !listCandidates);
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
        {/* <button type="button" onClick={showModal}>Modal</button>
        {modal && <ModalWindow show={modal}
        onHide={() => setShow(false)} />} */}
        <Button className="button-list" type="button" onClick={showListCandidates}>Cписок партій</Button>
        {listCandidates && <CandidatesList parties={data}/>}

    </>
    );
}