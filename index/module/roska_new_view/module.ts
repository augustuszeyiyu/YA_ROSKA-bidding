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
		view
		.on('view-state', (e:any) => {
			if (e.state !== "show"){
				return;
			}
			loading_overlay.Show();
			ResetPage();
			init_new_group_serial_parameter()
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
			
		})
		.on('add_new', (e:any) => {
			add_new_group_serial();		
			ResetPage();
			list_new_group_serial();
			ResetPage();
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
                case "delete_group":{
					var confirmed:any  = confirm("您確定要刪除此會組?\n"+button.dataset.relId);
                    if (confirmed){
                        delete_serial(button.dataset.relId);
                    }else{ 
                    }
					ResetPage();
					list_new_group_serial();
                    break;
				}
				case "new_view_group": {
					window.open("./"+'?'+ 'sid='+button.dataset.relSid +'&'+'modal=new_group_view', 'innerHeight=800' ,'innerWidth=800',);
					break;
					
					}

                
                default:
                    alert("您沒有權限使用該功能！\n請使用更高權限等級的帳號執行此操作！");
                    return;
            }
        })
		// async function delete_serial(serial_number:typeof window.ROSKA_FORM.DataType) {
		async function delete_serial(serial_number:string) {
			try{
			let result = await ROSKA_FORM.delete_group_serial(serial_number);
			}catch (e: any) {
				alert(`新增失敗!(${e.message})`);
				console.error(`[${TAG}]`, e);
			}
        }

		async function init_new_group_serial_parameter() {
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
            var queryData = {
                order: "DESC",
                page: "1",
                page_size: "30"
            };
			const list_data = await ROSKA_FORM.Admin_get_new_list(queryData);
			// const { region_list: list, total_records,tmpl_item  } = view.list_container;
			console.log(list_data);
			const region_list = view.list_container.region_list;
            const tmpl_item = view.list_container.tmpl_item;
			var count = 1;
			// console.log(list_data);
			// const {records} = STATE.cursor;
			const records = list_data.records;
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

				const button_group_detail = document.createElement("button");
				button_group_detail.classList.add("btn-blue");
                button_group_detail.textContent = "檢視會組";
                button_group_detail.dataset.role = 'new_view_group';
                button_group_detail.dataset.relId = record.sid;
				
				elm.view_group.appendChild(button_group_detail);

				const button_group_delete = document.createElement("button");
				button_group_delete.classList.add("btn-red");
                button_group_delete.textContent = "刪除會組";
                button_group_delete.dataset.role = 'delete_group';
                button_group_delete.dataset.relId = record.sid;
				
				elm.delete_group.appendChild(button_group_delete);

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
			// console.log(new_group_serial_data);
			try{
				let result = await ROSKA_FORM.add_new_group_serial(new_group_serial_data);
				console.log(result);
			}catch (e: any) {
				alert(`新增失敗!(${e.message})`);
				console.error(`[${TAG}]`, e);
			}
		}


	})();


	function ResetPage(){
		STATE.cursor = null;
		STATE.query = {};

		{
			const accessor = view;
			accessor.list_container.region_list.innerHTML = '';
		}

		// {
		// 	const accessor = view.region_info;
		// 	accessor.element.addClass('hide');
		// }
	}


	
})();
