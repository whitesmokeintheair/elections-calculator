import { getOrLoadAllElectors } from "./getElectors";


export const getElectorsCount = async (district: number | string): Promise<number | undefined> => {
  return (await getElectorsCounts([ district ])).pop()
}
  
export const getElectorsCounts = async (districts: (number | string)[]): Promise<number[]> => {
  try {
    const electors = await getOrLoadAllElectors()
    return districts.map(district => electors[district] || 0) as number[]
  } catch (err) {
    console.error('Failed: ', err)
    return []
  }
}