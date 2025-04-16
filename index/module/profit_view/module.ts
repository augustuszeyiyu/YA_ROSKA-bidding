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
	var count = 1, total_expected_profit = 0 ,this_total_expected_profit = 0;

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
				let isLoading = false;
				// const accessor =  viewport.viewport_container;
				const accessor =  view.expected_profit_list;
				accessor
				.on('scroll', (e:any) => {
					// console.log("scrollXX");
					if (!timeout) {
						timeout = setTimeout(() => {
							timeout = null;
							accessor.emit('mouse-scroll');
						}, 1000);
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
						isLoading = true;
						list_new_group_serial(queryData).finally(() => {
						isLoading = false;
						});
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

			const sysvar = await ROSKA_FORM.Get_sysvar();
			const {handling_fee ,interest_bonus,transition_fee,members_range}= sysvar;
			// console.log(sysvar);
			// console.log(handling_fee ,interest_bonus,transition_fee,members_range);
			var income, expenditure, next_duration ,this_income, this_expenditure, this_duration= 0;

			const list_data = await ROSKA_FORM.Admin_get_on_list(queryData);
			COTINUE_SID.cursor = list_data.meta;
			// const { region_list: list, total_records,tmpl_item  } = view.member_list_container;
			const region_list = view.expected_profit_list.list_container.region_list;
			const tmpl_item = view.expected_profit_list.list_container.tmpl_item;
			const { total_records ,this_total_records} = view.expected_profit_list.list_container;	
			
			// if( COTINUE_SID.cursor && COTINUE_SID.cursor.total_records !== undefined)
			// {total_records.textContent = COTINUE_SID.cursor.total_records};	
		
			const records = list_data.records;
			for(const record of records) {
				// const create_time = dayjs.unix(record.create_time);
				const elm = tmpl_item.duplicate();
				// elm.create_time.textContent = record.bid_start_time.slice(0 , 10);

				// elm.last_duration.textContent = record.prev_gid.gid.slice(0, 6)+"-"+record.prev_gid.gid.slice(-3,-2).toUpperCase()+record.prev_gid.gid.slice(-2);
				if(!record.next_gid){ 
					next_duration = 25; 
					this_duration = 24;
					elm.next_duration.textContent = "00"
				}
				else{ 
					elm.next_duration.textContent = record.next_gid.gid.slice(-2)||0;
					
					next_duration = Number( record.next_gid.gid.slice(-2));
					this_duration = ((Number(record.next_gid.gid.slice(-2)))-1);

				}

				income = claclate_income(next_duration);				
				expenditure = claclate_expenditure(next_duration);
				total_expected_profit += (income - expenditure);	
								
				elm.expenditure.textContent = expenditure;
				elm.income.textContent = income;
				
				elm.expected_profit.textContent = income - expenditure;
					

				this_income = claclate_income((next_duration-1)>0?(next_duration-1):0);
				console.log(next_duration,this_income);
				this_expenditure = claclate_expenditure((next_duration-1)>0?(next_duration-1):0)	
				this_total_expected_profit += (this_income-this_expenditure);

				elm.this_duration.textContent = ROSKA_FORM.Tools.pad_zero(this_duration,2);
				elm.this_income.textContent = this_income;
				elm.this_expenditure.textContent = this_expenditure;
					
				elm.this_expected_profit.textContent = this_income-this_expenditure;


				ROSKA_FORM.Tools.StoreData.ContinueGroup_data.push(record.prev_gid);
				
				elm.count.textContent = ROSKA_FORM.Tools.pad_zero(count ,3);
				count += 1;
				elm.sid.textContent= record.sid;

				// 保留功能				
				// elm.next_2th.textContent = expenditure = claclate_income(next_duration+1)-claclate_expenditure(next_duration+1);
				// elm.next_3th.textContent = expenditure = claclate_income(next_duration+2)-claclate_expenditure(next_duration+2);
				// elm.next_4th.textContent = expenditure = claclate_income(next_duration+3)-claclate_expenditure(next_duration+3);
				// elm.next_5th.textContent = expenditure = claclate_income(next_duration+4)-claclate_expenditure(next_duration+4);
				// elm.next_6th.textContent = expenditure = claclate_income(next_duration+5)-claclate_expenditure(next_duration+5);

				region_list.appendChild(elm.element);
			}

			total_records.textContent = "下期預期損益 : "+ total_expected_profit;	
			this_total_records.textContent = "本期預期損益 : "+ this_total_expected_profit;
			// console.log(ROSKA_FORM.Tools.TestData.ContinueGroup_data);


			function claclate_income(duration:number){
				if(duration==0){
					income = 0;
					return income;
				}
				else if(duration<25){ 
					income = ((Number(members_range[1])-duration-1)*4000)
					return income;
				}
				else{
					income = 0;
					return income;
				}
			}
			function claclate_expenditure(duration:number){
				if (duration==0){
					expenditure = (24 * (5000-Number(handling_fee)))  - (Number(members_range[1]) - 24 -1)* (5000-4000);
					// expenditure =0
					return expenditure;
				}
				if(duration<20){ 
					expenditure = (duration * (5000-Number(handling_fee))) + interest_bonus - transition_fee 
					return expenditure;
				}
				else if(duration<25){ 
					expenditure = (duration * (5000-Number(handling_fee)))  - (Number(members_range[1]) - duration - 1)* (5000-4000)
					return expenditure;
				}
				else{
					expenditure= 0;
					return expenditure;
				}
			}
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
		count = 1, total_expected_profit = 0;
		// queryData.page = 1;
		COTINUE_SID.cursor = null;

		// {
		// 	const accessor = view.region_info;
		// 	accessor.element.addClass('hide');
		// }
	}


	
})();
