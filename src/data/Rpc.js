import config from '../config';

export default class Rpc {
  constructor({
    index,
    name,
    network,
    nodeUrl,
  }) {
    this.index = index || Date.now();
    this.name = name;
    this.network = network;
    this.networkId = network;
    this.nodeUrl = nodeUrl;
    this.walletUrl = config[network].walletUrl;
    this.helperUrl = config[network].helperUrl;
    this.explorerUrl = config[network].explorerUrl;
    this.wrapNearContract = config[network].wrapNearContract;
  }
}