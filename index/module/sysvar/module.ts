(async () => {
	const TAG = 'sysvar';
    const LANG_NAME_MAP = {en_us:'英文', zh_tw:'繁體中文', zh_cn:'簡體中文'};
    type QueryParam = {};
	type PagingCursor = Awaited<ReturnType<typeof window.ROSKA_FORM.Do_Register_User_Info>>;
	const STATE:{
		query:QueryParam;
		cursor:PagingCursor|null;
	} = {
		query:{},
		cursor:null
	};

	const modules = window.modules;
	const viewport = window.viewport;	
	const view = viewport.sysvar_view;
	const loading_overlay = window.loading_overlay;
	modules.push({
		init: async function(){
			const [{element: layout}] = await window.resources([
				{ type: 'html', path: './module/sysvar/module.html'},
				{ type: 'css', path: './module/sysvar/module.css' }
			]);

			view.element.innerHTML = layout.innerHTML;
			view.relink();
			layout.remove();
		}
	});

	(()=>{
		const view = viewport.sysvar_view;



		view
		.on('view-state', (e:any)=>{
			if ( e.state !== "show" ) return;

			loading_overlay.Show();
			LoadAndShowSystemSysvar()
			.catch((e)=>{
				console.error(e);
				alert(`載入失敗！無法取得系統設定值！(${e.message})`);
				window.HandleUnauthorizedAccess(e);
			})
			.finally(()=>{
				loading_overlay.Hide();
			});
		})

		async function LoadAndShowSystemSysvar() {
			const accessor = view.system_sysvar;
			accessor.
			// const sysvars:{key:keyof typeof CONVERSION_MAP; value:[number, number]|string|number;}[] = await window.AIHunter.GetSystemSysvar();

			// for(const {key, value} of sysvars) {
			// 	const cast_info = CONVERSION_MAP[key];
			// 	if ( cast_info === undefined ) continue;
				
			// 	const elem = accessor[key];
			// 	switch(cast_info.type) {
			// 		case "ratio":
			// 			elem.display.textContent = window.AIHunter.Tools.CastPercentageIntArrayToString(value as [number, number]);
			// 			break;

			// 		case "usdt": {
			// 			const raw_value = BigInt(value as string);
			// 			const integer	= (raw_value/1000000n).toString(10);
			// 			const remaining	= (raw_value%1000000n).toString(10).padStart(6, '0').replace(/(0+)$/, '');
			// 			elem.display.textContent = `${integer}${(remaining.length > 0 ? '.' : '') + remaining}`;
			// 			break;
			// 		}

			// 		case "number": {
			// 			elem.display.textContent = parseFloat(`${value}`);
			// 			break;
			// 		}

			// 		case "integer": {
			// 			elem.display.textContent = parseInt(`${value}`);
			// 			break;
			// 		}

			// 		default:
			// 			elem.display.textContent = `${value}`;
			// 			break;
			// 	}
				
				// elem.edit.value = '';
			// }
		}



	})();
	// view
	// .on('load_config_value',async(_e:any)=>{
	// 	load_config_value();
	// })     
	// .on('load_test_register_userinfo',(e:any)=>{
	// });

	async function load_config_value(){
		// User_Infoa: UserInfo)

        // const accessor = view.input_data;
		// const Register_input_Data: User= {
        //     nid: '',
        //     name: '',
        //     gender: 'M',
        //     birth_date: '',
        //     address: '',
        //     line_id: '',
        //     contact_home_number: '',
        //     contact_mobile_number: '',
        //     // role: {type:'number'},
        //     bank_code: '',
        //     branch_code: '',
        //     bank_account_name: '',
        //     bank_account_number: '',
        //     emergency_nid: '',
        //     emergency_contact: '',
        //     emergency_contact_number: '',
        //     emergency_contact_relation: '',
        //     // referrer_nid: undefined,
        //     // volunteer_nid: undefined,
		// 	password: '',
		// }
        // for (const key in Register_input_Data) {          
        //     if(accessor[key]){
        //         Register_input_Data[key]=accessor[key].value;
		// 	}
        // };
		// console.log("check02",Register_input_Data);
		// try{
		// 	let result = await ROSKA_FORM.Do_Register_User_Info(Register_input_Data);
		// }catch (e: any) {
		// 	alert(`拳頭硬硬的(${e.message})`);
		// 	console.error(`[${TAG}]`, e);
		// }
		
	}


	function ResetPage(){
		STATE.cursor = null;
		STATE.query = {};

		{
			const accessor = view;
			accessor.region_list.innerHTML = '';
		}

		{
			const accessor = view.region_info;
			accessor.element.addClass('hide');
		}
	}


	
})();
