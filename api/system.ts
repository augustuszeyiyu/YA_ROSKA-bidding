import {ProcRemoteResponse} from "../lib/tools.js";
import SessionControl from "./session.js";
import {DBSysvar} from "./data-type/sysvar.js";
import {MasterWalletStates} from "./data-type/wallet.js";



type GetSystemStatisticsInfoResponse = {
	num_users: num_str, 		// 總使用者數

	num_lv0_users: num_str, 	// 各等級使用者人數 (lv0~lv10)
	num_lv1_users: num_str,
	num_lv2_users: num_str,
	num_lv3_users: num_str,
	num_lv4_users: num_str,
	num_lv5_users: num_str,
	num_lv6_users: num_str,
	num_lv7_users: num_str,
	num_lv8_users: num_str,
	num_lv9_users: num_str,
	num_lv10_users: num_str,

	total_deposit_erc: num_str	// erc 入金數量
	total_deposit_trc: num_str,	// trc 入金數量
	total_deposit: num_str		// 總入金數量 = total_deposit_erc + total_deposit_trc
};

/** [ALEVEL > 1] 取得當前系統統計資訊 **/
export async function GetSystemStatisticsInfo():Promise<GetSystemStatisticsInfoResponse> {
	return fetch(`${SessionControl.endpoint_url}/api/admin/system/statistic-info`, {
		method:'GET',
		headers: {"Authorization": SessionControl.auth_token}
	})
	.then(ProcRemoteResponse).then((resp)=>resp.json());  
}



/** [ALEVEL > 1] 取得系統設定值 **/
export async function GetSystemSysvar():Promise<DBSysvar[]> {
	SessionControl.CheckLogin();

	return fetch(`${SessionControl.endpoint_url}/api/admin/system/sysvar`, {
		method:'GET',
		headers: {"Authorization": SessionControl.auth_token}
	})
	.then(ProcRemoteResponse).then((resp)=>resp.json());
}



type UpdateSystemSysvarPayload = {
	level_9_ratio:  [int, int], // [分子, 分母]
	level_10_ratio: [int, int],
	fuel_ratio: [int, int],			// Default: 0.01

	fuel_share_ratio: number, 	// fuel ratio 系列的數值範圍是 0 < V <= 1，Default: 0.2
	fuel_taker_ratio: number, 	// Default: 0.01
	fuel_sys_ratio:   number, 	// Default: 0.01
};

/** [ALEVEL > 10] 更改系統設定值 **/
export async function UpdateSystemSysvar(update_info:UpdateSystemSysvarPayload):Promise<EmptyObject> {
	SessionControl.CheckLogin();

	return fetch(`${SessionControl.endpoint_url}/api/admin/system/sysvar`, {
		method:'POST',
		headers: {"Authorization": SessionControl.auth_token, 'Content-Type': 'application/json'},
		body: JSON.stringify(update_info)
	})
	.then(ProcRemoteResponse).then((resp)=>resp.json());
}



/** 取得大錢包狀態 **/
export async function GetMasterWalletState():Promise<MasterWalletStates> {
	SessionControl.CheckLogin();

	return fetch(`${SessionControl.endpoint_url}/api/admin/master-wallet/state`, {
		method:'GET',
		headers: {"Authorization": SessionControl.auth_token}
	})
	.then(ProcRemoteResponse).then((resp)=>resp.json());
}
