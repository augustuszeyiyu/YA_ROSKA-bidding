(async () => {
	const TAG = 'roska_new_view';
    const LANG_NAME_MAP = {en_us:'英文', zh_tw:'繁體中文', zh_cn:'簡體中文'};
    type QueryParam = {};

	///****待修改****///
	type PagingCursor = Awaited<ReturnType<typeof window.ROSKA_FORM.Get_new_list>>;
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
		// console.log(view.element.innerHTML);
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
				// alert(`載入失敗！(${e.message})`);
				window.HandleUnauthorizedAccess(e);
				})
				.finally(() => {
				loading_overlay.Hide();
				});
			ResetPage();
		})
		.on('add_new', (e:any) => {
				add_new_group_serial();
		})

		async function init_new_group_serial_info() {
			const accessor = view.new_group_serial;
			const test_data = Object.entries({
				"member_count": 25,
				"basic_unit_amount": 5000,
				"min_bid_amount": 200,
				"max_bid_amount": 1000,
				"bid_unit_spacing": 200,
				"bid_start_time": "2024-01-15",
				"frequency": "monthly",
				"service_fee": 300,
			});
			for (var [key, value] of test_data) {
				accessor[key].edit.value = value;
			}
			accessor.relink();
		}
		
		async function list_new_group_serial() {


			const list_data = await ROSKA_FORM.Get_new_list();
			// const { region_list: list, total_records,tmpl_item  } = view.new_list;
			
			const region_list = view.new_list.region_list;
            const tmpl_item = view.new_list.tmpl_item;
			var count = 1;
			console.log(list_data);
			// const {records} = STATE.cursor;
			const records = list_data;
			for(const record of records) {
				// const create_time = dayjs.unix(record.create_time);
				const elm = tmpl_item.duplicate();
				// elm.element.dataset.id = record.id;
				// elm.id.textContent = record.id;
				// elm.email.textContent = record.email;
				// elm.create_time.textContent = create_t
				elm.create_time.textContent = record.create_time.slice(0 , 10)+" "+record.create_time.slice(11 , -5);;
				// elm.create_time.title = create_time.format("YYYY/MM/DD HH:mm:ss");
				// elm.level.textContent = record.level;
				// elm.exchange.textContent = record.exchange;
				// elm.symbol.textContent = record.symbol;

				elm.count.textContent = count;
                count += 1;
				elm.sid.textContent= record.sid;
				region_list.appendChild(elm.element);
			}
		}



		async function add_new_group_serial(){
			const accessor = view.new_group_serial;
			const new_group_serial_data: typeof ROSKA_FORM.add_new_group_serial.prototype = {
                "member_count": '',
                "basic_unit_amount": '',
                "min_bid_amount": '',
                "max_bid_amount": '',
                "bid_unit_spacing": '',
                "bid_start_time": '',
                "frequency": '',
                "service_fee": '',
			}
			for (var key in new_group_serial_data) {          
				if(accessor[key]){
					new_group_serial_data[key]=accessor[key].edit.value;
				}
			};
			console.log(new_group_serial_data);
			try{
				let result = await ROSKA_FORM.add_new_group_serial(new_group_serial_data);
			}catch (e: any) {
				alert(`新增失敗!(${e.message})`);
				console.error(`[${TAG}]`, e);
			}
		}

		// async function get_new_list(query:QueryParam, paging?:any) {
			
		// } 



	})();


	function ResetPage(){
		STATE.cursor = null;
		STATE.query = {};

		{
			const accessor = view;
			accessor.new_list.region_list.innerHTML = '';
		}

		// {
		// 	const accessor = view.region_info;
		// 	accessor.element.addClass('hide');
		// }
	}


	
})();
