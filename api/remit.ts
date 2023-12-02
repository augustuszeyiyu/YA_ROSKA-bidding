import SessionControl from "./session.js";
import {BuildQueryOrderString, ProcRemoteResponse} from "../lib/tools.js";
import {RemitInfo} from "./data-type/remit.js";



type GetRemitListQuery = {
	token:string;

	uid?:string;
	state?:string;
	order?:{
		create_time?: DataQueryOrder;
	};
};
type GetRemitListResponse = PaginateCursor<RemitInfo>;
export async function GetRemitList(query:GetRemitListQuery):Promise<GetRemitListResponse>;
export async function GetRemitList(query:GetRemitListQuery, paging:GetRemitListResponse['meta']):Promise<GetRemitListResponse>;
export async function GetRemitList(arg1:GetRemitListQuery, arg2?:GetRemitListResponse['meta']):Promise<GetRemitListResponse> {
	SessionControl.CheckLogin();

	const searchParams = new URLSearchParams();
	let resource = '';
	if(arg1 && arg1 === Object(arg1)) {
		const {token, uid, state, order} = arg1;
		if (token !== undefined) 		resource = `/${token}`;

		if (uid !== undefined) 	searchParams.set('uid', uid);
		if (state !== undefined) 		searchParams.set('state', state);
		if (order !== undefined) 		searchParams.set('order', BuildQueryOrderString(order));
	}

	if(arg2 && arg2 === Object(arg2)) {
		const {page, page_size} = arg2;	
		if (page !== undefined) 		searchParams.set('p', arg2.page + '');
		if (page_size !== undefined) 	searchParams.set('ps', arg2.page_size + '');
	}



	return fetch(`${SessionControl.endpoint_url}/api/admin/remit${resource}?${searchParams}`, {
		method:'GET',
		headers: {"Authorization": SessionControl.auth_token}
	})
	.then(ProcRemoteResponse).then((resp)=>resp.json());  
}

export async function GetRemitInfo(query:GetRemitListQuery):Promise<RemitInfo> {
	return GetRemitList(query)
	.then(response=>response.records[0]); // NOTE: Only return the first record
}

export async function GetRemitById(token:'erc20'|'trc20', id:string):Promise<RemitInfo> {
	SessionControl.CheckLogin();

	return fetch(`${SessionControl.endpoint_url}/api/admin/remit/${token}/${id}`, {
		method:'GET',
		headers: {"Authorization": SessionControl.auth_token}
	})
	.then(ProcRemoteResponse).then((resp)=>resp.json());  
}

type GetUserListQuery = {
	token:string;

	uid?:string;
	filter_text?:string;
	order?:{
		create_time?: DataQueryOrder;
		wallet_balance_erc20?: DataQueryOrder;
		wallet_balance_trc20?: DataQueryOrder;
	};
};
type GetUserListResponse = PaginateCursor<{id:uniqid, name:string, email:string, address_trc20:string, address_erc20:string, wallet_balance_erc20:num_str, wallet_balance_trc20:num_str, collectable: boolean}>;
export async function GetRemitByUserId(query:GetUserListQuery):Promise<GetUserListResponse>;
export async function GetRemitByUserId(query:GetUserListQuery, paging:GetUserListResponse['meta']):Promise<GetUserListResponse>;
export async function GetRemitByUserId(arg1:GetUserListQuery, arg2?:GetUserListResponse['meta']):Promise<GetUserListResponse> {
	SessionControl.CheckLogin();

	const searchParams = new URLSearchParams();
	let resource = '';
	if(arg1 && arg1 === Object(arg1)) {
		const {token, uid, filter_text, order} = arg1;
		if (token !== undefined) 		resource = `/${token}`;

		if (uid !== undefined) 			searchParams.set('uid', uid);
		if (filter_text !== undefined) 	searchParams.set('filter_text', filter_text);
		if (order !== undefined) 		searchParams.set('order', BuildQueryOrderString(order));
	}

	if(arg2 && arg2 === Object(arg2)) {
		const {page, page_size} = arg2;
		if (page !== undefined) 		searchParams.set('p', arg2.page + '');
		if (page_size !== undefined) 	searchParams.set('ps', arg2.page_size + '');
	}



	return fetch(`${SessionControl.endpoint_url}/api/admin/remit/user${resource}?${searchParams}`, {
		method:'GET',
		headers: {"Authorization": SessionControl.auth_token}
	})
	.then(ProcRemoteResponse).then((resp)=>resp.json()); 
}

export async function UpdateRemitByUserId(token:string, uid:uniqid):Promise<{}> {
	SessionControl.CheckLogin();

	return fetch(`${SessionControl.endpoint_url}/api/admin/remit/user/${token}/${uid}`, {
		method:'POST',
		headers: {"Authorization": SessionControl.auth_token, "Content-Type": "application/json"},
		body: JSON.stringify({})
	})
	.then(ProcRemoteResponse).then((resp)=>resp.json());  
}