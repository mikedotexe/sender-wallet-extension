// export const network = 'mainnet';
export const network = 'testnet';

const config = {
  'mainnet': {
    network: 'mainnet',
    networkId: 'mainnet',
    nodeUrl: "https://rpc.mainnet.near.org",
    walletUrl: "https://wallet.mainnet.near.org",
    helperUrl: "https://helper.mainnet.near.org",
    explorerUrl: "https://explorer.mainnet.near.org",
    wrapNearContract: 'wrap.near',
  },
  'testnet': {
    network: 'testnet',
    networkId: 'testnet',
    // nodeUrl: "https://rpc.testnet.near.org",
    nodeUrl: "https://public-rpc.blockpi.io/http/near-testnet",
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
    explorerUrl: "https://explorer.testnet.near.org",
    wrapNearContract: 'wrap.testnet',
  }
}

export default config[network];