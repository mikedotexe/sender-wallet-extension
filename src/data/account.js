export default class Account {
  constructor({
    accountId,
    mnemonic,
    network,
    balance,
    secretKey,
    publicKey,
    validators,
    totalPending,
    totalAvailable,
    totalUnstaked,
    totalStaked,
    totalUnclaimed,
  }) {
    this.accountId = accountId; // Account id
    this.mnemonic = mnemonic; // Account's mnemonic
    this.network = network; // Account's network
    this.balance = balance; // Account's balance
    this.secretKey = secretKey; // Account's secret key
    this.publicKey = publicKey; // Account's public key
    this.totalPending = totalPending; // Pending withdrawal
    this.totalAvailable = totalAvailable; // Available for withdrawal
    this.totalUnstaked = totalUnstaked; // Available to be staked
    this.totalStaked = totalStaked; // Staked balance
    this.totalUnclaimed = totalUnclaimed; // Total rewards paid out - staking deposits made
    this.validators = validators; // Account's validators information
  }
}