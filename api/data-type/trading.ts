// REGION: [ Copy from hunt.node.api project ]
export const HTExAPIVendor = Object.freeze({
	BINANCE:'binance',
	BITGET: 'bitget',
	BINGX:  'bingx',
	BYBIT:  'bybit',
    OKX:    'okx',
} as const);
export type HTExAPIVendors = typeof HTExAPIVendor[keyof typeof HTExAPIVendor];
export const HTExAPIVendorList = Object.freeze(Object.values(HTExAPIVendor) as HTExAPIVendors[]);
export type HTExAPIVendorExceptBinance = ''|Exclude<HTExAPIVendors, 'binance'>;
export type HTExAPIVendorPrefix<T extends string> = T extends '' ? '' : `${T}_`;



export const HTExecMode = Object.freeze({
	FOLLOWER: 'follower',
	TAKER: 'taker',
	TAKER_SIMPLE: 'taker-simple',
	TAKER_SIGNAL: 'taker-signal',
	TAKER_RULED: 'taker-ruled',
} as const);
export type HTExecModes = typeof HTExecMode[keyof typeof HTExecMode];



export const HTSymbol = Object.freeze({
	BTCUSDT:  'BTCUSDT',
	ETHUSDT:  'ETHUSDT',
	XRPUSDT:  'XRPUSDT',
	DOGEUSDT: 'DOGEUSDT',
    ADAUSDT:  'ADAUSDT',
	AVAXUSDT: 'AVAXUSDT',
	LTCUSDT:  'LTCUSDT',
	MATICUSDT:'MATICUSDT',
	THETAUSDT:'THETAUSDT',
} as const);
export type HTSymbols = typeof HTSymbol[keyof typeof HTSymbol];
export const HTSymbolList = Object.freeze(Object.values(HTSymbol) as HTSymbols[]);



export const HTMarket = Object.freeze({
	FUTURE:'future', 
	SPOT:'spot'
} as const);
export type HTMarkets = typeof HTMarket[keyof typeof HTMarket];
export const HTMarketList = Object.freeze(Object.values(HTMarket) as HTMarkets[]);



type __TradingMarketCates = {FUTURE:"future", SPOT:"spot"};
export type TradingMarketCates = ObjectValues<__TradingMarketCates>;
export const TradingMarketCateMap:__TradingMarketCates = Object.freeze({FUTURE:"future", SPOT:"spot"});



type __TradingSymbols = {BTCUSDT:"BTCUSDT", ETHUSDT:"ETHUSDT"};
export type TradingSymbols = ObjectValues<__TradingSymbols>;
export const TradingSymbolMap:__TradingSymbols = Object.freeze({BTCUSDT:"BTCUSDT", ETHUSDT:"ETHUSDT"});



type __PositionTypes = {NONE:'none', BUY:'buy', SELL:'sell'};
export type PositionTypes = ObjectValues<__PositionTypes>;
export const PositionTypeMap:__PositionTypes = Object.freeze({NONE:'none', BUY:'buy', SELL:'sell'});



type __PositionGroups = {BOTH:'both', LONG:'long', SHORT:'short'};
export type PositionGroups = ObjectValues<__PositionGroups>;
export const PositionGroupMap:__PositionGroups = Object.freeze({BOTH:'both', LONG:'long', SHORT:'short'});



type __OrderTypes = {STOPLOSS:'stoploss'};
export type OrderTypes = ObjectValues<__OrderTypes>;
export const OrderTypeMap:__OrderTypes = Object.freeze({STOPLOSS:'stoploss'});



type __TradingMarginModes = {CROSSED:'crossed', ISOLATED:'isolated'};
export type TradingMarginModes = ObjectValues<__TradingMarginModes>;
export const TradingMarginModeMap:__TradingMarginModes = {CROSSED:'crossed', ISOLATED:'isolated'};



type __TradingFloatingGainRefSides = {OPEN:'open', CLOSE:'close', MARKPRICE:'markprice'};
export type TradingFloatingGainRefSides = ObjectValues<__TradingFloatingGainRefSides>;
export const TradingFloatingGainRefSideMap:__TradingFloatingGainRefSides = {OPEN:'open', CLOSE:'close', MARKPRICE:'markprice'};



type __TradingOpenSides = {BUY:'buy', SELL:'sell', AUTO:'auto'};
export type TradingOpenSides = ObjectValues<__TradingOpenSides>;
export const TradingOpenSideMap:__TradingOpenSides = {BUY:'buy', SELL:'sell', AUTO:'auto'};



type __TradingTrendDetectionModes = {BASIC:'basic', INTERVAL_BOUNDARY:'advanced', IMMEDIATE_COMPARE:'advanced-local', ADVANCED_HYBRID:"advanced-hybrid"};
export type TradingTrendDetectionModes = ObjectValues<__TradingTrendDetectionModes>;
export const TradingTrendDetectionModeMap = {BASIC:'basic', INTERVAL_BOUNDARY:'advanced', IMMEDIATE_COMPARE:'advanced-local', ADVANCED_HYBRID:"advanced-hybrid"};






type __TraderGroups = {CUSTOM:"custom", FOLLOWING:"following"};
export type TraderGroups = ObjectValues<__TraderGroups>;
export const TraderGroupMap:__TraderGroups = { CUSTOM:"custom", FOLLOWING:"following" };



type __TradingHistoryTypes = {
    OPEN:       'trading#open',
    CLOSE:      'trading#close',
    POS_ERROR:  'trading#position-error'
};
export type TradingHistoryTypes = ObjectValues<__TradingHistoryTypes>;
export const TradingHistoryTypeMap:__TradingHistoryTypes = Object.freeze({
    OPEN:       'trading#open',
    CLOSE:      'trading#close',
    POS_ERROR:  'trading#position-error'
});





interface HistoryRecord {
    id: uniqid;
    uid: uniqid;
    type: `${string}#${string}`;
    create_time:num_str; // epoch time in milliseconds
};

export interface DBTradingOpenHistory extends HistoryRecord {
    type: ObjectValues<Pick<__TradingHistoryTypes, 'OPEN'>>;
    cate: TradingMarketCates;
    group: TraderGroups;
    symbol: TradingSymbols;
    amount: num_str;
    price: num_str;
    leverage: uint;
};

export interface DBTradingCloseHistory extends HistoryRecord {
    type: ObjectValues<Pick<__TradingHistoryTypes, 'CLOSE'>>;
    cate: TradingMarketCates;
    group: TraderGroups;
    symbol: TradingSymbols;
    amount: num_str;
    price: num_str;
    earn: num_str;
    fuel: num_str;
};

export interface DBTraderErrorHistory extends HistoryRecord {
    type: ObjectValues<Pick<__TradingHistoryTypes, 'POS_ERROR'>>;
    cate: TradingMarketCates;
    group: TraderGroups;
    symbol: TradingSymbols;
    error_code: string;
    error_detail: AnyObject;
};
// ENDREGION



export const UserMasterStatisticInterval = Object.freeze({
	'24H': '24h',
	'7D': '7d',
	'30D': '30d',
	'90D': '90d'
} as const);
export type UserMasterStatisticIntervals = typeof UserMasterStatisticInterval[keyof typeof UserMasterStatisticInterval];
export const UserMasterStatisticIntervalList = Object.freeze(Object.values(UserMasterStatisticInterval) as UserMasterStatisticIntervals[]);