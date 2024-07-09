(()=>{
	// REGION: [ Element accessor intialization ]
	const head_accessor = WhelmJS(document.head);
	const main_accessor = WhelmJS(document.body);
	const viewport = main_accessor.viewport;
	const modal_view = main_accessor.modal_view;
	const wheel_js  = main_accessor.wheel_js
	// const modals = main_accessor.modals;

	window.head 	= head_accessor;
	window.viewport = viewport;
	window.modal_view = modal_view;
	window.login_overlay = main_accessor.login_overlay;
	window.loading_overlay = new ROSKA_FORM.PageController({viewport: main_accessor.loading_overlay});
	window.wheel_js = wheel_js;
	// ENDREGION



	// REGION: [ Prepare page change events ]
	viewport
	.on('change-page', (e:any)=>{
		// console.log('check 01');
		const tabbar 		= e.original.target;
		const target_page 	= tabbar.dataset.page;
		// ISSUE: Force to set category to avoid wrong page changes in the same page
		const target_category 	= tabbar.dataset.category;
		const tab_pages 	= document.querySelectorAll<HTMLElement>('.tabbars [data-page]');

		for(const tab_page of tab_pages) {
			const page_id = tab_page.dataset.page;
			const category = tab_page.dataset.category;
			if(!page_id) continue;

			const elm_page = viewport[page_id].element;
			if ( page_id !== target_page) {
				elm_page.emit('view-state', {state:'hide'});
				elm_page.classList.add('hide');
				tab_page.classList.remove('active');
				continue;
			}
			else
			if ( category !== target_category ) {
				tab_page.classList.remove('active');
				continue;
			}

			elm_page.emit('view-state', {state:'show', category});
			elm_page.classList.remove('hide');
			tab_page.classList.add('active');
		}
	});
	// ENDREGION
})();
