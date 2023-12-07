
import SessionControl from "./session.js";
import {BuildQueryOrderString, ProcRemoteResponse} from "../lib/tools.js";
import { RoskaGroups, RoskaMembers, RoskaSerials } from './data-type/gropus';


type Register_User ={
	order?:{
		create_time?: DataQueryOrder,
	}
}



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



/**取得新會組列表 **/
export async function Get_new_list() {
	SessionControl.CheckLogin();
	
	return fetch(`${SessionControl.endpoint_url}/api/group/serial/new-list`, {
		method:'GET',
		// headers: {"Content-Type": "application/json"},
		headers: {"Authorization": SessionControl.auth_token},
		
		// body: JSON.stringify(New_list_Data)
	}).then(ProcRemoteResponse).then((resp)=>resp.json());
}


export async function add_new_group_serial(query_data?:RoskaSerials){
	SessionControl.CheckLogin();
	
	console.log(query_data);
	return fetch(`${SessionControl.endpoint_url}/api/admin/group-serial`, {
		method:'POST',
		headers: {"Authorization": SessionControl.auth_token, "Content-Type": "application/json"},		
		body: JSON.stringify(query_data)
	}).then(ProcRemoteResponse).then((resp)=>resp.json());
}