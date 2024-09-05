export default void(0);

declare global {
	type HuntErrorResponse = {
		code:string;
		msg:string;
		detail?:any;
	};
	type HuntErrorItem = HuntErrorResponse & {status:number};



	type DataQueryOrder = 'asc'|'desc';

	interface HistoryRecord {
		id: uniqid;
		uid: uniqid;
		type: `${string}#${string}`;
		create_time:num_str; // epoch time in milliseconds
	}
}



// REGION: [ Types for remote responses ]
declare global {
	interface PaginateCursorMeta {
		page:uint;
		page_size:uint;
		total_records?:uint;
		total_pages?:uint;
	};

	interface PaginateCursor<RecordType> {
		records:RecordType[];
		meta: Required<PaginateCursorMeta>;
	}

	interface APIErrorResponse {
		scope:string;
		code:string;
		msg:string;
		detail?:any;
	}
	type APIResponse<SuccessType=any> = SuccessType|APIErrorResponse;
}
// ENDREGION

// REGION: [ Types for User]
// interface


declare global {
	var ExcelJS:any;
	var TestData = {
		ContinueGroup_data:[{}],
		OtherData,
	};	
}
export { TestData }; 