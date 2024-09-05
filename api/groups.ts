
import SessionControl from "./session.js";
import { BuildQueryOrderString, ProcRemoteResponse } from "../lib/tools.js";
import { RoskaGroups, RoskaMembers, RoskaSerials } from './data-type/groups.js';

type UserBriefInfo = {
	uid?: uniqid,
	nid: string,
	name: string,
	gender?: 'M'|'F',
	birth_date: string,
	address: string,
	line_id?: string,
	contact_home_number: string,
	contact_mobile_number: string,
	role?: number,
	bank_code?: string,
	branch_code?: string,
	bank_account_name?: string,
	bank_account_number?: string,
	emergency_nid?: uniqid,
	emergency_contact?: string,
	emergency_contact_number?: string,
	emergency_contact_relation?: string,
	relative_path?: string,
	referrer_uid?: uniqid,
	referrer_path?: string,
	volunteer_uid?: uniqid,
	volunteer_path?: string,
	revoked?: boolean,
	password: string,
	update_time?: number,
	create_time?: number,
	[key:string]:any,
}

type Register_User ={
	order?:{
		create_time?: DataQueryOrder,
	}
}
type schema_query = {
	properties:{
		o: string,
		p: string,
		ps:string,
	},
	required:['o', 'p', 'ps'],
};

interface GetUserListQuery {
	filter_text?:string; 									// 可搜尋：id, name, email, address_erc20, address_trc20
	order?: {
		id?: DataQueryOrder; 								// ID
		email?: DataQueryOrder; 							// Email
		level?: DataQueryOrder; 							// 等級
	}
};

type GetUserListResponse = PaginateCursor<UserBriefInfo>;

// export async function GetUserList(query:GetUserListQuery):Promise<GetUserListResponse>;
// export async function GetUserList(query:GetUserListQuery, paging:GetUserListResponse['meta']):Promise<GetUserListResponse>;
// export async function GetUserList(arg1:GetUserListQuery, arg2?:GetUserListResponse['meta']):Promise<GetUserListResponse> {
// 	SessionControl.CheckLogin();

// 	const searchParams = new URLSearchParams();
// 	if(arg1 && arg1 === Object(arg1)) {
// 		const {filter_text, order} = arg1;
// 		if (filter_text !== undefined) 	searchParams.set('filter_text', filter_text);
// 		if (order !== undefined) 		searchParams.set('order', BuildQueryOrderString(order));
// 	}

// 	if(arg2 && arg2 === Object(arg2)) {
// 		const {page, page_size} = arg2;	
// 		if (page !== undefined) 		searchParams.set('p', arg2.page + '');
// 		if (page_size !== undefined) 	searchParams.set('ps', arg2.page_size + '');
// 	}



// 	return fetch(`${SessionControl.endpoint_url}/api/admin/user/list?${searchParams}`, {
// 		method:'GET',
// 		headers: {"Authorization": SessionControl.auth_token}
// 	})
// 	.then(ProcRemoteResponse).then((resp)=>resp.json());  
// }



/** 取得新會組列表 (非後台用) **/

// order:‘DESC’, p:‘2’, ps:‘10’ 
export async function Get_new_list(query_data:any) {
	SessionControl.CheckLogin();
	return fetch(`${SessionControl.endpoint_url}/api/group/serial/new-list`, {
		method:'GET',
		headers: {"Authorization": SessionControl.auth_token},
	}).then(ProcRemoteResponse).then((resp)=>resp.json());
}


/** 1. 新增會組列表 **/
export async function add_new_group_serial(query_data?:RoskaSerials){
	SessionControl.CheckLogin();
	return fetch(`${SessionControl.endpoint_url}/api/admin/group/serial`, {
		method:'POST',
		headers: {"Authorization": SessionControl.auth_token, "Content-Type": "application/json"},		
		body: JSON.stringify(query_data)
	}).then(ProcRemoteResponse).then((resp)=>resp.json());
}

// DELETE
// /api/admin/group/serial/{sid}
// 4.刪除會組序號 sid
export async function delete_group_serial(serial_number:string){
	SessionControl.CheckLogin();
	return fetch(`${SessionControl.endpoint_url}/api/admin/group/serial/`+serial_number, {
		method:'DELETE',
		headers: {"Authorization": SessionControl.auth_token, "Content-Type": "application/json"},		
	}).then(ProcRemoteResponse).then((resp)=>resp.json());
}

/** 2.新成立會組列表 **/
export async function Admin_get_new_list(query_data:any) {
	const searchParams = new URLSearchParams(query_data);
	// if (arg1 && arg1 === Object(arg1)) {
	//     const { filter_text, order } = arg1;
	//     if (filter_text !== undefined)
	//         searchParams.set('filter_text', filter_text);
	//     if (order !== undefined)
	//         searchParams.set('order', (0, tools_js_1$4.BuildQueryOrderString)(order));
	// }
	if (query_data && query_data === Object(query_data)) {
		const { order, page, page_size } = query_data;
		if (order !== undefined)
			searchParams.set('o', query_data.order + '');
		if (page !== undefined)
			searchParams.set('p', query_data.page + '');
		if (page_size !== undefined)
			searchParams.set('ps', query_data.page_size + '');
	}
	SessionControl.CheckLogin();	
	return fetch(`${SessionControl.endpoint_url}/api/admin/group/serial/new-list?${searchParams}`, {
		method:'GET',
		headers: {"Authorization": SessionControl.auth_token},
	}).then(ProcRemoteResponse).then((resp)=>resp.json());
}

