export enum ErrorCode {
	UNKOWN_ERROR					= 'base#unkown-error',
	RESOURCE_NOT_FOUND				= 'base#resource-not-found',						// 404
	UNAUTHORIZED					= 'base#unauthorized-access',						// 401
	FORBIDDEN_ACCESS				= 'base#unauthorized-access',						// 403
	INVALID_REQUEST_MIME			= 'base#invalid-request-mime',
	INVALID_REQUEST_PAYLOAD			= 'base#invalid-request-payload',					// 400
	INVALID_REQUEST_QUERY			= 'base#invalid-request-query',						// 400
	UNEXPECTED_MISSING_DATA			= 'base#unexpected-missing-data',
	UNEXPECTED_DB_INSERTION_FAILURE = 'base#unexpected-db-insertion-failure',			// 500
	UNEXPECTED_DB_UPDATE_FAILURE	= 'base#unexpected-db-update-failure',				// 500
	UNEXPECTED_DB_DELETE_FAILURE	= 'base#unexpected-db-delete-failure',				// 500
	INSUFFICIENT_BALANCE			= 'base#insufficient-balance',

	USER_REG_LIMIT_HAS_REACHED		= 'register#user-registration-limit-has-reached',

	PURCHASE_WITH_INVALID_INVITE_CODE = 'purchase#purchase-with-invalid-invite-code',
	PURCHASE_WITH_INVALID_PRODUCT_ID  = 'purchase#purchase-with-invalid-product-id',

	DUPLICATED_USER_NAME = 'profile#user-name-is-duplicated',



	// Trading related errors
	NONE_EMPTY_POSITION = 'trading#none-empty-position',
	UNSUPPORTED_SYMBOL = 'trading#unsupported-symbol',
	ALLOW_FOLLOW_IS_ON = 'trading#allow-follow-is-on',
	FOLLOWING_IS_ON = 'trading#following-is-on',
	CUSTOM_IS_ON = 'trading#custom-is-on',
	CUSTOM_IS_OFF = 'trading#custom-is-off',
	NO_TAKER_SELECTED = 'trading#no-taker-selected',
	SELF_FOLLOWING_IS_NOT_PERMITTED = 'trading#self-following-is-not-permitted',
	TARGET_USER_DOES_NOT_ALLOW_BEING_FOLLOWED = 'trading#target-user-does-not-allow-being-followed',




	RPC_CALL_NOT_FOUND = 'rpc#call-not-found',
	RPC_CALL_EXEC_ERROR = 'rpc#call-exec-error',
	RPC_INVALID_CALL_ARGS = 'rpc#incalid-call-args'
};