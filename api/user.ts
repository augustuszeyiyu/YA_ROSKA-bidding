import SessionControl from "./session.js";
import {BuildQueryOrderString, ProcRemoteResponse} from "../lib/tools.js";
import { HTExAPIVendorPrefix, HTExAPIVendorExceptBinance, HTSymbols, HTMarkets, HTExAPIVendors } from "./data-type/trading.js";


interface GetUserListQuery {
	// ex:string,
	// market:string,
	// symbol:string,
	filter_text?:string; 									// 可搜尋：id, name, email, address_erc20, address_trc20
	order?: {
		id?: DataQueryOrder; 								// ID
		email?: DataQueryOrder; 							// Email
		level?: DataQueryOrder; 							// 等級
	} & {
		[K in `${HTExAPIVendors}_win_ratio_30d_${Lowercase<HTSymbols>}_${HTMarkets}`   |
			  `${HTExAPIVendors}_gain_ratio_30d_${Lowercase<HTSymbols>}_${HTMarkets}`  |
			  `${HTExAPIVendors}_profit_30d_${Lowercase<HTSymbols>}_${HTMarkets}`	   |
			  `${HTExAPIVendors}_profit_gain_30d_${Lowercase<HTSymbols>}_${HTMarkets}` |
			  `${HTExAPIVendors}_profit_lose_30d_${Lowercase<HTSymbols>}_${HTMarkets}`
		]?: DataQueryOrder
	}
};
type UserBriefInfo = {
	id: string, 		// 使用者 id
	email:string, 		// 使用者 email
	level:number, 		// 使用者註冊日
	create_time:number 	// 使用者等級
	exchange: HTExAPIVendors,
	market: HTMarkets,
	symbol: HTSymbols,
	win_ratio_30d: num_str,
	gain_ratio_30d: num_str,
	profit_30d: num_str,
	profit_gain_30d: num_str,
	profit_lose_30d: num_str,
};
type GetUserListResponse = PaginateCursor<UserBriefInfo>;

/** [ALEVEL > 2] 取得使用者列表 **/
export async function GetUserList(query:GetUserListQuery):Promise<GetUserListResponse>;
export async function GetUserList(query:GetUserListQuery, paging:GetUserListResponse['meta']):Promise<GetUserListResponse>;
export async function GetUserList(arg1:GetUserListQuery, arg2?:GetUserListResponse['meta']):Promise<GetUserListResponse> {
	SessionControl.CheckLogin();

	const searchParams = new URLSearchParams();
	if(arg1 && arg1 === Object(arg1)) {
		const {filter_text, order} = arg1;
		if (filter_text !== undefined) 	searchParams.set('filter_text', filter_text);
		if (order !== undefined) 		searchParams.set('order', BuildQueryOrderString(order));
	}

	if(arg2 && arg2 === Object(arg2)) {
		const {page, page_size} = arg2;	
		if (page !== undefined) 		searchParams.set('p', arg2.page + '');
		if (page_size !== undefined) 	searchParams.set('ps', arg2.page_size + '');
	}



	return fetch(`${SessionControl.endpoint_url}/api/admin/user/list?${searchParams}`, {
		method:'GET',
		headers: {"Authorization": SessionControl.auth_token}
	})
	.then(ProcRemoteResponse).then((resp)=>resp.json());  
}