/** 3. 進行中會組列表 **/
export async function Admin_get_on_list(query_data:any) {
	const searchParams = new URLSearchParams(query_data);
	if (query_data && query_data === Object(query_data)) {
		const { order, page, page_size } = query_data;
		if (order !== undefined)
			searchParams.set('o', query_data.order + '');
		if (page !== undefined)
			searchParams.set('p', query_data.page + '');
		if (page_size !== undefined)
			searchParams.set('ps', query_data.page_size + '');
	}
	SessionControl.CheckLogin();	
	console.log(searchParams);
	return fetch(`${SessionControl.endpoint_url}/api/admin/group/serial/on-list?${searchParams}`, {
		method:'GET',
		headers: {"Authorization": SessionControl.auth_token},
	}).then(ProcRemoteResponse).then((resp)=>resp.json());
};

/** 4.已過期會組列表 **/
// GET
// /api/admin/group/serial/expired-list
// 已過期會組列表
export async function Admin_get_past_list(query_data:any) {
	const searchParams = new URLSearchParams(query_data);
	if (query_data && query_data === Object(query_data)) {
		const { order, page, page_size } = query_data;
		if (order !== undefined)
			searchParams.set('o', query_data.order + '');
		if (page !== undefined)
			searchParams.set('p', query_data.page + '');
		if (page_size !== undefined)
			searchParams.set('ps', query_data.page_size + '');
	}
	SessionControl.CheckLogin();
	console.log(searchParams);
	return fetch(`${SessionControl.endpoint_url}/api/admin/group/serial/expired-list?${searchParams}`, {
		method:'GET',
		headers: {"Authorization": SessionControl.auth_token},
	}).then(ProcRemoteResponse).then((resp)=>resp.json());
};


// GET
// /api/admin/file/latest-bid-opening-record
// 產所有開標紀錄 excel 表	
export async function export_all(){
	SessionControl.CheckLogin();
	return fetch(`${SessionControl.endpoint_url}/api/admin/file/latest-bid-opening-record`, {
		method:'GET',
		headers: {"Authorization": SessionControl.auth_token},		
	}).then(ProcRemoteResponse).then((resp)=>resp.json());
}


//GET
// /api/group/member/{sid}
/**搜尋該團下的成員**/
export async function Get_in_groups(query_data?:RoskaSerials){
	SessionControl.CheckLogin();
	return fetch(`${SessionControl.endpoint_url}/api/group/member/`+query_data, {
		method:'GET',
		headers: {"Authorization": SessionControl.auth_token},		
	}).then(ProcRemoteResponse).then((resp)=>resp.json());
}

//GET
// /api/group/member/{sid}
/**搜尋該團下的成員**/
export async function Get_in_groups_adm(query_data?:RoskaSerials){
	SessionControl.CheckLogin();
	return fetch(`${SessionControl.endpoint_url}/api/adm/group/member/`+query_data, {
		method:'GET',
		headers: {"Authorization": SessionControl.auth_token},		
	}).then(ProcRemoteResponse).then((resp)=>resp.json());
}

/** 管理者搜尋使用者列表 **/

export async function List_all_user(query:GetUserListQuery):Promise<GetUserListResponse>;
export async function List_all_user(query:GetUserListQuery, paging:GetUserListResponse['meta']):Promise<GetUserListResponse>;
export async function List_all_user(arg1:GetUserListQuery, arg2?:GetUserListResponse['meta']):Promise<GetUserListResponse> {
// export async function List_all_user(query_data:any) {
	SessionControl.CheckLogin();	
	const searchParams = new URLSearchParams();	
	if(arg1 && arg1 === Object(arg1)) {
		const {filter_text, order} = arg1;
		if (filter_text !== undefined) 	searchParams.set('filter_text', filter_text);
		if (order !== undefined) 		searchParams.set('order', BuildQueryOrderString(order));
	}

	if(arg2 && arg2 === Object(arg2)) {
		const {page, page_size} = arg2;	
		console.log("2");
		if (page !== undefined) 		searchParams.set('p', arg2.page + '');
		if (page_size !== undefined) 	searchParams.set('ps', arg2.page_size + '');
	}
	
	console.log(searchParams);
	return fetch(`${SessionControl.endpoint_url}/api/admin/user/list?${searchParams}`, {
		method:'GET',
		headers: {"Authorization": SessionControl.auth_token},
	}).then(ProcRemoteResponse).then((resp)=>resp.json());
};

