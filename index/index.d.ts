export {};

// TODO: Define types
declare global {
	interface Window {
		head:any;
		viewport:any;
		login_overlay:any;
		loading_overlay:any;

		modules:{
			init:()=>Promise<void>
		}[];


		WEBSITE_URL:string;

		WaitAuthorization: ()=>Promise<void>;
		HandleUnauthorizedAccess: (error:any)=>void;
	}
}
