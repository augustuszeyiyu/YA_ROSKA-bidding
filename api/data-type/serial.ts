// NOTE: Put the content of invite-batch.ts and invite-master.ts file together.



// REGION: [ Copy from hunt.node.api project ]
// NOTE: Modify the uid type for isolation
export interface InviteBatch {
	id:uniqid;
	note:string;
	type:string;
	amount:number;
	valid_count:number;
	revoked_time:epoch;
	update_time:epoch;
	create_time:epoch;
};

export interface InviteCode {
	id: uniqid;
	batch: InviteBatch['id'];
	code: string;
	uid: uniqid, // uid: User['id'],
	gain_fuel: string;
	gain_duration:number;
	gain_expired_duration:number;
	revoked_time: epoch;
	register_time: epoch;
	create_time: epoch;
};
// ENDREGION



// REGION: [ Copy from hunt.node.api project ]
// NOTE: Modify the uid type for isolation
export interface InviteMasterCode {
	id: uniqid;	
	uid: uniqid; // uid: User['id'];
	email: string;
	batch: uniqid; // TODO: Ask if need a InviteMasterBatch['id']; table ?
	code: string;
	duration: int;
	revoked_time: epoch;
	register_time: epoch;
	create_time: epoch;
};
// ENDREGION



type __SerialInfoTypes = { FUEL:'fuel', MASTER: 'master', MEMBERSHIP: 'membership' };
export type SerialInfoTypes = ObjectValues<__SerialInfoTypes>;
export const SerialInfoTypeMap:__SerialInfoTypes = Object.freeze({ FUEL:'fuel', MASTER: 'master', MEMBERSHIP: 'membership' });
export const SerialInfoTypeMapList:SerialInfoTypes[] = Object.values(SerialInfoTypeMap);
