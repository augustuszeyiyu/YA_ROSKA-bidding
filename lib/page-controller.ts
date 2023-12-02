type TypeParam = {
	viewport: HTMLElement,
	hide_class?:string,
}; 
export class PageController {
	private _viewport:HTMLElement;
	private _hide_class:string = 'hide';

	constructor(param:TypeParam){
		this._viewport = param.viewport;
		if(param.hide_class !== undefined) this._hide_class = param.hide_class;
	}

	Show(){ this._viewport.classList.remove(this._hide_class); }
	Hide(){ this._viewport.classList.add(this._hide_class); }
}
