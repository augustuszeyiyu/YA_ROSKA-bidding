export type RemitInfo = {
	id:string;
	address:string;
	amount:num_str;
	email:string;
	name:string;
	state: number;
	uid: uniqid;

	txn_info?:object;
	txn_hash?:string;
	
	gas_txn_info?: object;
	gas_txn_hash?: string;

	create_time:epoch;
	finish_time:epoch;
	update_time:epoch;
};

type __RemitReqeustQueryStateTypes = {
	INIT: 'init',
	PROC: 'proc',
	DONE: 'done',
	ERROR: 'error',
};
export type RemitReqeustQueryStateTypes = ObjectValues<__RemitReqeustQueryStateTypes>;
export const RemitReqeustQueryStateTypeMap:__RemitReqeustQueryStateTypes = {
	INIT: 'init',
	PROC: 'proc',
	DONE: 'done',
	ERROR: 'error',
};
