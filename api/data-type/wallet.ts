type __MasterWalletStateTypes = { ETH: 'eth', TRX:'trx' };
export type MasterWalletStateTypes = ObjectValues<__MasterWalletStateTypes>;
export const MasterWalletStateTypeMap:__MasterWalletStateTypes = Object.freeze({ ETH:'eth', TRX: 'trx' });
export const MasterWalletStateTypeList:MasterWalletStateTypes[] = Object.values(MasterWalletStateTypeMap);
export type MasterWalletState = {
	main:num_str;
	usdt:num_str;
};
export type MasterWalletStates = {
	[key in MasterWalletStateTypes]: MasterWalletState;
};
