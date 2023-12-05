(async () => {
	const TAG = 'roska_new_view';
    const LANG_NAME_MAP = {en_us:'英文', zh_tw:'繁體中文', zh_cn:'簡體中文'};
    type QueryParam = {};

	///****待修改****///
	type PagingCursor = Awaited<ReturnType<typeof window.ROSKA_FORM.Do_Register_User_Info>>;
	///****待修改****///

	const STATE:{
		query:QueryParam;
		cursor:PagingCursor|null;
	} = {
		query:{},
		cursor:null
	};

	const modules = window.modules;
	const viewport = window.viewport;	
	const view = viewport.roska_new_view;
	const loading_overlay = window.loading_overlay;
	modules.push({
		init: async function(){
			const [{element: layout}] = await window.resources([
				{ type: 'html', path: './module/roska_new_view/module.html'},
				{ type: 'css', path: './module/roska_new_view/module.css' }
			]);

			view.element.innerHTML = layout.innerHTML;
			view.relink();
			layout.remove();
		}
	});

	(()=>{
		// const view = viewport.roska_new_view;
		console.log(view.element.innerHTML);
		view
		.on('view-state', (e:any) => {
		if (e.state !== "show")
			return;
		loading_overlay.Show();
		init_new_group_serial_info()
			.catch((e) => {
			console.error(e);
			alert(`載入失敗！無法取得系統設定值！(${e.message})`);
			window.HandleUnauthorizedAccess(e);
			})
			.finally(() => {
			loading_overlay.Hide();
			});
		list_new_group_serial()
			.catch((e) => {
			console.error(e);
			alert(`載入失敗！無法取得系統設定值！(${e.message})`);
			window.HandleUnauthorizedAccess(e);
			})
			.finally(() => {
			loading_overlay.Hide();
			});
		ResetPage();


		});

		async function init_new_group_serial_info() {
			const accessor = view.new_group_serial;
			const test_data = Object.entries({
				"member_count": 25,
				"basic_unit_amount": 5000,
				"min_bid_amount": 200,
				"max_bid_amount": 1000,
				"bid_unit_spacing": 200,
				"bid_start_time": "2023-11-15",
				"frequency": "monthly",
				"service_fee": 300,
			});
			for (var [key, value] of test_data) {
				accessor[key].edit.value = value;
			}
			accessor.relink();
		}
		
		async function list_new_group_serial() {
			const accessor = view.new_group_serial;
		}

		async function get_new_list(query:QueryParam, paging?:any) {
			
		} 



	})();


	function ResetPage(){
		STATE.cursor = null;
		STATE.query = {};

		// {
		// 	const accessor = view;
		// 	accessor.region_list.innerHTML = '';
		// }

		// {
		// 	const accessor = view.region_info;
		// 	accessor.element.addClass('hide');
		// }
	}


	
})();
