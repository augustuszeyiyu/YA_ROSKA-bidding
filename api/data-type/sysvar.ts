// REGION: [ Copy from hunt.node.api project ]
export interface DBSysvar {
	id:PostgresTypes.BigInt;
	key:DBSysvarSpecialRatio['key']|DBSysvarFuelRatioRatio['key'];
	value:DBSysvarSpecialRatio['value']|DBSysvarFuelRatioRatio['value'];
};


export const CompoundNumberVarMap = {
	LEVEL_9_RATIO:  'level_9_ratio',
	LEVEL_10_RATIO: 'level_10_ratio',
	
	FUEL_RATIO_LV0: 'fuel_ratio_lv0',
	FUEL_RATIO_LV1: 'fuel_ratio_lv1',
	FUEL_RATIO_LV2: 'fuel_ratio_lv2',
	FUEL_RATIO_LV3: 'fuel_ratio_lv3',
	FUEL_RATIO_LV4: 'fuel_ratio_lv4'
} as const;
export type SysvarSpecialShareRatioTypes = ObjectValues<typeof CompoundNumberVarMap>;

export interface DBSysvarSpecialRatio extends DBSysvar {
	key: SysvarSpecialShareRatioTypes;
	value: [int, int];
};
export type SysvarSpecialRatio = {
	[key in SysvarSpecialShareRatioTypes]: DBSysvarSpecialRatio['value'];
};

type __SysvarSpecialShareRatioLevels = {
	9: SysvarSpecialShareRatioTypes,
	10: SysvarSpecialShareRatioTypes,
};
export type SysvarSpecialShareRatioLevel = ObjectValues<__SysvarSpecialShareRatioLevels>;
export const SysvarSpecialShareRatioLevelMap:__SysvarSpecialShareRatioLevels = {
	9: CompoundNumberVarMap.LEVEL_9_RATIO,
	10: CompoundNumberVarMap.LEVEL_10_RATIO
};

export interface SysVar  {
	id: number,
	key: string,
	value: number[]|object|string
}

export const NumericVarMap = {
	FUEL_TAKER_RATIO:	'fuel_taker_ratio',

	TRANSFER_FEE_LV0: 'tfr_fee_lv0',
	TRANSFER_FEE_LV1: 'tfr_fee_lv1',
	TRANSFER_FEE_LV2: 'tfr_fee_lv2',
	TRANSFER_FEE_LV3: 'tfr_fee_lv3',
	TRANSFER_FEE_LV4: 'tfr_fee_lv4'
} as const;
export type SysvarFuelRatioTypes = ObjectValues<typeof NumericVarMap>;

export interface DBSysvarFuelRatioRatio extends DBSysvar {
	key: SysvarFuelRatioTypes,
	value: number;
};
// ENDREGION