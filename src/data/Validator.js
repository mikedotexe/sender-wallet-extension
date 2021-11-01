export default class Validator {
  constructor({ accountId, active, contract, fee, staked = 0, available = 0, unclaimed = 0, pending = 0, unstaked = 0 }) {
    this.accountId = accountId; // Validator's account id
    this.active = active; // Validator's status
    this.contract = contract; // Validator's contract object
    this.fee = fee; // Validator's reward handling fee
    this.staked = staked; // Current account's staked near amount in this validator
    this.available = available; // Current account's available near amount in this validator
    this.unclaimed = unclaimed; // Current account's unclaimed near amount in this validator
    this.pending = pending; // Current account's available near amount in this validator
    this.unstaked = unstaked; // Current account's unstaked near amount in this validator
  }
}