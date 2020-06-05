import React from 'react';
import PartiesTable from './PartiesTable';

const propsTable = {
  districts: [221, 222, 223],
  parties: ['СН', 'ЕС', 'Голос'],
  threshold: 5
}

export default function MainPage() {
  return <PartiesTable data={propsTable}/>
}