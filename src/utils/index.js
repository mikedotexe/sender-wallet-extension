import * as nearAPI from 'near-api-js';
import _ from 'lodash';
import BN from 'bn.js';

import config from '../config';
import Account from '../data/account';
import { nearService } from '../core/near';

const bip39 = require('bip39-light');
const { derivePath } = require('near-hd-key');
const bs58 = require('bs58');
const nacl = require('tweetnacl');
const { utils } = nearAPI;

const KEY_DERIVATION_PATH = "m/44'/397'/0'";
const { network } = config;

// Normalize the seedPhrase
export const normalizeSeedPhrase = (seedPhrase) => seedPhrase.trim().split(/\s+/).map(part => part.toLowerCase()).join(' ')

/**
 * Parse seedPhrase with the derivationPath
 * @param {*} seedPhrase Account's mnemonic
 * @param {*} derivationPath The derivation path
 * @returns { seedPhrase, secretKey, publicKey }
 */
export const parseSeedPhrase = (seedPhrase, derivationPath = '') => {
	const seed = bip39.mnemonicToSeed(normalizeSeedPhrase(seedPhrase));
	const { key } = derivePath(derivationPath || KEY_DERIVATION_PATH, seed.toString('hex'))
	const keyPair = nacl.sign.keyPair.fromSeed(key)
	const publicKey = 'ed25519:' + bs58.encode(Buffer.from(keyPair.publicKey))
	const secretKey = 'ed25519:' + bs58.encode(Buffer.from(keyPair.secretKey))
	return { seedPhrase, secretKey, publicKey }
}

// converts NEAR amount into yoctoNEAR (10^-24)
export const parseNearAmount = (amount) => {
	if (_.isEmpty(amount)) {
		return '0';
	}
	return utils.format.parseNearAmount(amount);
}

// converts yoctoNEAR (10^-24) amount into NEAR
export const formatNearAmount = (amount) => {
	if (_.isEmpty(amount)) {
		return '0';
	}
	return utils.format.formatNearAmount(amount);
}

export const parseTokenAmount = (amount, decimals = 18) => {
	if (_.isEmpty(amount)) {
		return '0';
	}
	return Number(amount) * (10 ** decimals);
}

export const formatTokenAmount = (amount, decimals = 18) => {
	if (_.isEmpty(amount)) {
		return '0';
	}
	return Number(amount) / (10 ** decimals);
}

// Display numbers with specific digits
export const fixedNumber = (amount, digit = 5) => {
	if (!amount) {
		return '0';
	}
	return Number(amount).toFixed(digit);
}

// converts yoctoNEAR (10^-24) amount into NEAR and display 6 digits
export const fixedNearAmount = (amount) => {
	if (!amount) {
		return 0;
	}
	const nearAmount = formatNearAmount(amount);
	return fixedNumber(nearAmount);
}

// converts yoctoToken (10^-${decimals}) amount to Token and display 6 digits
export const fixedTokenAmount = (amount, decimals) => {
	if (!amount) {
		return 0;
	}
	const tokenAmount = formatTokenAmount(amount, decimals);
	return fixedNumber(tokenAmount);
}

/**
 * Format account object
 * @param {*} param0 
 * @param {*} param0.mnemonic Send account's mnemonic
 * @param {*} param0.balance Account's balance
 * @param {*} param0.validators Account's validators
 * @param {*} param0.totalUnstaked Near account's available balance
 * @param {*} param0.totalStaked Total staked near amount with all validators
 * @param {*} param0.totalUnclaimed Total unclaimed near amount with all validators
 * @param {*} param0.totalAvailable Total available near amount with all validators (can withdraw)
 * @param {*} param0.totalPending Total pending near amount with all validators
 * @param {*} param0.tokens Account's owned tokens
 * @returns New Account object
 */
export const formatAccount = async ({
	mnemonic,
	balance = {},
	validators = [],
	totalUnstaked = '0',
	totalStaked = '0',
	totalUnclaimed = '0',
	totalAvailable = '0',
	totalPending = '0',
	tokens = [],
	transactions = [],
}) => {
	const phrase = parseSeedPhrase(mnemonic);
	const { secretKey, publicKey } = phrase;
	const accountId = await nearService.getAccountId(publicKey);
	let accountBalance = balance;
	if (_.isEmpty(accountBalance)) {
		await nearService.setSigner({ mnemonic, accountId });
		accountBalance = await nearService.getAccountBalance();
	}
	return new Account({
		accountId,
		mnemonic,
		network,
		secretKey,
		publicKey,
		balance: accountBalance,
		validators,
		totalUnstaked,
		totalStaked,
		totalUnclaimed,
		totalAvailable,
		totalPending,
		tokens,
		transactions,
	});
}

/**
 * Check phrass is valid or not
 * @param {*} phrass 
 * @returns return true if phrass is valid, otherwise false
 */
export const checkPhrass = (phrass) => {
	try {
		const phrassArray = _.split(phrass, ' ');
		return phrassArray.length === 12;
	} catch (error) {
		return false;
	}
}
