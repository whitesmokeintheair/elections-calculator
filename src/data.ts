import { PartiesTableData } from './types';

export const passingParties = new Map();

export let inputsValue: PartiesTableData = {
  parties: [],
  districts: [],
  threshold: 0,
  table: new Map()
};