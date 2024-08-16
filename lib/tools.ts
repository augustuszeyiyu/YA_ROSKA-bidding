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



export function pad_space(i:number, num:number) {
	const str = '' + i;
	const repeat = num - str.length;
	return '&ensp;'.repeat(repeat > 0 ? repeat : 0) + str;
}

export function isWeekend(date:Date) {
	// Check if the day of the week is Saturday (6) or Sunday (0).
	return date.getDay() === 0 || date.getDay() === 6;
}
export function calculateMonthlyBitStartTime(bid_start_time:Date, index:number) {
	// console.log(bid_start_time);
        
	// Calculate Start Time with month and year rollover and weekend avoidance
	const newMonth = bid_start_time.getMonth() + index;
	//const yearOffset = Math.floor(newMonth / 12); // Calculate how many years to add
	var yearOffset;
	if(newMonth<0){
		yearOffset = -1;
	}
	else{
		yearOffset = 0;
	};
	const monthInYear = newMonth % 12; // Calculate the month within the year
	// console.log({newMonth, yearOffset, monthInYear});
	

	const newYear = bid_start_time.getFullYear() + yearOffset;
	let newDate = new Date(newYear, monthInYear, 10);
	// console.log({newYear, newDate});
		// Check if the calculated date is a weekend
		if (isWeekend(newDate) === true) {
			if (newDate.getDay() === 0) { // If it's Sunday
				// Subtract 2 days to schedule it on the previous Friday.
				newDate.setDate(newDate.getDate() - 2);
			} else if (newDate.getDay() === 6) { // If it's Saturday
				// Subtract 1 day to schedule it on the previous Friday.
				newDate.setDate(newDate.getDate() - 1);
			}
		}

	// console.log(newDate);
	return newDate; // Return the adjusted bid_start_time
}
export function calculateBiWeeklyBitStartTime(bid_start_time:Date, index:number) {
	// Calculate the number of days to add for biweekly scheduling
	const daysToAdd = (index - 1) * 14; // 14 days for biweekly (2 weeks)
  
	// Add the calculated days to the start date
	bid_start_time.setDate(bid_start_time.getDate() + daysToAdd);
  

	// Check if the calculated date is a weekend
	if (isWeekend(bid_start_time) === true) {
		if (bid_start_time.getDay() === 0) { // If it's Sunday
			// Subtract 2 days to schedule it on the previous Friday.
			bid_start_time.setDate(bid_start_time.getDate() - 2);
		} else if (bid_start_time.getDay() === 6) { // If it's Saturday
			// Subtract 1 day to schedule it on the previous Friday.
			bid_start_time.setDate(bid_start_time.getDate() - 1);
		}
	}
  
	return bid_start_time;
}
export function getPreviousWeekday(date:Date) {
	// Create a new Date object for the given epoch timestamp
	const currentDate = new Date(date);
  
	// Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
	const currentDayOfWeek = currentDate.getDay();
  
	// Check if the current day is a weekend (Saturday or Sunday)
	if (currentDayOfWeek === 0 || currentDayOfWeek === 6) {
	  // If it's a weekend, subtract the appropriate number of days to get the previous Friday (5)
	  const daysToSubtract = currentDayOfWeek === 0 ? 2 : 1;
	  currentDate.setDate(currentDate.getDate() - daysToSubtract);
	}
  
	// Return the date of the previous weekday (which may be the same date if it's not a weekend)
	const today = new Date(currentDate);
	const year = `${today.getFullYear() % 100}`.padStart(2, '0'); // Ensure 2 digits for year
	const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Ensure 2 digits for month
	const day = today.getDate().toString().padStart(2, '0'); // Ensure 2 digits for day
	const yymmdd = `${year}${month}${day}`;
	return yymmdd;
  }