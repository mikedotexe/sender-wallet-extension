import Rpc from '../data/Rpc';

export const DEFAULT_MAINNET_RPC = new Rpc({ index: '0', name: 'NEAR Mainnet', network: 'mainnet', nodeUrl: 'https://rpc.mainnet.near.org' });
export const DEFAULT_TESTNET_RPC = new Rpc({ index: '1', name: 'NEAR Testnet', network: 'testnet', nodeUrl: 'https://rpc.testnet.near.org' });