/** 全部會組序號 sid 列表 **/
// get
// /api/admin/group/serial/all-list


/** 12. 開標 gid **/
//POST
// /api/admin/group/bid
export async function bid_group_serial(query_data:any){
	SessionControl.CheckLogin();
	return fetch(`${SessionControl.endpoint_url}/api/admin/group/bid`, {
		method:'POST',
		headers: {"Authorization": SessionControl.auth_token, "Content-Type": "application/json"},	
		body: JSON.stringify(query_data)	
	}).then(ProcRemoteResponse).then((resp)=>resp.json());
}

// POST
// /api/admin/group/bid/assign
// 指定得標者
export async function assign_bid(query_data:any){
	SessionControl.CheckLogin();
	return fetch(`${SessionControl.endpoint_url}/api/admin/group/bid/assign`, {
		method:'POST',
		headers: {"Authorization": SessionControl.auth_token, "Content-Type": "application/json"},	
		body: JSON.stringify(query_data)	
	}).then(ProcRemoteResponse).then((resp)=>resp.json());
}




// GET
// /api/admin/user/{uid}
// 管理者搜尋使用者個人資料

export async function Get_user(query_data?:RoskaMembers){
	SessionControl.CheckLogin();
	return fetch(`${SessionControl.endpoint_url}/api/admin/user/`+query_data, {
		method:'GET',
		headers: {"Authorization": SessionControl.auth_token},		
	}).then(ProcRemoteResponse).then((resp)=>resp.json());
}


// POST
// /api/admin/group/serial
// 1.產會組序號，比如: YA0034，和一組新的會組編號

// GET
// /api/admin/group/serial/new-list
// 2.新成立會組列表


// GET
// /api/admin/group/serial/on-list
// 3.進行中會組列表


// GET
// /api/admin/group/serial/past-list
// 4.已過期會組列表


// GET
// /api/admin/group/serial/all-list
// 5.全部會組序號 sid 列表


// GET
// /api/admin/group/serial/{sid}
// 6.搜尋會組序號 sid


// DELETE
// /api/admin/group/serial/{sid}
// 4.刪除會組序號 sid


// POST
// /api/admin/group/group/{sid}
// 8.產會期編號

export async function add_group_id(query_data:any){
	SessionControl.CheckLogin();
	return fetch(`${SessionControl.endpoint_url}/api/admin/group/group/`+query_data, {
		method:'POST',
		headers: {"Authorization": SessionControl.auth_token, "Content-Type": "application/json"},	
		body: JSON.stringify(query_data)	
	}).then(ProcRemoteResponse).then((resp)=>resp.json());
}

// GET
// /api/admin/group/group/all-list
// 9.全部會期 gid 列表


// GET
// /api/admin/group/group/list/{sid}
// 10.會組序號 sid 下的 會組 gid 列表


// GET
// /api/admin/group/bid/list/{gid}
// 11.下標列表


// GET
// /api/admin/group/bid/{gid}
// 12.開標 gid


// POST
// /api/admin/group/member
// 13.新增會員入會


// GET
// /api/admin/group/member/all-list/{sid}
// 14.搜尋會組序號 sid


// DELETE
// /api/admin/group/member/{mid}
// 15.刪除會員序號 mid??


// GET
// /api/admin/group/group/settlement-list/{uid}
// 各會期結算列表
export async function Admin_Get_settlement_list(query_data?:RoskaMembers,year?:number,month?:number){
	// console.log(`${SessionControl.endpoint_url}/api/admin/group/group/settlement-list/`+query_data)
	SessionControl.CheckLogin();
	return fetch(`${SessionControl.endpoint_url}/api/admin/group/group/settlement-list/`+query_data, {
		method:'GET',
		headers: {"Authorization": SessionControl.auth_token},		
	}).then(ProcRemoteResponse).then((resp)=>resp.json());
}

// GET
// /api/admin/file/all-member-pay-record
// 全部會員開標付款紀錄表
export async function export_all_member_settlement(){
	// console.log(`${SessionControl.endpoint_url}/api/admin/file/member-pay-record/`+query_data)
	SessionControl.CheckLogin();
	return fetch(`${SessionControl.endpoint_url}/api/admin/file/all-member-pay-record`, {
		method:'GET',
		headers: {"Authorization": SessionControl.auth_token},		
	}).then(ProcRemoteResponse).then((resp)=>resp.json());
}

// GET
// /api/admin/file/member-pay-record
// 會員開標付款紀錄表
export async function export_member_settlement(query_data?:RoskaMembers){
	// console.log(`${SessionControl.endpoint_url}/api/admin/file/member-pay-record/`+query_data)
	SessionControl.CheckLogin();
	return fetch(`${SessionControl.endpoint_url}/api/admin/file/member-pay-record/`+query_data, {
		method:'GET',
		headers: {"Authorization": SessionControl.auth_token},		
	}).then(ProcRemoteResponse).then((resp)=>resp.json());
}
