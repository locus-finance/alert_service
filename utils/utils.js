import path, { dirname } from "path";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";


const envPath = "../.env";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({
  path: path.join(__dirname, envPath),
});

export const ETH_NODE = process.env.ETHEREUM_NODE;
export const ARB_NODE = process.env.ARBITRUM_NODE;
export const POLYGON_NODE = process.env.POLYGON_NODE;
export const OPTIMISM_NODE = process.env.OPTIMISM_NODE;

export const dbName = process.env.DB_NAME;
export const messagebirdUrl = process.env.MESSAGEBIRD_URL;
export const discordUrl = process.env.DISCORD_URL;
export const discordPIUrl = process.env.DISCORD_PI_WEBHOOK_URL;

export const depositUrl = process.env.DISCORD_DEPOSIT_WEBHOOK_URL;
export const withdrawUrl = process.env.DISCORD_WITHDRAW_WEBHOOK_URL;

export const idMaksim = process.env.MAKSIM_ID;
export const idMatvey = process.env.MATVEY_ID;

export const threshold1 = process.env.THRESHOLD1;
export const threshold2 = process.env.THRESHOLD2;


export const getDataFromSG = async (graph, qs, table) => {

  const headers = {
    'authority': 'api.thegraph.com',
    'content-type': 'application/json',
    'accept': '*/*',
    'origin': 'https://thegraph.com',
    'sec-fetch-site': 'same-site',
    'sec-fetch-mode': 'cors',
    'sec-fetch-dest': 'empty',
    'referer': 'https://thegraph.com/',
  };
  try {
    const response = await fetch('https://api.thegraph.com/subgraphs/name/' + graph, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ query: qs })
    });
    const resp = await response.json();
    const answer = resp["data"][table];
    return answer;
  } catch (error) {
    console.error('SubGraph Error:', error);
    return false;
  }
}

export const fetchData = async (url) => {
  const response = await fetch(url);
  try {
  const res = await response.json();
  return res;
  }
  catch (error) {
    console.log("fetch error")
    return undefined

  }
}


export const getConvexPoolList = async () => {
  const poolsRegistry = ['factory', 'main', 'crypto', 'factory-crypto', 'factory-crvusd', 'factory-tricrypto'];
  const poolDataPromises = poolsRegistry.map((registry) =>
    fetchData(`https://api.curve.fi/api/getPools/ethereum/${registry}`)
  );

  const poolDataResponses = await Promise.all(poolDataPromises);
  const poolsList = poolDataResponses.map(({ data }) => data.poolData).flat();
  return poolsList;
}

export const getConvexGauges = async () => {
  const gaugesUrl = 'https://api.curve.fi/api/getAllGauges';
  const { data: gauges } = await fetchData(gaugesUrl);
  const mappedGauges = Object.entries(gauges).reduce(
    (acc, [name, gauge]) => ({
      ...acc,
      ...([
        'fantom',
        'optimism',
        'xdai',
        'polygon',
        'avalanche',
        'arbitrum',
      ].some((chain) => gauge.name.includes(chain))
        ? {}
        : { [gauge.swap_token.toLowerCase()]: { ...gauge } }),
    }),
    {}
  );
  return mappedGauges;
};


export const getCurveApy = async () => {
  try {

  const headers = {
    'authority': 'www.convexfinance.com/api/',
    'content-type': 'application/json',
    'accept': '*/*',
    'origin': 'https://www.convexfinance.com/',
    'sec-fetch-site': 'same-site',
    'sec-fetch-mode': 'cors',
    'sec-fetch-dest': 'empty',
    'referer': 'https://www.convexfinance.com/',
  };

  const response = await fetch('https://www.convexfinance.com/api/curve-apys', {
    method: 'GET',
    headers: headers,
  });
  const responseText = await response.text();
  const result = JSON.parse(responseText);
  const { apys: curveApys } = result;
  return curveApys
}
catch (e) {
  console.log("getCurveApy", e);
  return 0
}
}



export const calculateDeviationPercent = (value1, value2) => {
  return ((value2 - value1) / value2) * 100;
}


export const getAndFormatDate = () => {
  const date = new Date(Date.now());
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // +1 потому что месяцы начинаются с 0
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}