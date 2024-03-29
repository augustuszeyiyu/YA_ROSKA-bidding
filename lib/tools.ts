export function BuildQueryOrderString(order:{[key:string]: DataQueryOrder}):string {
	const conditions:string[] = [];
	for(const key in order) {
		conditions.push(`${key}:${order[key]}`);
	}
	return conditions.join(',');
}



export const FlattenPromise = <T>() => {
	let resolve!: (value: T | PromiseLike<T>) => void;
	let reject!: (reason?: any) => void;
	const promise = new Promise<T>((res, rej) => {
		resolve = res;
		reject = rej;
	});

	return {
		resolve,
		reject,
		promise,
	};
};



export function CastPercentageStringToIntArray(percentage:string):int[]{
	percentage = String(percentage);
	const PERCANTAGE_STRING_FORMAT = /^\d+(\.\d)?$/;
	if(!PERCANTAGE_STRING_FORMAT.test(percentage)) throw new Error(`Invalid percentage string format! Only accept ${PERCANTAGE_STRING_FORMAT}`);

	const percentage_texts = percentage.split('.');
	const numerator = parseInt(percentage_texts.join(''));
	const power = (percentage_texts[1]||'').length;
	const denominator = 100 * Math.pow(10, power);

	return [numerator, denominator];
}

export function CastPercentageIntArrayToString(fraction_array:int[]):string{
	const type_check = (value:int)=> !Number.isNaN(parseInt(value+''));
	if(!fraction_array.every(type_check)) throw new Error(`Invalid fraction array format! Only accept number array!`);

	const [numerator, denominator] = fraction_array;
	const digits = Math.ceil(Math.log10(denominator / 100));
	const full_string = numerator.toString();
	const split_index = full_string.length - digits;

	const raw_integer_place = full_string.substring(0, split_index);
	const integer_place = raw_integer_place? raw_integer_place: '0';

	const raw_decimal_place = full_string.substring(split_index);
	const decimal_place = raw_decimal_place? `.${raw_decimal_place}`: raw_decimal_place;

	return `${integer_place}${decimal_place}`;
}



const numeric_type = /(\d+)(.(\d+))?/;
export function FromUSDT(num_str:string|number):BigInt|undefined {
	const raw = '' + num_str;
	const matches = raw.match(numeric_type);
	if ( !matches ) return undefined

	const [, decimal='0',,fraction='0'] = matches;
	return BigInt(decimal) * 1000000n + BigInt(fraction.substring(0, 6).padEnd(6, '0'));
}
export function ToUSDT(value:string|number|BigInt):string {
	const raw_value = BigInt(value as string);
	const integer	= (raw_value/1000000n).toString(10);
	const remaining	= (raw_value%1000000n).toString(10).padStart(6, '0').replace(/(0+)$/, '');
	return `${integer}${(remaining.length > 0 ? '.' : '') + remaining}`;
}





interface ROSKA_FORMErrorStruct {
	code:`${string}#${string}`;
	scope:string;
	msg:string;
	detail?:any;
}
export class ROSKA_FORMRemoteError extends Error {
	readonly code:`${string}#${string}`;
	readonly scope:string;
	readonly detail?:any;

	constructor(err_info:ROSKA_FORMErrorStruct) {
		super(err_info.msg);
		Object.setPrototypeOf(this, new.target.prototype);

		this.code  = err_info.code;
		this.scope = err_info.scope;
		this.detail = err_info.detail;
	}
};

export async function ProcRemoteResponse(resp:Response, whitelist:number[]=[]):Promise<Response> {
	const white_list:number[] = [200];
	for(const num of whitelist) if ( num >= 200 && num <300 ) white_list.push(num);
	if ( white_list.indexOf(resp.status) >= 0 ) return resp;


	
	const raw_content = await resp.text();
	let final_error:ROSKA_FORMRemoteError;
	try {
		final_error = new ROSKA_FORMRemoteError(JSON.parse(raw_content));
	}
	catch(e) {
		final_error = new ROSKA_FORMRemoteError({
			code: 'internal#invalid-error-response',
			scope: 'internal',
			msg: 'Invalid remote error response !',
			detail: raw_content
		});
	}

	return Promise.reject(final_error);
}


export function TruncateFraction(number:number, fraction_digits = 0) {
	const sign = number >= 0 ? '' : '-';
	number = Math.abs(number);
	
	const enlarge_ratio = Math.pow(10, fraction_digits);
	const fraction = pad_zero(Math.floor(number*enlarge_ratio)%enlarge_ratio, fraction_digits);
	const integer = Math.floor(number);
	return sign + integer + '.' + fraction;
}

export function pad_zero(i:number, num:number) {
	const str = '' + i;
	const repeat = num - str.length;
	return '0'.repeat(repeat > 0 ? repeat : 0) + str;
}
