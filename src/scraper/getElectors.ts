import axios from "axios";
import cheerio from "cheerio";
import store from 'store'
import { PROXY_URL, VOTERS_KEY } from "./vars";

async function fetchHTML(url: string) {
  const { data } = await axios.get(PROXY_URL + url);
  return cheerio.load(data)
}

export const getOrLoadAllElectors = async () => {
  const voters = store.get(VOTERS_KEY)
  if (voters) return voters

  const $ = await fetchHTML('https://www.cvk.gov.ua/pls/vp2019/wp030pt001f01=719')
  const trs = $('tr.tr')
  const districtVotes = {} as any
  trs.map((_, tr) => { 
    const district = tr.children[3].children[0].children[0].data?.substr(5) || 'unknow'
    const voters = tr.children[5].children[0].data
    districtVotes[district] = voters
  })
  store.set(VOTERS_KEY, districtVotes)
  return districtVotes
}