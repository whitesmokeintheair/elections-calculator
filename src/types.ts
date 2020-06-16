export type PartiesTableData = {
  parties: string[];
  districts: number[];
  threshold: number;
  turnout: number;
  table: Map<string, any[]>;
};

export type CandidateType = {
  name: string,
  district: string,
  number: string,
  voters?: number,
  party: string
}

export type CandidatsMap = Map<string, CandidateType[]> 