import SessionControl from "./api/session.js";
import {PageController} from "./lib/page-controller.js";
import {ErrorMap} from "./api/error-map/error-map.js";
import * as Tools from "./lib/tools.js";

// import * as DataTypeTrading from "./api/data-type/trading.js";
// import * as DataTypeUserShareRatios from "./api/data-type/user-share-ratios.js";
import * as DataTypeSysvar from "./api/data-type/sysvar.js";
// import * as DataTypeTransaction from "./api/data-type/transaction.js";
// import * as DataTypeMaintenance from "./api/data-type/maintenance.js";
// import * as DataTypeSerial from "./api/data-type/serial.js";
// import * as DataTypeRemit from "./api/data-type/remit.js";
import * as DataTypeRegister from "./api/data-type/register.js";
import * as DataTypeGroups from "./api/data-type/gropus.js";

import * as ApiSystem from "./api/system.js";
import * as ApiUser from "./api/user.js";
import * as ApiRegister from "./api/register.js";
import * as ApiGroups from "./api/groups.js";
// import * as ApiTransaction from "./api/transaction.js";
// import * as ApiMaintenance from "./api/maintenance.js";
// import * as ApiSerial from "./api/serial.js";
// import * as ApiRemit from "./api/remit.js";

type DataTypeRoska = never;

type BaseType = {
	Session: typeof SessionControl;
	Tools: typeof Tools;
	PageController: typeof PageController;
	ErrorMap: typeof ErrorMap;
	DataType: 
		typeof DataTypeRegister
    //     typeof DataTypeRoska
		// typeof DataTypeTrading 
		// & typeof DataTypeUserShareRatios 
		& typeof DataTypeSysvar 
		& typeof DataTypeGroups
		// & typeof DataTypeTransaction 
		// & typeof DataTypeMaintenance
		// & typeof DataTypeSerial
		// & typeof DataTypeRemit;
};
const Base:BaseType = {
	Session: SessionControl,
	Tools,
	PageController,
	ErrorMap,
	DataType: Object.assign(
		DataTypeRegister,
    	// DataTypeRoska
		// DataTypeTrading, 
		// DataTypeUserShareRatios, 
		DataTypeSysvar, 
		DataTypeGroups,
		// DataTypeTransaction, 
		// DataTypeMaintenance, 
		// DataTypeSerial,
		// DataTypeRemit,
	)
};
const Exported = Object.assign(
	Base,
	ApiRegister,
	ApiGroups,
	// ApiSystem,
	// ApiUser,
	// ApiTransaction,
	// ApiMaintenance,
	// ApiSerial,
	// ApiRemit
);






type ROSKA_FORM_Class = 
	typeof Base
	& typeof ApiRegister
	& typeof ApiGroups
	// & typeof ApiSystem 
	// & typeof ApiUser 
	// & typeof ApiTransaction 
	// & typeof ApiMaintenance
	// & typeof ApiSerial
	// & typeof ApiRemit
;

declare global { var ROSKA_FORM:ROSKA_FORM_Class; }
export default Exported;
