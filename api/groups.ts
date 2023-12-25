
import SessionControl from "./session.js";
import {BuildQueryOrderString, ProcRemoteResponse} from "../lib/tools.js";
import { RoskaGroups, RoskaMembers, RoskaSerials } from './data-type/groups.js';


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

/** 新成立會組列表 **/
export async function Admin_get_new_list(query_data:any) {

	console.log(query_data);
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

/** 進行中會組列表 **/
export async function Admin_get_on_list(query_data:any) {

	console.log(query_data);
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
	
	return fetch(`${SessionControl.endpoint_url}/api/admin/group/serial/on-list?${searchParams}`, {
		method:'GET',
		headers: {"Authorization": SessionControl.auth_token},
	}).then(ProcRemoteResponse).then((resp)=>resp.json());
};

/** 已過期會組列表 **/
export async function Admin_get_past_list(query_data:any) {

	console.log(query_data);
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
	
	return fetch(`${SessionControl.endpoint_url}/api/admin/group/serial/past-list?${searchParams}`, {
		method:'GET',
		headers: {"Authorization": SessionControl.auth_token},
	}).then(ProcRemoteResponse).then((resp)=>resp.json());
};

/** 新增會組列表 **/
export async function add_new_group_serial(query_data?:RoskaSerials){
	SessionControl.CheckLogin();
	
	console.log(query_data);
	return fetch(`${SessionControl.endpoint_url}/api/admin/group/serial`, {
		method:'POST',
		headers: {"Authorization": SessionControl.auth_token, "Content-Type": "application/json"},		
		body: JSON.stringify(query_data)
	}).then(ProcRemoteResponse).then((resp)=>resp.json());
}


/** 管理者搜尋使用者列表 **/


export async function List_all_user(query_data:any) {
	console.log(query_data);
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
	return fetch(`${SessionControl.endpoint_url}/api/admin/user/list?${searchParams}`, {
		method:'GET',
		headers: {"Authorization": SessionControl.auth_token},
	}).then(ProcRemoteResponse).then((resp)=>resp.json());
};

/** 全部會組序號 sid 列表 **/
// get
// /api/admin/group/serial/all-list