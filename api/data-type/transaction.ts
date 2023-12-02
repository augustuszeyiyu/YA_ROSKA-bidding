type __TransactionTypes = {
	ERC20: 'erc20',
	TRC20: 'trc20',
};
export type TransactionTypes = ObjectValues<__TransactionTypes>;
export const TransactionTypeMap:__TransactionTypes = {
	ERC20: 'erc20',
	TRC20: 'trc20'
};



type __TransactionReqeustQueryStateTypes = {
	INIT: 'init',
	PROC: 'proc',
	DONE: 'done',
	ALL: 'all',
};
export type TransactionReqeustQueryStateTypes = ObjectValues<__TransactionReqeustQueryStateTypes>;
export const TransactionReqeustQueryStateTypeMap:__TransactionReqeustQueryStateTypes = {
	INIT: 'init',
	PROC: 'proc',
	DONE: 'done',
	ALL: 'all',
};



// REGION: [ Copy from hunt.node.api project ]
export const TransactionState = Object.freeze({
	UNKOWN_ERROR: -9999,
	INCORRECT_NONCE: -10,
	INSUFFICIENT_FUND: -1,
    QUEUED:0,
	INIT: 10,
    GAS: 20,
	PROC: 30,
	PENDING: 40,
	DONE: 9999
});
export type TransactionStates = ObjectValues<typeof TransactionState>;
// ENDREGION
