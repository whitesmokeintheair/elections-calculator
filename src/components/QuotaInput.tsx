import React, { useState } from 'react';
import {Form, Button} from 'react-bootstrap';

export default function OuotaInput() {
    let mandate = 0;

    function getValueMandate(event: any) {
        mandate = event.target.value;
    }

    function CalculateTable() {
        console.log(mandate);
    }

    return (
        <>
            <Form className="quota-form">
                <div className="form-inputs__left">
                <Form.Control
                 onChange={getValueMandate} 
                 type="text"
                 className="quota-form__input input"
                 placeholder="Введіть кількість мандатів"
                />
                </div>
                <div className="form-inputs__left">
                <Button variant="primary" type="button" className="button-calculate" onClick={CalculateTable}>
                Розрахувати
                </ Button>
                </div>
            </Form>
        </>
    )
}