// const config = {
//   network: 'mainnet',
//   networkId: 'mainnet',
//   nodeUrl: "https://rpc.mainnet.near.org",
//   walletUrl: "https://wallet.mainnet.near.org",
//   helperUrl: "https://helper.mainnet.near.org",
//   explorerUrl: "https://explorer.mainnet.near.org",
// }

import { parseNearAmount } from "near-api-js/lib/utils/format";

const config = {
  network: 'testnet',
  networkId: 'testnet',
  nodeUrl: "https://rpc.testnet.near.org",
  walletUrl: "https://wallet.testnet.near.org",
  helperUrl: "https://helper.testnet.near.org",
  explorerUrl: "https://explorer.testnet.near.org",
}

export const DEFAULT_FUNCTION_CALL_GAS = parseNearAmount('0.00000000003');

export default config;