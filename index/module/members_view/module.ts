// (async () => {
(() => {
	const TAG = 'members_view';
    const LANG_NAME_MAP = {en_us:'英文', zh_tw:'繁體中文', zh_cn:'簡體中文'};
    type QueryParam = {
		filter_text?:string;
		order?:{[key:string]:string;};
	};
	// type QueryParam = {};
	///****待修改****///
	type PagingCursor = Awaited<ReturnType<typeof window.ROSKA_FORM.Do_Register_User_Info>>;
	type QueryParamTask = { token:string; state?:string; order?:{[key:string]:string;}; };
	const members:{ query:QueryParamTask; cursor:PaginateCursor<any>|null;} = {query:{token:''}, cursor:null};

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
	const view = viewport.members_view;
	const loading_overlay = window.loading_overlay;
	modules.push({
		init: async function(){
			const [{element: layout}] = await window.resources([
				{ type: 'html', path: './module/members_view/module.html'},
				{ type: 'css', path: './module/members_view/module.css' }
			]);

			view.element.innerHTML = layout.innerHTML;
			view.relink();
			layout.remove();

			{
				let timeout:any = null;
				const accessor = view.member_list_container ;
				// console.log(accessor.region_list);
				// viewport.viewport_container 
				accessor
				.on('scroll', (e:any) => {
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
					STATE.cursor.meta = {	order: "DESC",	page: "1",	page_size: "50"	};
					const cursor = STATE.cursor;
					console.log(cursor);
					if ( current_pos >= trigger_line && cursor !== null ) {
						const { page, page_size } = cursor.meta;
						if (page !== undefined) {
						LoadAndUpdateList(cursor.query, {page: page + 1, page_size});
						}
					}
				})
			}

		}
		
	});
	

	view
	.on('view-state', (e:any) => {
		if (e.state !== "show")
			return;
		ResetPage();
		// loading_overlay.Show();
		// LoadAndUpdateList(STATE.query)
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
		if ( !row ) return;
		
		
		// if ( trigger.closest('.member-state') !== null ) {
		//     const {id, enabled} = member_map[row.dataset.relId];
		//     await ToggleUserEnableState(id, !enabled);
		//     return;
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
			case "edit_user": {
				// window.location.href = "/admin/member/info/" + row.dataset.relId;
				window.open("./"+'?'+ 'uid='+button.dataset.relUid +'&'+'modal=member_detail', 'innerHeight=800' ,'innerWidth=800',);
				// window.open("./module/roska_new_view/modals.html" + button.dataset.relId, innerHeight=1600,innerWidth=800,);
				break;
				
			}
			case "profit": {
				// window.location.href = "/admin/member/info/" + row.dataset.relId;
				window.open("./"+'?'+ 'sid='+button.dataset.relId +'&'+'modal=profit_view', 'innerHeight=800' ,'innerWidth=800',);
				// window.open("./module/roska_new_view/modals.html" + button.dataset.relId, innerHeight=1600,innerWidth=800,);
				break;
				
			}
			
			default:
				alert("您沒有權限使用該功能！\\n請使用更高權限等級的帳號執行此操作！");
				return;
		}
	})
	// .on('add_new', (e:any) => {
	// 	add_new_group_serial();
	// 	ResetPage();
	// 	LoadAndUpdateList();
	// })

	async function LoadAndUpdateList(query:QueryParam, paging?:any) {
		try{
			loading_overlay.Show();
			// const { region_list: list, total_records,tmpl_item  } = view.list_container;			
            const region_list = view.member_list_container.list_container.region_list;
            const tmpl_item = view.member_list_container.list_container.tmpl_item;
            const { total_records } = view.member_list_container.list_container;
		
			STATE.cursor = await ROSKA_FORM.List_all_user(query, paging);
			total_records.textContent = STATE.cursor.meta.total_records;	

			const {records} = STATE.cursor;
			for(const record of records) {
				// const create_time = dayjs.unix(record.create_time);
				const elm = tmpl_item.duplicate();
				// elm.element.dataset.id = record.id;
				// elm.id.textContent = record.id;
				// elm.email.textContent = record.email;
				elm.referrer_name.textContent = record.contact_home_number;
				elm.phone.textContent = record.contact_mobile_number;
				elm.name.textContent = record.name;
				elm.join_time.textContent = record.create_time.slice(0 , 10)+" "+record.create_time.slice(11 , -5);;
				// elm.create_time.title = create_time.format("YYYY/MM/DD HH:mm:ss");
				// elm.level.textContent = record.level;
				// elm.exchange.textContent = record.exchange;
				// elm.symbol.textContent = record.symbol;

				elm.count.textContent = count;
				count += 1;
				elm.nid.textContent= record.nid;

				const button_group_detail = document.createElement("button");
				button_group_detail.classList.add("btn-blue");
				button_group_detail.textContent = "會員資料";
				button_group_detail.dataset.role = 'edit_user';
				button_group_detail.dataset.relUid = record.uid;
				elm.view_member.appendChild(button_group_detail);

				// const button_group_bid = document.createElement("button");
				// button_group_bid.classList.add("btn-green");
				// button_group_bid.textContent = "損益資訊";
				// button_group_bid.dataset.role = 'profit';
				// button_group_bid.dataset.relId = record.sid;
				// elm.member_profit.appendChild(button_group_bid);

				region_list.appendChild(elm.element);
			}	

		}
		catch(e:any){
			console.error(e);
			alert(`載入失敗！無法取得使用者列表！(${e.message})`);
			window.HandleUnauthorizedAccess(e);
		}
		finally{
			loading_overlay.Hide();
		}
	}




	function ResetPage(){
		STATE.cursor = null;
		STATE.query = {};

		{
			const accessor = view.member_list_container.list_container.region_list;
            accessor.innerHTML = '';
		}
		count = 1;
		LoadAndUpdateList(STATE.query)
		// {
		// 	const accessor = view.region_info;
		// 	accessor.element.addClass('hide');
		// }
	}


	
})();
