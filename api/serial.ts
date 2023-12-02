import SessionControl from "./session.js";
import {BuildQueryOrderString, ProcRemoteResponse} from "../lib/tools.js";
import {InviteBatch, InviteMasterCode} from "./data-type/serial.js";



type GetSerialBatchListQuery = {
	text?:string;
	order?:{
		create_time?: DataQueryOrder;
	};
};
type GetSerialBatchListResponse = PaginateCursor<InviteBatch>;

/** [ALEVEL > 1] 取得序號批次列表 **/
export async function GetSerialBatchList(query:GetSerialBatchListQuery):Promise<GetSerialBatchListResponse>;
export async function GetSerialBatchList(query:GetSerialBatchListQuery, paging:GetSerialBatchListResponse['meta']):Promise<GetSerialBatchListResponse>;
export async function GetSerialBatchList(arg1:GetSerialBatchListQuery, arg2?:GetSerialBatchListResponse['meta']):Promise<GetSerialBatchListResponse> {
	SessionControl.CheckLogin();

	const searchParams = new URLSearchParams();
	if(arg1 && arg1 === Object(arg1)) {
		const {text, order} = arg1;
		if (text !== undefined) 		searchParams.set('text', text);
		if (order !== undefined) 		searchParams.set('order', BuildQueryOrderString(order));
	}

	if(arg2 && arg2 === Object(arg2)) {
		const {page, page_size} = arg2;	
		if (page !== undefined) 		searchParams.set('p', arg2.page + '');
		if (page_size !== undefined) 	searchParams.set('ps', arg2.page_size + '');
	}



	return fetch(`${SessionControl.endpoint_url}/api/admin/serial?${searchParams}`, {
		method:'GET',
		headers: {"Authorization": SessionControl.auth_token}
	})
	.then(ProcRemoteResponse).then((resp)=>resp.json());  
}



type GetSerialCodeListQuery = {
	batch_id:string;
	text?:string;
	order?:{
		create_time?: DataQueryOrder;
	};
};
type GetSerialCodeListResponse = PaginateCursor<InviteMasterCode>;

/** [ALEVEL > 1] 取得序號特定批次資料列表 **/
export async function GetSerialCodeList(query:GetSerialCodeListQuery):Promise<GetSerialCodeListResponse>;
export async function GetSerialCodeList(query:GetSerialCodeListQuery, paging:GetSerialCodeListResponse['meta']):Promise<GetSerialCodeListResponse>;
export async function GetSerialCodeList(arg1:GetSerialCodeListQuery, arg2?:GetSerialCodeListResponse['meta']):Promise<GetSerialCodeListResponse> {
	SessionControl.CheckLogin();

	const searchParams = new URLSearchParams();
	let resource:string|undefined;
	if(arg1 && arg1 === Object(arg1)) {
		const {batch_id, text, order} = arg1;
		if (batch_id !== undefined) 	resource = `/${batch_id}`;

		if (text !== undefined) 		searchParams.set('text', text);
		if (order !== undefined) 		searchParams.set('order', BuildQueryOrderString(order));
	}

	if(arg2 && arg2 === Object(arg2)) {
		const {page, page_size} = arg2;	
		if (page !== undefined) 		searchParams.set('p', arg2.page + '');
		if (page_size !== undefined) 	searchParams.set('ps', arg2.page_size + '');
	}



	return fetch(`${SessionControl.endpoint_url}/api/admin/serial${resource}/codes?${searchParams}`, {
		method:'GET',
		headers: {"Authorization": SessionControl.auth_token}
	})
	.then(ProcRemoteResponse).then((resp)=>resp.json());  
}



interface CreateSerialBatchBase {
	num:number;
	type:'fuel'|'master'|'membership';
	note?:string;
}
interface SerialBatchFuel extends CreateSerialBatchBase {
	type:'fuel';
	gain_fuel:num_str;
}
interface SerialBatchOther extends CreateSerialBatchBase {
	type:'master'|'membership';
	gain_duration:number;
}
// type CreateSerialBatchPayload = SerialBatchFuel|SerialBatchOther;
// ISSUE: Suppress type check compile error by force to add base type here, need to redefine if have free time
type CreateSerialBatchPayload = CreateSerialBatchBase|SerialBatchFuel|SerialBatchOther;

/** [ALEVEL > 1] 新增序號批次 **/
export async function CreateSerialBatch(create_info:CreateSerialBatchPayload):Promise<EmptyObject> {
	SessionControl.CheckLogin();

	return fetch(`${SessionControl.endpoint_url}/api/admin/serial`, {
		method:'POST',
		headers: {"Authorization": SessionControl.auth_token, 'Content-Type': 'application/json'},
		body: JSON.stringify(create_info)
	})
	.then(ProcRemoteResponse).then((resp)=>resp.json());
}



/** [ALEVEL > 1] 註銷序號批次 **/
export async function RevokeSerialBatch(id:string):Promise<EmptyObject> {
	SessionControl.CheckLogin();

	return fetch(`${SessionControl.endpoint_url}/api/admin/serial/${id}`, {
		method:'DELETE',
		headers: {"Authorization": SessionControl.auth_token, 'Content-Type': 'application/json'}
	})
	.then(ProcRemoteResponse).then((resp)=>resp.json());
}
