// REGION: [ Copy from hunt.node.api project ]
type __MaintenanceInfoTypes = { INFO:'info', MAINTAIN: 'maintain' };
export type MaintenanceInfoTypes = ObjectValues<__MaintenanceInfoTypes>;
export const MaintenanceInfoTypeMap:__MaintenanceInfoTypes = Object.freeze({ INFO:'info', MAINTAIN: 'maintain' });
export const MaintenanceInfoTypeMapList:MaintenanceInfoTypes[] = Object.values(MaintenanceInfoTypeMap);

type __MaintenanceLocaleTypes = { EN_US:'en_us', ZH_CN: 'zh_cn', ZH_TW:"zh_tw" };
export type MaintenanceLocaleTypes = ObjectValues<__MaintenanceLocaleTypes>;
export const MaintenanceLocaleTypeMap:__MaintenanceLocaleTypes = Object.freeze({ EN_US:'en_us', ZH_CN: 'zh_cn', ZH_TW:"zh_tw" });
export const MaintenanceLocaleTypeMapList:MaintenanceLocaleTypes[] = Object.values(MaintenanceLocaleTypeMap);



export interface MaintenanceInfo {
	id: uniqid;
	type: MaintenanceInfoTypes;
	title: {[key in MaintenanceLocaleTypes]:string};
	content: {[key in MaintenanceLocaleTypes]:string};
	display_time: epoch;
	start_time: epoch;
	end_time: epoch;
	create_time: epoch;
};
// ENDREGION