type GetUserInfoResponse = {
	id: string, 								// 使用者 id
	name: string,								// 使用者稱呼
	email: string, 								// 使用者信箱
	address_erc20: string, 						// 使用者地址 erc
	address_trc20: string, 						// 使用者地址 trc
	admin_level: number,
	member_level: number,
	level: number, 								// 使用者等級
	expired_time: number, 						// 會員效期 - taker
	expired_time_follower: number,				// 會員效期 - follower
	trading_duration: number, 					// 剩餘時數
	fuel: num_str, 								// 燃料點數
	fuel_free: num_str, 						// 免費燃料點數
	total_gain: num_str, 						// 總獲利 = 推薦獲利 + 帶單獲利
	// gain_followed: num_str, 					// 帶單獲利

	gain: num_str, 								// 推薦獲利 
	perf_bonus: num_str,						// 業務獎勵
	balance: num_str, 							// 錢包餘額
	consumable_balance: num_str,				// 兌換點數
	
	total_balance: num_str, 					// 總資產 = 錢包餘額 + 推薦獲利 + 帶單獲利
	create_time: number,		 				// 註冊日

	paid: boolean, 
	shared: boolean, 
	referrer: string,
	disabled: boolean,

	allow_withdraw: boolean, 					// 是否允許出金
	allow_transfer: boolean,					// 是否允許內轉
	otp_reset: boolean,							// 是否重設二次驗證
	otp_verified: boolean, 						// 是否設過二次驗證

	enable_following_taker: boolean,			// 是否開啟跟隨
	enable_signaling_taker: boolean,			// 是否開啟訊號

	lv9_ratio: number[], 						// 使用者 lv9/lv10 設定資料
	lv10_ratio: number[],

	simulate_trader_btcusdt: boolean,
	simulate_trader_ethusdt: boolean,
} & {
	[K in `${HTExAPIVendorPrefix<HTExAPIVendorExceptBinance>}master_expired_time_${HTMarkets}_${Lowercase<HTSymbols>}`]?:number    // 幣別對的高手到期時間
} & {
	[K in `${HTExAPIVendors}_allow_follow_${HTMarkets}_${Lowercase<HTSymbols>}`]?: boolean         // 是否開放跟隨
} & {
	[K in `${HTExAPIVendors}_win_ratio_30d_${Lowercase<HTSymbols>}_${HTMarkets}`   |  // 勝率
	      `${HTExAPIVendors}_gain_ratio_30d_${Lowercase<HTSymbols>}_${HTMarkets}`  |  // 收益比
		  `${HTExAPIVendors}_profit_30d_${Lowercase<HTSymbols>}_${HTMarkets}`	   |  // 淨利
		  `${HTExAPIVendors}_profit_gain_30d_${Lowercase<HTSymbols>}_${HTMarkets}` |  // 收益
		  `${HTExAPIVendors}_profit_lose_30d_${Lowercase<HTSymbols>}_${HTMarkets}`    // 虧損
	]?: string | undefined
};


/** [ALEVEL > 2] 取得特定使用者資料 **/
export async function GetUserInfo(id:string):Promise<GetUserInfoResponse> {
	SessionControl.CheckLogin();

	const url = new URL(`${SessionControl.endpoint_url}/api/admin/user/${id}`);
	// url.searchParams.set('ex', ex);
	// url.searchParams.set('market', market);
	// url.searchParams.set('symbol', symbol);

	return fetch(url.href, {
		method:'GET',
		headers: {"Authorization": SessionControl.auth_token}
	})
	.then(ProcRemoteResponse).then((resp)=>resp.json());  
}



type UpdateUserInfoPayload = {
	uid:string, 
	email:string, 								// 信箱
	password:string, 							// 密碼
	secure_password:string, 					// 安全密碼
	level?: number, 							// 調整等級
	admin_level?: number,						// 

	lv9_ratio?: number[], 						// lv9/lv10 設定資料
	lv10_ratio?: number[],

	allow_withdraw?: boolean, 					// 是否允許出金
	allow_transfer?: boolean,					// 是否允許內轉
	otp_reset?: boolean,						// 是否重設二次驗證

	trading_duration?: number,
	expired_time?: number,

	enable_following_taker?: boolean,			// 是否開啟跟隨
	enable_signaling_taker?: boolean,			// 是否開啟訊號
} & {
	[K in `${HTExAPIVendorPrefix<HTExAPIVendorExceptBinance>}master_expired_time_${HTMarkets}_${Lowercase<HTSymbols>}`]?:number    // 幣別對的高手到期時間
} & {
	[K in `${HTExAPIVendors}_allow_follow_${HTMarkets}_${Lowercase<HTSymbols>}`]?: boolean         // 是否開放跟隨
};

/** [ALEVEL > 3] 更改特定使用者資料 **/
export async function UpdateUserInfo(update_info:UpdateUserInfoPayload):Promise<EmptyObject> {
	SessionControl.CheckLogin();

	return fetch(`${SessionControl.endpoint_url}/api/admin/user`, {
		method:'POST',
		headers: {"Authorization": SessionControl.auth_token, 'Content-Type': 'application/json'},
		body: JSON.stringify(update_info)
	})
	.then(ProcRemoteResponse).then((resp)=>resp.json());
}

/** [ALEVEL > ?] 重設特定使用者密碼 **/
export async function ResetUserPassword(id:string):Promise<EmptyObject> {
	SessionControl.CheckLogin();

	return fetch(`${SessionControl.endpoint_url}/api/admin/auth/pass-reset/${id}`, {
		method:'GET',
		headers: {"Authorization": SessionControl.auth_token}
	})
	.then(ProcRemoteResponse).then((resp)=>resp.json());
}
