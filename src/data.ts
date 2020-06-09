import { PartiesTableData, CandidateType } from './types';
import store from 'store'

export const passingParties = new Map<string, any[]>();

export let inputsValue: PartiesTableData = {
  parties: [],
  districts: [],
  threshold: 0,
  table: new Map()
};

export const mockDistricts = [211,	212,	213,	214,	215,	216,	217,	218,	219,	220,	221,	222,	223 ]
export const mockParties = [
  'СЛУГА НАРОДУ(тест)',
  'Європейська Солідарність',
  'ГОЛОС',
  'Всеукраїнське об’єднання "Батьківщина"',
  'ОПОЗИЦІЙНА ПЛАТФОРМА – ЗА ЖИТТЯ',
  'СИЛА І ЧЕСТЬ',
  'ПАРТІЯ ШАРІЯ',
  'Всеукраїнське об’єднання "Свобода"',
  'УКРАЇНСЬКА СТРАТЕГІЯ ГРОЙСМАНА',
  'Громадянська позиція',
  'ОПОЗИЦІЙНИЙ БЛОК',
  'РАДИКАЛЬНА ПАРТІЯ ОЛЕГА ЛЯШКА',
  'Рух Нових Сил Михайла Саакашвілі',
  'Об’єднання "САМОПОМІЧ"',
  'ПАРТІЯ ЗЕЛЕНИХ УКРАЇНИ',
  "Аграрна партія України",
  'Сила Людей',
  'СИЛА ПРАВА',
  'СОЦІАЛЬНА СПРАВЕДЛИВІСТЬ',
  'НЕЗАЛЕЖНІСТЬ',
  'ПАТРІОТ',
  'ВСЕУКРАЇНСЬКЕ ОБ’ЄДНАННЯ "ФАКЕЛ"'
]

const votersByParty = [
  [ 28774, 	35591, 	33721,	28008,	30183,	30500,	28006,	27147,	29866,	26328,	25577,	27457,	25336 ],
  [ 15556, 16445,	12257, 14169,	10993,	9687,	14004,	12096,	12592,	11697,	16009,	12108,	14648 ],
  [ 9701,	10655,	7063,	8183, 5830,	5962,	8037,	7384,	7194,	7065,	9219,	7349,	8861  ],
  [ 6987,	7462, 6838,	6919,	6852,	6074,	6921,	6527,	7853,	5964,	6494,	5755,	6308 ],
  [ 6087, 6634,	5591,	7116,	5896,	5272,	7294,	5165,	5484,	5011,	8316,	5788,	6879 ]
]

export const mockDistrictsAllVoter = [ 84121,	95508,	81604,	81017,	75309,	72146,	81378,	73951,	80456,	70682,	83014,	74308,	79078 ]

const fillMockTable = () => {
  const map = new Map()
  mockParties.forEach((party, i) => map.set(party, votersByParty[i]))
  return map;
}

export const mockPartiesVotesSum = [ 376494, 172261, 102503, 86954, 80533  ]

export const mockInputsValue: PartiesTableData = {
  ...inputsValue,
  parties: mockParties,
  districts: mockDistricts,
  threshold: 5,
  table: fillMockTable()
}
const mockPassingPartiesArray = mockParties.slice(0,5)
export const mockPassingParties = (() => {
  const map = new Map()
  mockPassingPartiesArray.forEach((party, i) => {
    map.set(party, new Array(mockInputsValue.districts.length).fill(0))
  })
  return map
})()

const mockCandidates: CandidateType[] = [
  { name: 'Симоненко', number: '1', district: '223', voters: 101 },
  { name: 'Петренко', number: '2', district: '223', voters: 30 },
  { name: 'Павленко', number: '3', district: '223', voters: 1755 },
  { name: 'Тимошенко', number: '4', district: '223', voters: 1500 },
  { name: 'Іваненко', number: '5', district: '223', voters: 900 },
  { name: 'Степаненко', number: '6', district: '223', voters: 2500 },
]

const initialMockStore = () => {
  store.set(mockPassingPartiesArray[0],mockCandidates)
}

initialMockStore()