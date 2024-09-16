(async () => {
	const TAG = 'profit_view';
    const LANG_NAME_MAP = {en_us:'英文', zh_tw:'繁體中文', zh_cn:'簡體中文'};
    type QueryParam = {};

	///****待修改****///
	type PagingCursor = Awaited<ReturnType<typeof window.ROSKA_FORM.Do_Register_User_Info>>;

	type QueryParamTask = { token:string; state?:string; order?:{[key:string]:string;}; };
	const COTINUE_SID:{ query:QueryParamTask; cursor:PaginateCursor<any>|null;} = {query:{token:''}, cursor:null};
	const queryData:{ order:string; page:number; page_size:number } = {	order: "DESC",	page: 1,	page_size: 100	};
	///****待修改****///
	var count = 1;

	const STATE:{
		query:QueryParam;
		cursor:PagingCursor|null;
	} = {
		query:{},
		cursor:null
	};

	const modules = window.modules;
	const viewport = window.viewport;	
	const view = viewport.profit_view;
	const loading_overlay = window.loading_overlay;
	modules.push({
		init: async function(){
			const [{element: layout}] = await window.resources([
				{ type: 'html', path: './module/profit_view/module.html'},
				{ type: 'css', path: './module/profit_view/module.css' }
			]);

			view.element.innerHTML = layout.innerHTML;
			view.relink();
			layout.remove();


			{
				let timeout:any = null;
				// const accessor =  viewport.viewport_container;
				const accessor =  view.expected_profit_list;
				accessor
				.on('scroll', (e:any) => {
					// console.log("scrollXX");
					if (!timeout) {
						timeout = setTimeout(() => {
							timeout = null;
							accessor.emit('mouse-scroll');
						}, 100);
					}
				})
				.on('mouse-scroll', (e:any) => {         
					const target = e.target;
					const current_pos = target.scrollTop + target.clientHeight;
					const trigger_line = target.scrollHeight - 25;
					const cursor = COTINUE_SID.cursor;
					queryData.page = 1;
					// console.log(cursor);
		
					if ( current_pos >= trigger_line && cursor !== null ) {
						const { page, page_size } = (cursor) as { page?:number ,page_size?: number };
						if (page !== undefined) {
						queryData.page = page + 1;
						}
						queryData.page_size = page_size?page_size:100;
						// console.log(page);
						// console.log(queryData);
						list_new_group_serial(queryData);
					}
				})
			}

		}
	});

	view
	.on('view-state', (e:any) => {
		if (e.state !== "show")
			return;
		// loading_overlay.Show();
		ResetPage();
		list_new_group_serial(queryData);


		// list_new_group_serial()
		// 	.catch((e) => {
		// 	console.error(e);
		// 	// alert(`載入失敗！(${e.message})`);
		// 	window.HandleUnauthorizedAccess(e);
		// 	})
		// 	.finally(() => {
		// 	loading_overlay.Hide();
		// 	});
	})
	async function list_new_group_serial(queryData?:any) {

		try {
			loading_overlay.Show();
			console.log(queryData);
			const sysvar = await ROSKA_FORM.Get_sysvar();
			const {handling_fee ,interest_bonus,transition_fee,members_range}= sysvar;
			console.log(sysvar);
			console.log(handling_fee ,interest_bonus,transition_fee,members_range);
			var income, expenditure, next_duration = 0;

			const list_data = await ROSKA_FORM.Admin_get_on_list(queryData);
			COTINUE_SID.cursor = list_data.meta;
			// const { region_list: list, total_records,tmpl_item  } = view.member_list_container;
			// console.log(list_data);
			const region_list = view.expected_profit_list.list_container.region_list;
			const tmpl_item = view.expected_profit_list.list_container.tmpl_item;


			const { total_records } = view.expected_profit_list.list_container;	
			total_records.textContent =list_data.meta.total_records;	
			// if( COTINUE_SID.cursor && COTINUE_SID.cursor.total_records !== undefined)
			// {total_records.textContent = COTINUE_SID.cursor.total_records};	
		
			const records = list_data.records;
			// console.log(records);
			for(const record of records) {
				// console.log(record);


				// const create_time = dayjs.unix(record.create_time);
				const elm = tmpl_item.duplicate();
				// elm.create_time.textContent = record.bid_start_time.slice(0 , 10);

				// elm.last_duration.textContent = record.prev_gid.gid.slice(0, 6)+"-"+record.prev_gid.gid.slice(-3,-2).toUpperCase()+record.prev_gid.gid.slice(-2);
				elm.next_duration.textContent = record.next_gid.gid.slice(-2);
				next_duration= Number( record.next_gid.gid.slice(-2));
				ROSKA_FORM.Tools.TestData.ContinueGroup_data.push(record.prev_gid);
				

				// income = (next_duration * 5000) +((Number(members_range[1])-next_duration-1)*4000);
				income =((Number(members_range[1])-next_duration-1)*4000);
				
				if(next_duration<20)
					{ expenditure = (next_duration * (5000-Number(handling_fee))) + interest_bonus - transition_fee }
				else{ 
					expenditure = (next_duration * (5000-Number(handling_fee)))  - (Number(members_range[1]) - next_duration - 1)* (5000-4000)
				};
				
				
				elm.expenditure.textContent = expenditure;
				elm.income.textContent = income;

				elm.expected_profit.textContent = income - expenditure;

				elm.count.textContent = ROSKA_FORM.Tools.pad_zero(count ,3);
				count += 1;
				elm.sid.textContent= record.sid;


				region_list.appendChild(elm.element);
			}
			console.log(ROSKA_FORM.Tools.TestData.ContinueGroup_data);
		}
		catch(e:any) {
			console.error(e);
			alert(`載入失敗！無法取得進行中會組列表！(${e.message})`);
			window.HandleUnauthorizedAccess(e);
		}
		finally{
			loading_overlay.Hide();
		}
	}



	(()=>{




	})();


	function ResetPage(){
		STATE.cursor = null;
		STATE.query = {};

		{
			const accessor = view.expected_profit_list.list_container.region_list;
            accessor.innerHTML = '';
		}
		//renew init ifo
		count = 1;
		// queryData.page = 1;
		COTINUE_SID.cursor = null;

		// {
		// 	const accessor = view.region_info;
		// 	accessor.element.addClass('hide');
		// }
	}


	
})();
