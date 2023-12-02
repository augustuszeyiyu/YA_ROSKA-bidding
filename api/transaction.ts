import SessionControl from "./session.js";
import {BuildQueryOrderString, ProcRemoteResponse} from "../lib/tools.js";



type GetTransactionTopupListQuery = {
	token:string;

	filter_text?:string;
	state?:string;
	order?:{
		create_time?: DataQueryOrder;
	};
};
type TransactionTopupBriefInfo = {
	txn: string,
	uid: uniqid,
	block: string,
	number: number,
	amount: string,
	from: string,
	to: string,
	state: number,
	type: 'erc20'|'trc20',
	block_time: number,
	receipt?: any,
	update_time: epoch,
	create_time: epoch,
};
type GetTransactionTopupListResponse = PaginateCursor<TransactionTopupBriefInfo>;

/** [ALEVEL > 2] 取得交易入金列表 **/
export async function GetTransactionTopupList(query:GetTransactionTopupListQuery):Promise<GetTransactionTopupListResponse>;
export async function GetTransactionTopupList(query:GetTransactionTopupListQuery, paging:GetTransactionTopupListResponse['meta']):Promise<GetTransactionTopupListResponse>;
export async function GetTransactionTopupList(arg1:GetTransactionTopupListQuery, arg2?:GetTransactionTopupListResponse['meta']):Promise<GetTransactionTopupListResponse> {
	SessionControl.CheckLogin();

	const searchParams = new URLSearchParams();
	let resource:string|undefined;
	if(arg1 && arg1 === Object(arg1)) {
		const {token, filter_text, state, order} = arg1;
		if (token !== undefined) 		resource = `/${token}`;

		if (filter_text !== undefined) 	searchParams.set('filter_text', filter_text);
		if (state !== undefined) 		searchParams.set('state', state);
		if (order !== undefined) 		searchParams.set('order', BuildQueryOrderString(order));
	}

	if(arg2 && arg2 === Object(arg2)) {
		const {page, page_size} = arg2;	
		if (page !== undefined) 		searchParams.set('p', arg2.page + '');
		if (page_size !== undefined) 	searchParams.set('ps', arg2.page_size + '');
	}



	return fetch(`${SessionControl.endpoint_url}/api/admin/transaction/topup${resource}?${searchParams}`, {
		method:'GET',
		headers: {"Authorization": SessionControl.auth_token}
	})
	.then(ProcRemoteResponse).then((resp)=>resp.json());  
}



/** [ALEVEL > 2] 取得特定交易入金資料 **/
export async function GetTransactionTopupInfo(query:GetTransactionTopupListQuery):Promise<TransactionTopupBriefInfo> {
	return GetTransactionTopupList(query)
	.then(response=>response.records[0]); // NOTE: Only return the first record
}




type GetTransactionWithdrawListQuery = {
	token:string;

	filter_text?:string;
	state?:string;
	order?:{
		create_time?: DataQueryOrder;
	};
};
type TransactionWithdrawBriefInfo = {
	id:string,
	uid: uniqid,
	name: string,
	email: string,
	amount: string,
	to: string,
	from: string,
	type: string,
	speed: string,
	state: number,
	transactionhash?: string|null,
	receipt: any,
	send_time:number,
	finish_time:number,
	update_time:number,
	create_time:number,
	txn_info?: any,
	txn_sign_hash?:string|null,
	rel_req:uniqid, // Withdraw_Req['id']
};
type GetTransactionWithdrawListResponse = PaginateCursor<TransactionWithdrawBriefInfo>;


/** [ALEVEL > 2] 取得交易出金列表 **/
export async function GetTransactionWithdrawList(query:GetTransactionWithdrawListQuery):Promise<GetTransactionWithdrawListResponse>;
export async function GetTransactionWithdrawList(query:GetTransactionWithdrawListQuery, paging:GetTransactionWithdrawListResponse['meta']):Promise<GetTransactionWithdrawListResponse>;
export async function GetTransactionWithdrawList(arg1:GetTransactionWithdrawListQuery, arg2?:GetTransactionWithdrawListResponse['meta']):Promise<GetTransactionWithdrawListResponse> {
	SessionControl.CheckLogin();

	const searchParams = new URLSearchParams();
	let resource = '';
	if(arg1 && arg1 === Object(arg1)) {
		const {token, filter_text, state, order} = arg1;
		if (token !== undefined) 		resource = `/${token}`;

		if (filter_text !== undefined) 	searchParams.set('filter_text', filter_text);
		if (state !== undefined) 		searchParams.set('state', state);
		if (order !== undefined) 		searchParams.set('order', BuildQueryOrderString(order));
	}

	if(arg2 && arg2 === Object(arg2)) {
		const {page, page_size} = arg2;	
		if (page !== undefined) 		searchParams.set('p', arg2.page + '');
		if (page_size !== undefined) 	searchParams.set('ps', arg2.page_size + '');
	}



	return fetch(`${SessionControl.endpoint_url}/api/admin/transaction/withdraw${resource}?${searchParams}`, {
		method:'GET',
		headers: {"Authorization": SessionControl.auth_token}
	})
	.then(ProcRemoteResponse).then((resp)=>resp.json());  
}



/** [ALEVEL > 2] 取得特定交易出金資料 **/
export async function GetTransactionWithdrawInfo(query:GetTransactionWithdrawListQuery):Promise<TransactionWithdrawBriefInfo> {
	return GetTransactionWithdrawList(query)
	.then(response=>response.records[0]); // NOTE: Only return the first record
}



export async function GetTransactionWithdrawById(token:'erc20'|'trc20', id:string):Promise<GetTransactionWithdrawListResponse> {
	SessionControl.CheckLogin();

	return fetch(`${SessionControl.endpoint_url}/api/admin/transaction/withdraw/${token}/${id}`, {
		method:'GET',
		headers: {"Authorization": SessionControl.auth_token}
	})
	.then(ProcRemoteResponse).then((resp)=>resp.json());  
}


export async function UpdateTransactionWithdrawState(token:string, id:string, state:number):Promise<GetTransactionWithdrawListResponse> {
	SessionControl.CheckLogin();

	return fetch(`${SessionControl.endpoint_url}/api/admin/transaction/withdraw/${token}/${id}`, {
		method:'POST',
		headers: {"Authorization": SessionControl.auth_token, "Content-Type": "application/json"},
		body: JSON.stringify({state})
	})
	.then(ProcRemoteResponse).then((resp)=>resp.json());  
}