(async () => {
	const TAG = 'roska_continue_view';
    const LANG_NAME_MAP = {en_us:'英文', zh_tw:'繁體中文', zh_cn:'簡體中文'};
    type QueryParam = {};

	///****待修改****///
	// type PagingCursor = Awaited<ReturnType<typeof window.ROSKA_FORM.Do_Register_User_Info>>;
	type PagingCursor = Awaited<ReturnType<typeof window.ROSKA_FORM.Admin_get_on_list>>;
	type QueryParamTask = { token:string; state?:string; order?:{[key:string]:string;}; };
	const COTINUE_SID:{ query:QueryParamTask; cursor:PaginateCursor<any>|null;} = {query:{token:''}, cursor:null};
	const queryData:{ order:string; page:string; page_size:string } = {	order: "DESC",	page: "1",	page_size: "50"	};
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
					const trigger_line = target.scrollHeight - 5;
					const cursor = COTINUE_SID.cursor;
					// console.log(cursor);
		
					if ( current_pos >= trigger_line && cursor !== null ) {
						const { page, page_size } = (cursor) as { page?:number ,page_size?: number };
						if (page !== undefined) {
						queryData.page = String(page + 1);
						}
						queryData.page_size = String(page_size);
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
		// ResetPage();
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
            var rowCheckboxes = document.querySelectorAll('.row-checkbox') as NodeListOf<HTMLInputElement>;;
            rowCheckboxes.forEach(checkbox => {
            checkbox.checked = selectAllCheckbox.checked;
            });
        }

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
			// case "bid": {
			// 	var query_data = { "gid" :button.dataset.next_gid} ;
			// 	console.log(button.dataset.next_gid );
			// 	console.log(query_data);
			// 	await ROSKA_FORM.bid_group_serial(query_data).catch((e: Error) => e);
			// 	ResetPage();
			// 	break;
				
			// }
			case "view_group": {
				// window.location.href = "/admin/member/info/" + row.dataset.relId;
				window.open("./"+'?'+ 'sid='+button.dataset.relSid +'&'+'modal=group_view', 'innerHeight=800' ,'innerWidth=800',);
				// window.open("./module/roska_new_view/modals.html" + button.dataset.relId, innerHeight=1600,innerWidth=800,);
				break;
				
			}
			
			default:
				alert("您沒有權限使用該功能！\\n請使用更高權限等級的帳號執行此操作！");
				return;
		}
	})

	async function list_new_group_serial(queryData?:any) {

		try {
			const list_data = await ROSKA_FORM.Admin_get_on_list(queryData);
			COTINUE_SID.cursor = list_data.meta;
			// const { region_list: list, total_records,tmpl_item  } = view.member_list_container;
			console.log(list_data);
			const region_list = view.continue_list_container.list_container.region_list;
			const tmpl_item = view.continue_list_container.list_container.tmpl_item;


			const { total_records } = view.continue_list_container.list_container;	
			total_records.textContent =list_data.meta.total_records;	
			// if( COTINUE_SID.cursor && COTINUE_SID.cursor.total_records !== undefined)
			// {total_records.textContent = COTINUE_SID.cursor.total_records};	
		
			const records = list_data.records;
			for(const record of records) {
				// console.log(record);
				// const create_time = dayjs.unix(record.create_time);
				const elm = tmpl_item.duplicate();
				// elm.element.dataset.id = record.id;
				// elm.id.textContent = record.id;
				// elm.email.textContent = record.email;
				elm.create_time.textContent = record.bid_start_time.slice(0 , 10);
				// elm.create_time.textContent = record.create_time.slice(0 , 10)+" "+record.create_time.slice(11 , -5);;
				elm.last_duration.textContent = record.prev_gid.gid.slice(0, 6)+"-"+record.prev_gid.gid.slice(-3,-2).toUpperCase()+record.prev_gid.gid.slice(-2);
				elm.bid_member.textContent = record.prev_gid.mid;
				elm.bid_name.textContent = record.prev_gid.name;
				// elm.create_time.title = create_time.format("YYYY/MM/DD HH:mm:ss");
				// elm.level.textContent = record.level;
				// elm.exchange.textContent = record.exchange;
				// elm.symbol.textContent = record.symbol;

				elm.count.textContent = ROSKA_FORM.Tools.pad_zero(count ,3);
				count += 1;
				elm.sid.textContent= record.sid;

				const button_group_detail = document.createElement("button");
				button_group_detail.classList.add("btn-blue");
				button_group_detail.textContent = "檢視會組";
				button_group_detail.dataset.role = 'view_group';
				button_group_detail.dataset.relSid = record.sid;
				elm.view_group.appendChild(button_group_detail);

				const button_group_bid = document.createElement("button");
				button_group_bid.classList.add("btn-green");
				button_group_bid.textContent = "電腦開標";
				button_group_bid.dataset.role = 'bid';
				button_group_bid.dataset.next_gid = record.next_gid.gid;
				button_group_bid.dataset.relSid = record.sid;	
				elm.bid.appendChild(button_group_bid);

				const button_check_box = document.createElement("input");
				button_check_box.classList.add("row-checkbox");
				button_check_box.type = "checkbox";
				button_check_box.dataset.role = 'checkbox';
				button_check_box.dataset.next_gid = record.next_gid.gid;
				button_check_box.dataset.relSid = record.sid;
				elm.check_box.appendChild(button_check_box);


				const button_export = document.createElement("button");
				button_export.classList.add("btn-orange");
				button_export.textContent = "輸出報表";
				button_export.dataset.role = 'bid';
				button_export.dataset.relSid = record.sid;
				button_export.dataset.next_gid = record.next_gid.gid;
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
		var count = 1;
		list_new_group_serial(queryData);
		// {
		// 	const accessor = view.region_info;
		// 	accessor.element.addClass('hide');
		// }
	}


	
})();
