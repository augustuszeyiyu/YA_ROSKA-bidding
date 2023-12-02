import SessionControl from "./session.js";
import {BuildQueryOrderString, ProcRemoteResponse} from "../lib/tools.js";
import {MaintenanceInfo} from "./data-type/maintenance.js";



type GetMaintenanceListQuery = {
	order?:{
		create_time?: DataQueryOrder;
	};
};
type MaintenanceBriefInfo = {
	id: MaintenanceInfo['id'], 					// 公告 id
	title:MaintenanceInfo['title'], 			// 公告標題
	create_time:MaintenanceInfo['create_time'] 	// 公告建立日期
};
type GetMaintenanceListResponse = PaginateCursor<MaintenanceBriefInfo>;

/** [ALEVEL > 1] 取得公告列表 **/
export async function GetMaintenanceList(query:GetMaintenanceListQuery):Promise<GetMaintenanceListResponse>;
export async function GetMaintenanceList(query:GetMaintenanceListQuery, paging:GetMaintenanceListResponse['meta']):Promise<GetMaintenanceListResponse>;
export async function GetMaintenanceList(arg1:GetMaintenanceListQuery, arg2?:GetMaintenanceListResponse['meta']):Promise<GetMaintenanceListResponse> {
	SessionControl.CheckLogin();

	const searchParams = new URLSearchParams();
	if(arg1 && arg1 === Object(arg1)) {
		const {order} = arg1;
		if (order !== undefined) 		searchParams.set('order', BuildQueryOrderString(order));
	}

	if(arg2 && arg2 === Object(arg2)) {
		const {page, page_size} = arg2;	
		if (page !== undefined) 		searchParams.set('p', arg2.page + '');
		if (page_size !== undefined) 	searchParams.set('ps', arg2.page_size + '');
	}



	return fetch(`${SessionControl.endpoint_url}/api/admin/maintenance-list?${searchParams}`, {
		method:'GET',
		headers: {"Authorization": SessionControl.auth_token}
	})
	.then(ProcRemoteResponse).then((resp)=>resp.json());  
}



type GetMaintenanceInfoResponse = MaintenanceInfo;

/** [ALEVEL > 1] 取得特定公告資料 **/
export async function GetMaintenanceInfo(id:string):Promise<GetMaintenanceInfoResponse> {
	SessionControl.CheckLogin();

	return fetch(`${SessionControl.endpoint_url}/api/admin/maintenance/${id}`, {
		method:'GET',
		headers: {"Authorization": SessionControl.auth_token}
	})
	.then(ProcRemoteResponse).then((resp)=>resp.json());  
}



type CreateMaintenanceInfoPayload = {
	type: MaintenanceInfo['type'],
	title: MaintenanceInfo['title'],
	content: MaintenanceInfo['content'],
	display_time: MaintenanceInfo['display_time'],
	start_time: MaintenanceInfo['start_time'],
	end_time: MaintenanceInfo['end_time']
};

/** [ALEVEL > 1] 新增特定公告資料 **/
export async function CreateMaintenanceInfo(create_info:CreateMaintenanceInfoPayload):Promise<EmptyObject> {
	SessionControl.CheckLogin();

	return fetch(`${SessionControl.endpoint_url}/api/admin/maintenance`, {
		method:'POST',
		headers: {"Authorization": SessionControl.auth_token, 'Content-Type': 'application/json'},
		body: JSON.stringify(create_info)
	})
	.then(ProcRemoteResponse).then((resp)=>resp.json());
}



type UpdateMaintenanceInfoPayload = Partial<CreateMaintenanceInfoPayload>;

/** [ALEVEL > 1] 更改特定公告資料 **/
export async function UpdateMaintenanceInfo(id:string, update_info:UpdateMaintenanceInfoPayload):Promise<EmptyObject> {
	SessionControl.CheckLogin();

	return fetch(`${SessionControl.endpoint_url}/api/admin/maintenance/${id}`, {
		method:'POST',
		headers: {"Authorization": SessionControl.auth_token, 'Content-Type': 'application/json'},
		body: JSON.stringify(update_info)
	})
	.then(ProcRemoteResponse).then((resp)=>resp.json());
}
