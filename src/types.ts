export type PartiesTableData = {
  parties: string[];
  districts: number[];
  threshold: number;
  table: Map<string, any[]>;
};

export type CandidateType = {
  name: string,
  district: string,
  number: string,
  voters?: number,
}

export type CandidatsMap = Map<string, CandidateType[]> 