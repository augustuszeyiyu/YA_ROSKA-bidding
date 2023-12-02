type ResourcesParam = string | {
	path:string;
	type?:'css'|'module'|'js'|'html'|'img';
	important?:boolean;
	// TODO: Define type for shadow and reference
};
type ResourcesResponse = {
	element:HTMLElement;
	id:string;
	loaded:boolean;
	result:string;
};

declare function resources(param:ResourcesParam):Promise<ResourcesResponse[]>;
declare function resources(params:ResourcesParam[]):Promise<ResourcesResponse[]>;
declare function resources(...args:ResourcesParam[]):Promise<ResourcesResponse[]>;

declare function restest(arg1:number,arg2:number):Promise<number>;
