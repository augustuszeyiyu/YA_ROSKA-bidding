(async () => {
	const TAG = 'roska_continue_view';
    const LANG_NAME_MAP = {en_us:'英文', zh_tw:'繁體中文', zh_cn:'簡體中文'};
    type QueryParam = {};



	///****待修改****///
	// type PagingCursor = Awaited<ReturnType<typeof window.ROSKA_FORM.Do_Register_User_Info>>;
	type PagingCursor = Awaited<ReturnType<typeof window.ROSKA_FORM.Admin_get_on_list>>;
	type QueryParamTask = { token:string; state?:string; order?:{[key:string]:string;}; };
	const COTINUE_SID:{ query:QueryParamTask; cursor:PaginateCursor<any>|null;} = {query:{token:''}, cursor:null};
	const queryData:{ order:string; page:number; page_size:number } = {	order: "DESC",	page: 1,	page_size: 100	};

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
	const view = viewport.roska_continue_view;
	const loading_overlay = window.loading_overlay;
	modules.push({
		init: async function(){
			const [{element: layout}] = await window.resources([
				{ type: 'html', path: './module/roska_continue_view/module.html'},
				{ type: 'css', path: './module/roska_continue_view/module.css' }
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
						queryData.page_size = page_size?page_size:100;
						console.log(page);
						console.log(queryData);
						list_new_group_serial(queryData);
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
	// .on('view-state', (e:any) => {
	// 	if (e.state !== "show")
	// 		return;
	// 	ResetPage();
	// })
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
	.on('click', async(e:any)=>{
		const trigger = e.target;
		const row = trigger.closest('.t-row');

		const bid_all= trigger.closest('.bid_all');
		if(bid_all){
			var bid_all_group = document.querySelectorAll('.row-checkbox') as NodeListOf<HTMLInputElement>;;
			bid_all_group.forEach(checkbox => {
				if(checkbox.checked){
					console.log(checkbox.dataset.next_gid);
					var query_data = { "gid" :checkbox.dataset.next_gid} ;
					console.log(query_data);
					try{
						console.log(checkbox.dataset.relSid );
						ROSKA_FORM.bid_group_serial(query_data);
						alert(checkbox.dataset.relSid+'已完成開標');					
					}
					catch (e: any) {
						alert(`開標失敗(${e.message}`);
					}
				};
			});
			ResetPage();
			return;
		}

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
            var rowCheckboxes = document.querySelectorAll('.row-checkbox') as NodeListOf<HTMLInputElement>;
            rowCheckboxes.forEach(checkbox => {
            checkbox.checked = selectAllCheckbox.checked;
            });
        }


		const export_groups_table_btn =  trigger.closest('export_group_table');
		const target_table = document.querySelector('.continue_table');
		// console.log(target_table);
		// console.log(ROSKA_FORM.Tools.TestData);
		// if(target_table){
		// 		const ExcelJS = window.ExcelJS;
		// 		const workbook = new ExcelJS.Workbook();
		// 		const worksheet = workbook.addWorksheet('報表');

		// 		// const table = document.getElementById('myTable');
		// 		const table = target_table;
		// 		const rows = table.querySelectorAll('div');

		// 		// 複製表格標題
		// 		rows[0].querySelectorAll('.t-row').forEach((div, index) => {
		// 			worksheet.getRow(1).getCell(index + 1).value = div.innerHTML;
		// 		});
		// 		// console.log(worksheet);

		// 		// 複製表格資料
		// 		for (let i = 1; i < rows.length; i++) {
		// 			const cells = rows[i].querySelectorAll('.t-row');
		// 			cells.forEach((div, index) => {
		// 				console.log(index);
		// 				worksheet.getRow(i + 1).getCell(index + 1).value = div.innerHTML;
		// 			});
		// 		}

		// 		// 將 Excel 文件轉換為 blob，並觸發下載
		// 		const buffer = await workbook.xlsx.writeBuffer();
		// 		const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
		// 		const url = URL.createObjectURL(blob);

		// 		const a = document.createElement('a');
		// 		a.href = url;
		// 		a.download = 'report.xlsx';
		// 		document.body.appendChild(a);
		// 		a.click();
		// 		document.body.removeChild(a);
		// }

		if ( !row ) return;
		
		
		// if ( trigger.closest('.member-state') !== null ) {
		//     const {id, enabled} = member_map[row.dataset.relId];
		//     await ToggleUserEnableState(id, !enabled);
		//     return;
		// }


		// const selectcheckbox= trigger.closest('input');	
        // if (selectcheckbox) {
			// console.log(selectcheckbox);
        // }
		
		const button = trigger.closest('button');		
		if ( !button || !row ) return;		
		switch(button.dataset.role) {
			// case APPLICATION_TYPE.UPGRADE_ADVANCED:
			// case APPLICATION_TYPE.UPGRADE_BUSINESS:
			// case APPLICATION_TYPE.BUY_ADVERT_POINT:
			// case APPLICATION_TYPE.WITHDRAW: {
			//     window.location.href = "/admin/member/approval/" + button.dataset.relId;
			//     break;
			// }
			
			// case APPLICATION_TYPE.PROFILE_VERIFICATION: {
			//     window.location.href = "/admin/member/info-approval/" + button.dataset.relId;
			//     break;
			// }
			// case APPLICATION_TYPE.PROFILE_VERIFICATION: {
			// 	window.open("/admin/member/info-approval/" + button.dataset.relId,innerHeight=500,innerWidth=500);
			// 	break;
			// }
			case "bid": {
				if(!button.dataset.next_gid){
					console.log('會組已完結');
					alert('會組已完結');
					break;	
				}
				var query_data = { "gid" :button.dataset.next_gid} ;			
				console.log(button.dataset.next_gid );
				console.log(query_data);
				try{
					console.log(button.dataset.relSid );
					await ROSKA_FORM.bid_group_serial(query_data);
					// let result = await ROSKA_FORM.bid_group_serial(query_data).catch((e: Error) => e);
					alert(button.dataset.relSid+'已完成開標');
					ResetPage();
				}
				catch (e: any) {
					alert(`開標失敗(${e.message}`);
				}

				break;
			}
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

	async function list_new_group_serial(queryData?:any) {

		try {
			loading_overlay.Show();
			console.log(queryData);
			const list_data = await ROSKA_FORM.Admin_get_on_list(queryData);
			COTINUE_SID.cursor = list_data.meta;
			// const { region_list: list, total_records,tmpl_item  } = view.member_list_container;
			// console.log(list_data);
			const region_list = view.continue_list_container.list_container.region_list;
			const tmpl_item = view.continue_list_container.list_container.tmpl_item;


			const records = list_data.records;
			console.log(records);
			for(const record of records) {
				console.log(record);


				// const create_time = dayjs.unix(record.create_time);
				const elm = tmpl_item.duplicate();
				elm.create_time.textContent = record.bid_start_time.slice(0 , 10);
				if(record.prev_gid){
					elm.last_duration.textContent = (record.prev_gid.gid.slice(0, 6)+"-"+record.prev_gid.gid.slice(-3,-2).toUpperCase()+record.prev_gid.gid.slice(-2));
					elm.bid_member.textContent = record.prev_gid.mid;
					elm.bid_name.textContent = record.prev_gid.name;
					elm.win_amount.textContent  = record.prev_gid.win_amount;
	
					

					ROSKA_FORM.Tools.StoreData.ContinueGroup_data.push(record.prev_gid);
				
					if (record.prev_gid.gid.slice(-2) == "00"){
						elm.management_fee.textContent  = 0;
						elm.transfer_fee.textContent  = 0;
						elm.transition.textContent  = "會首金";
					}
					else{
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
								elm.transfer_fee.textContent  = 0;
								break;
							}
							case 2:{
								elm.transition.textContent  = "結清";
								elm.management_fee.textContent  = (record.prev_gid.gid.slice(-2))*250;
								elm.transfer_fee.textContent  = 0;
								break;
							}
							default:{
								elm.transition.textContent  = "請確認";
							}
						}
					};

					
				}
				else{
					elm.last_duration.textContent = " ";
					elm.transition.textContent  = "新會組";
				}
				 
				

			



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

				const button_group_bid = document.createElement("button");
				button_group_bid.classList.add("btn-green");
				button_group_bid.textContent = "電腦開標";
				button_group_bid.dataset.role = 'bid';
				if(!record.next_gid){		
					button_group_detail.dataset.next_gid=record.sid;
				}
				else{
					button_group_bid.dataset.next_gid = record.next_gid.gid;
				}
				button_group_bid.dataset.relSid = record.sid;	
				elm.bid.appendChild(button_group_bid);

				const button_check_box = document.createElement("input");
				button_check_box.classList.add("row-checkbox");
				button_check_box.type = "checkbox";
				button_check_box.dataset.role = 'checkbox';
				if(!record.next_gid){
					button_group_detail.dataset.next_gid=record.sid;
				}
				else{
					button_check_box.dataset.next_gid = record.next_gid.gid;
				}
				button_check_box.dataset.relSid = record.sid;
				elm.check_box.appendChild(button_check_box);


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

				// const button_manual_bid = document.createElement("button");
				// button_manual_bid.classList.add("btn-orange");
				// button_manual_bid.textContent = "輸出報表";
				// button_manual_bid.dataset.role = 'bid';
				// button_manual_bid.dataset.relSid = record.sid;
				// button_manual_bid.dataset.next_gid = record.next_gid;
				// elm.manual_bid.appendChild(button_manual_bid);

				region_list.appendChild(elm.element);
			}

			const { total_records } = view.continue_list_container.list_container;	

			total_records.textContent =list_data.meta.total_records;	
			// total_records.textContent = ROSKA_FORM.Tools.pad_zero(count ,3);
			
			// if( COTINUE_SID.cursor && COTINUE_SID.cursor.total_records !== undefined)
			// {total_records.textContent = COTINUE_SID.cursor.total_records};	
		
			console.log(ROSKA_FORM.Tools.StoreData.ContinueGroup_data);
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
			const accessor = view.continue_list_container.list_container.region_list;
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
