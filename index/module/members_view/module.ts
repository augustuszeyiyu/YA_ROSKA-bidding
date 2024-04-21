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
					console.log("scrollXX");
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
					const cursor = STATE.cursor;
					if ( current_pos >= trigger_line && cursor !== null ) {
						const { page, page_size } = cursor.meta;
						if (page !== undefined) {
						LoadAndUpdateList(members.query, {page: page + 1, page_size});
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
		ResetPage();
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
				elm.uid.textContent= record.nid;

				const button_group_detail = document.createElement("button");
				button_group_detail.classList.add("btn-blue");
				button_group_detail.textContent = "檢視";
				button_group_detail.dataset.role = 'edit';
				button_group_detail.dataset.relId = record.uid;
				elm.view_member.appendChild(button_group_detail);

				const button_group_bid = document.createElement("button");
				button_group_bid.classList.add("btn-green");
				button_group_bid.textContent = "損益資訊";
				button_group_bid.dataset.role = 'profit';
				button_group_bid.dataset.relId = record.sid;
				elm.member_profit.appendChild(button_group_bid);

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
		LoadAndUpdateList(STATE.query)
		// {
		// 	const accessor = view.region_info;
		// 	accessor.element.addClass('hide');
		// }
	}


	
})();
