(async () => {
	const TAG = 'roska_end_view';
    const LANG_NAME_MAP = {en_us:'英文', zh_tw:'繁體中文', zh_cn:'簡體中文'};
    type QueryParam = {};

	///****待修改****///
	type PagingCursor = Awaited<ReturnType<typeof window.ROSKA_FORM.Do_Register_User_Info>>;
	type QueryParamTask = { token:string; state?:string; order?:{[key:string]:string;}; };
	const COTINUE_SID:{ query:QueryParamTask; cursor:PaginateCursor<any>|null;} = {query:{token:''}, cursor:null};
	const queryData:{ order?:string; page?:number; page_size?:number } = {page: 1,	page_size: 50	};

	var count = 1;

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
	const view = viewport.roska_end_view;
	const loading_overlay = window.loading_overlay;
	modules.push({
		init: async function(){
			const [{element: layout}] = await window.resources([
				{ type: 'html', path: './module/roska_end_view/module.html'},
				{ type: 'css', path: './module/roska_end_view/module.css' }
			]);

			view.element.innerHTML = layout.innerHTML;
			view.relink();
			layout.remove();
			{
				let timeout:any = null;
				// const accessor =  viewport.viewport_container;
				const accessor =  view.continue_list_container;
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
						queryData.page_size = page_size?page_size:50;
						console.log(page);
						console.log(queryData);
						list_past_group_serial(queryData);
					}
				})
			}


		}
	});
	
	// var selectAllCheckbox = document.getElementById('select-all') as HTMLInputElement;
	// console.log( selectAllCheckbox );
    // selectAllCheckbox.addEventListener('change', () => {
    //     const rowCheckboxes = document.querySelectorAll('.row-checkbox') as NodeListOf<HTMLInputElement>;
    //     rowCheckboxes.forEach(checkbox => {
    //         checkbox.checked = selectAllCheckbox.checked;
    //     });
    // });

	view
	.on('view-state', (e:any) => {
		if (e.state !== "show")
			return;

		ResetPage();

	})
	.on('click', async(e:any)=>{
		const trigger = e.target;
		const row = trigger.closest('.t-row');

		const bid_all= trigger.closest('.bid_all');


		const export_all= trigger.closest('.export_all');
        if (export_all) {
            console.log(export_all);
			try{
				let result_data = await ROSKA_FORM.export_all();
				// let result = await ROSKA_FORM.bid_group_serial(query_data).catch((e: Error) => e);
				console.log(result_data);
				alert(result_data);
				ResetPage();
			}
			catch (e: any) {
				alert(`輸出失敗(${e.message}`);
			}

        }

        const selectAllCheckbox= trigger.closest('#select-all');   
        if (selectAllCheckbox) {
            console.log(selectAllCheckbox);
            var rowCheckboxes = document.querySelectorAll('.row-checkbox') as NodeListOf<HTMLInputElement>;;
            rowCheckboxes.forEach(checkbox => {
            checkbox.checked = selectAllCheckbox.checked;
            });
        }

		if ( !row ) return;
		
		const button = trigger.closest('button');		
		if ( !button || !row ) return;		
		switch(button.dataset.role) {
			case "export": {
				
			}
			case "view_group": {
				// window.location.href = "/admin/member/info/" + row.dataset.relId;
				window.open("./"+'?'+ 'sid='+button.dataset.relSid +'&'+ "next_gid="+ button.dataset.next_gid  +'&'+'modal=group_view', 'innerHeight=800' ,'innerWidth=1600',);
				break;
				
			}
			
			default:
				alert("您沒有權限使用該功能！\\n請使用更高權限等級的帳號執行此操作！");
				return;
		}
	})

	async function list_past_group_serial(queryData?:any) {

		try {
			// loading_overlay.Show();
			console.log(queryData);
			const list_data = await ROSKA_FORM.Admin_get_past_list(queryData);

			console.log(list_data);
			COTINUE_SID.cursor = list_data.meta;
			// const { region_list: list, total_records,tmpl_item  } = view.member_list_container;
			// console.log(list_data);
			const region_list = view.continue_list_container.list_container.region_list;
			const tmpl_item = view.continue_list_container.list_container.tmpl_item;


			const { total_records } = view.continue_list_container.list_container;	
			total_records.textContent =list_data.meta.total_records;	
			// if( COTINUE_SID.cursor && COTINUE_SID.cursor.total_records !== undefined)
			// {total_records.textContent = COTINUE_SID.cursor.total_records};	
		
			const records = list_data.records;
			for(const record of records) {
				// console.log(record);
				const elm = tmpl_item.duplicate();
				elm.create_time.textContent = record.bid_start_time.slice(0 , 10);
				elm.last_duration.textContent = record.prev_gid.gid.slice(0, 6)+"-"+record.prev_gid.gid.slice(-3,-2).toUpperCase()+record.prev_gid.gid.slice(-2);
				elm.bid_member.textContent = record.prev_gid.mid;
				elm.bid_name.textContent = record.prev_gid.name;
				elm.win_amount.textContent  = record.prev_gid.win_amount;
				switch (record.prev_gid.transition){
					case 1:{
						elm.transition.textContent  = "轉讓";
						elm.management_fee.textContent  = (record.prev_gid.gid.slice(-2))*250;
						elm.transfer_fee.textContent  = 300;
						break;
					}
					case 0:{
						elm.transition.textContent  = "全收";
						elm.management_fee.textContent  = 6000;
						elm.transfer_fee.textContent  = 300;
						break;
					}
					case 2:{
						elm.transition.textContent  = "結清";
						elm.management_fee.textContent  = (record.prev_gid.gid.slice(-2))*250;
						elm.transfer_fee.textContent  = 300;
						break;
					}
					default:{
						elm.transition.textContent  = "請確認";
					}
				};

				elm.count.textContent = ROSKA_FORM.Tools.pad_zero(count ,3);
				count += 1;
				elm.sid.textContent= record.sid;

				const button_group_detail = document.createElement("button");
				button_group_detail.classList.add("btn-blue");
				button_group_detail.textContent = "檢視會組";
				button_group_detail.dataset.role = 'view_group';
				button_group_detail.dataset.relSid = record.sid;
				if(!record.next_gid){
					button_group_detail.dataset.next_gid=record.sid;
				}
				else{
					button_group_detail.dataset.next_gid=record.next_gid.gid;
				}
				elm.view_group.appendChild(button_group_detail);

				const button_export = document.createElement("button");
				button_export.classList.add("btn-orange");
				button_export.textContent = "輸出報表";
				button_export.dataset.role = 'export';
				button_export.dataset.relSid = record.sid;
				if(!record.next_gid){
					button_group_detail.dataset.next_gid=record.sid;
				}
				else{
					button_export.dataset.next_gid = record.next_gid.gid;
				}
				elm.export.appendChild(button_export);


				//
				region_list.appendChild(elm.element);
			}
		}
		catch(e:any) {
			console.error(e);
			alert(`載入失敗！無法取得進行中會組列表！(${e.message})`);
			window.HandleUnauthorizedAccess(e);
		}
		finally{
			// loading_overlay.Hide();
		}
	};

	// function ResetPage(param:{category?:string}={}){
	// 	const category = param.category? param.category: RUNTIME.network_type;

	// 	RUNTIME.network_type = category;

	// 	ResetCollectableListPage({token: RUNTIME.network_type});
	// 	ResetTaskListPage({token: RUNTIME.network_type});
	// }
	function ResetPage(){
		STATE.cursor = null;
		STATE.query = {};

		{
			
			// console.log(view.continue_list_container.list_container);
			const accessor = view.continue_list_container.list_container.region_list;
            accessor.innerHTML = '';
		}
		//renew init ifo
		count = 1;
		// queryData.page = 1;
		COTINUE_SID.cursor = null;
		list_past_group_serial(queryData);
	}	
})();
