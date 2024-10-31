(async () => {
	const TAG = 'member_pay_view';
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
	var count = 1;

	const modules = window.modules;
	const viewport = window.viewport;	
	const view = viewport.member_pay_view;
	const loading_overlay = window.loading_overlay;
	modules.push({
		init: async function(){
			const [{element: layout}] = await window.resources([
				{ type: 'html', path: './module/member_pay_view/module.html'},
				{ type: 'css', path: './module/member_pay_view/module.css' }
			]);

			view.element.innerHTML = layout.innerHTML;
			view.relink();
			layout.remove();

			{
				let timeout:any = null;
				const accessor = view.member_pay_list_container ;
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
					const trigger_line = target.scrollHeight - 25;
					const cursor = STATE.cursor;
					console.log("cursorA");
					console.log(cursor);
					if ( current_pos >= trigger_line && cursor !== null ) {
						const { page ,page_size} = cursor.meta;
						if (page !== undefined) {		
							LoadAndUpdateList(cursor.query, {page: page + 1, page_size});
						}
					}
				})
			}

		}
	});

	// (()=>{	})();
	view
	.on('view-state', (e:any) => {
		if (e.state !== "show")
			return;
		ResetPage();
		// loading_overlay.Show();
		console.log(STATE.cursor);
		LoadAndUpdateList(STATE.query, {page_size:150})
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
		console.log(trigger);
		const row = trigger.closest('.t-row');
		// if ( !row ) return;
		const button = trigger.closest('button');
		// if ( !button || !row ) return;
		if ( !button) return;
		
		switch(button.dataset.role) {
			case "export_all": {
				trigger.textContent = '生成中...'; // 可以顯示生成中的提示
				console.log("export_all");
				try {
					let result_data = await ROSKA_FORM.export_all_member_settlement();
					console.log(result_data);
					// let result = await ROSKA_FORM.bid_group_serial(query_data).catch((e: Error) => e);
					  const download_elemet = document.createElement('a');
					  download_elemet.href = result_data.url;
					  download_elemet.download = '';
					  document.body.appendChild(download_elemet);
					  download_elemet.click(); // 觸發下載
					  document.body.removeChild(download_elemet);
					//   alert(result_data.url);
					ResetPage();
				}
				catch (e: any) {
					alert(`輸出失敗(${e.message}`);
				}
				finally{
					trigger.innerHTML= "輸出報表<br>(所有會組)" // 還原按鈕文本
				}
				break;		
				
			}
			case "view_detail": {
				// window.location.href = "/admin/member/info/" + row.dataset.relId;
				window.open("./"+'?'+ 'uid='+button.dataset.relUid +'&'+'modal=payment_group', 'innerHeight=800' ,'innerWidth=800',);
				// window.open("./module/roska_new_view/modals.html" + button.dataset.relId, innerHeight=1600,innerWidth=800,);
				break;
				
			}
			case "profit": {
				trigger.textContent = '生成中...'; // 可以顯示生成中的提示
				try{
					let result_data = await ROSKA_FORM.export_member_settlement(button.dataset.relUid);
					console.log(result_data);
					// let result = await ROSKA_FORM.bid_group_serial(query_data).catch((e: Error) => e);
					  const download_elemet = document.createElement('a');
					  download_elemet.href = result_data.url;
					  download_elemet.download = '';
					  document.body.appendChild(download_elemet);
					  download_elemet.click(); // 觸發下載
					  document.body.removeChild(download_elemet);
					//   alert(result_data.url);
					ResetPage();
				}
				catch (e: any) {
					alert(`輸出失敗(${e.message}`);
				}
				finally{
					trigger.textContent = '會組統計下載'; // 還原按鈕文本
				}
				break;				
			}
			
			// default:
			// 	alert("您沒有權限使用該功能！\\n請使用更高權限等級的帳號執行此操作！");
			// 	return;
		}
	})
	async function LoadAndUpdateList(query:QueryParam, paging?:any) {
		try{
			loading_overlay.Show();
			// const { region_list: list, total_records,tmpl_item  } = view.list_container;			
            const region_list = view.member_pay_list_container.list_container.region_list;
            const tmpl_item = view.member_pay_list_container.list_container.tmpl_item;
            const { total_records } = view.member_pay_list_container.list_container;
		
			STATE.cursor = await ROSKA_FORM.List_all_user(query, paging);
			total_records.textContent = STATE.cursor.meta.total_records;	

			const {records} = STATE.cursor;
			// console.log(records)


			for(const record of records) {

				// console.log(record);
				const elm = tmpl_item.duplicate();

				// count name total_group alive_group death_group win_group view_detail check_box export
				elm.count.textContent = count;
				count += 1;
				elm.name.textContent = record.name;
				elm.phone_number.textContent = record.contact_mobile_number;

					var today_this = new Date();
					var next_bid_date = ROSKA_FORM.Tools.calculateMonthlyBitStartTime(today_this,-1);
					console.log(next_bid_date);	
					console.log(next_bid_date.getMonth);	
		
					const testdate = ROSKA_FORM.Tools.calculateMonthlyBitStartTime(new Date() , 1);
					const year:number = Number(testdate.getFullYear()); 
					const month:number = Number(next_bid_date.getMonth()); 
					
					console.log({"next_bid_date":next_bid_date});
					console.log({"testdate":testdate});
					console.log(year,month);
				const member_profit_list_data = await ROSKA_FORM.Admin_Get_settlement_list(record.uid, year, month);

				interface GroupInfo {
					gid: string;
					win_amount: number;
				}
				const settlement_data:{
					alive_account:number,
					deth_account:number,
					win_account:{
						gids:GroupInfo[],
						win_amount:number,
					},
				} = {
					alive_account:0,
					deth_account:0,
					win_account:{
						gids:[],
						win_amount:0,
					},
				};
				for( const personal_record of member_profit_list_data){

					var che = personal_record.group_info.at(-1);
					console.log(che);
					// if( Number(che.win_amount) === 0 ){
					// 	continue;
					// };
					var record_pre_bid_end_time = new Date(personal_record.group_info.at(-1).bid_end_time);
					var today_this = new Date();
					var this_bid_date = ROSKA_FORM.Tools.calculateMonthlyBitStartTime(today_this,0);					
					var inteval = Number(this_bid_date.getMonth())-Number(record_pre_bid_end_time.getMonth());
					if( inteval > 1){								
						continue;
					}

					const lastGroupInfo = personal_record.group_info.at(-1);
					const winAmount = parseInt(lastGroupInfo.win_amount, 10);
					switch(personal_record.group_info.at(-1).win_amount){
						case 0:{
							break;
						}
						case -4000:{
							settlement_data.alive_account +=1;
							break;
						}
						case -5000:{						
							settlement_data.deth_account +=1;
							break;
							
						}
						default : {
							settlement_data.win_account.gids.push(lastGroupInfo);
							settlement_data.win_account.win_amount += winAmount;
						}
					}
				}
				//end for2

				elm.total_group.innerHTML = "本期應繳會費 : <br>" + ( (settlement_data.alive_account * 4000) + (settlement_data.deth_account * 5000) + -(settlement_data.win_account.win_amount) );
				elm.alive_group.innerHTML = "活會數 :  <br><span style=\"color:green;\">" + settlement_data.alive_account + "</span><br>" + " 活會款總計  : <br>" + settlement_data.alive_account * 4000;
				elm.death_group.innerHTML = "死會數 :  <br><span style=\"color:red;\">" + settlement_data.deth_account + "</span><br>" + " 死會款總計  : <br>" + settlement_data.deth_account * 5000;
				// elm.win_group.innerHTML = settlement_data.win_account.win_amount;

				var new_win_section = document.createElement("p");
				elm.win_group.innerHTML = "得標會數 :  <br><span style=\"color:green;\">" + settlement_data.win_account.gids.length + "</span><br>" + " 得標會款總計  : <br>" + -(settlement_data.win_account.win_amount);





				const button_group_detail = document.createElement("button");
				button_group_detail.classList.add("btn-blue");
				button_group_detail.textContent = "詳細資訊";
				button_group_detail.dataset.role = 'view_detail';
				button_group_detail.dataset.relUid = record.uid;
				button_group_detail.dataset.relName = record.name;
				elm.view_detail.appendChild(button_group_detail);

				const button_export = document.createElement("button");
				button_export.classList.add("btn-green");
				button_export.textContent = "輸出報表";
				button_export.dataset.role = 'profit';
				button_export.dataset.relUid = record.uid;
				elm.export.appendChild(button_export);

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
			const accessor = view.member_pay_list_container.list_container.region_list;
            accessor.innerHTML = '';
		}
		count = 1;
		// {
		// 	const accessor = view.region_info;
		// 	accessor.element.addClass('hide');
		// }
	}


	
})();
