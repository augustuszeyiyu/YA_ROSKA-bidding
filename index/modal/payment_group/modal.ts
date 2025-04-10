"use strict";

// import { pad_zero } from "../../../lib/tools";

// (async () => {
( () => {
    const TAG = 'payment_group';
    const LANG_NAME_MAP = { en_us: '英文', zh_tw: '繁體中文', zh_cn: '簡體中文' };
    ///****待修改****///
    const STATE = {
        query: {},
        cursor: null
    };
    const modals = window.modals;
    const loading_overlay = window.loading_overlay;
    const view = window.modal_view;
    const modal_view = view.payment_group;
    // const wheel_data = window.wheel_data;
    const tlast_data =[{
        mid:'' ,
        uid:''
    }];
    modals.push({
        init: async function () {
            const [{ element: layout }] = await window.resources([
                { type: 'html', path: './modal/payment_group/modal.html' },
                { type: 'css', path: './modal/payment_group/modal.css' }
            ]);
            modal_view.element.innerHTML = layout.innerHTML;
            modal_view.relink();
            layout.remove();
            // list_group_info();
        }
    });

    
    modal_view
        .on('view-state', (e:any) => {
        if (e.state !== "show")
            return;
        loading_overlay.Show();
        ResetPage(); 

        list_payment_group()
            .catch((e) => {
            console.error(e);
            alert(`載入失敗！(${e.message})`);
            window.HandleUnauthorizedAccess(e);
            })
            .finally(() => {
            loading_overlay.Hide();
            });

        })
        .on('click', async(e:any)=>{
            const trigger = e.target;
            console.log(trigger);
            const trigger_button = trigger.closest('div');		
            if ( !trigger_button) return;		
            switch(trigger_button.dataset.role) {
                case "view_group": {
                    // window.location.href = "/admin/member/info/" + row.dataset.relId;
                    window.open("./"+'?'+ 'sid='+trigger_button.dataset.relSid +'&'+ "next_gid="+ trigger_button.dataset.relNext_gid  +'&'+'modal=group_view', 'innerHeight=800' ,'innerWidth=800',);
                    break;
                    
                }
            }
        });
        
    async function list_payment_group() {
        const InputParams = new URLSearchParams(window.location.search);
        // const searchParams: Array<string> = [];
        const searchParams: any = {};
        InputParams.forEach((key ,value:any)=>{
                searchParams[value]=key;
        });
        if( !searchParams['uid'])
        return;

            var today_this = new Date();
            var next_bid_date = ROSKA_FORM.Tools.calculateMonthlyBitStartTime(today_this,0);	

            const testdate = ROSKA_FORM.Tools.calculateMonthlyBitStartTime(new Date() , 1);
            const year:number = Number(testdate.getFullYear()); 
            const month:number = Number(testdate.getMonth()); 
        const list_data = await ROSKA_FORM.Admin_Get_settlement_list(searchParams['uid'],year,month);
        console.log("list_data",list_data);

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
            }
        };
        console.log('gids',settlement_data.win_account.gids);

        const { total_records, tmpl_item  } = modal_view.list_container;		
        const region_list = modal_view.list_container.region_list;
        const pay_list_region = modal_view.list_container.pay_list;
        const pay_container = modal_view.list_container.pay_container;

        console.log('pay_list_region',pay_list_region);
        if (list_data) {
            // const list_datas = list_data.slice(1);
            
            
            var count = 1;
            var count_1 = 0;
            var w_data:any = [];
            var last_gid = ' ';

            // list_data.forEach(function(record:any) {
            for(const record of list_data) {
                var che = record.group_info.at(-1);
                tlast_data[record.mid]=record.uid;
                var record_pre_bid_end_time = new Date(record.group_info.at(-1).bid_end_time);
                var today_this = new Date();
                var this_bid_date = ROSKA_FORM.Tools.calculateMonthlyBitStartTime(today_this,0);					
                var inteval = Number(this_bid_date.getMonth())-Number(record_pre_bid_end_time.getMonth());
                var inteval_year = Number(this_bid_date.getFullYear())-Number(record_pre_bid_end_time.getFullYear());
                var inteval_day = Number(this_bid_date.getDate()) - Number(record_pre_bid_end_time.getDate());

                // console.log({"A":"this_bid_date","B" : this_bid_date.getMonth(),"c": this_bid_date,"d":today_this});
                // console.log({"A":"record_pre_bid_end_time","B" : record_pre_bid_end_time.getMonth(),"c":record_pre_bid_end_time	});
                // console.log("today this", today_this,this_bid_date);
                // console.log( {inteval,this_bid_date,record_pre_bid_end_time});
                // console.log(record.mid);
                // console.log(inteval,"break point 2",inteval_year);
                // console.log(inteval_day,Number(today_this.getDate()),Number(this_bid_date.getDate()));
                if (inteval < 0 || inteval_year > 0) {
                    // console.log("A",record);
                    // console.log(this_bid_date);
                    // console.log(record_pre_bid_end_time);
                    // console.log(inteval,inteval_year,inteval_day);
                    continue;
                }
                if (inteval == 1 && inteval_day <= 0 ) {
                    // console.log("B");                 
                    // console.log(this_bid_date);
                    // console.log(record_pre_bid_end_time);
                    // console.log(inteval,inteval_year,inteval_day);
                    continue;
                }
                if (inteval > 1 ) {
                    // console.log("C");
                    
                    // console.log(this_bid_date);
                    // console.log(record_pre_bid_end_time);
                    // console.log(inteval,inteval_year,inteval_day);
                    continue;
                }
                else {
                    // console.log("Def",record);
                    
                    // console.log(this_bid_date);
                    // console.log(record_pre_bid_end_time);
                    // console.log(inteval,inteval_year,inteval_day);

                    // if(!record.gid) {
                    //     w_data[count_1]={"mid":record.mid,"name":record.name,'uid':record.uid};
                    //     count_1 += 1 ;
                    // }
                    // else if(record.gid){                   
                    //     last_gid = record.gid;
                    // };

                    
                    const elm = tmpl_item.duplicate();
                    elm.count.textContent = count;
                    count +=1;

                    const lastGroupInfo = record.group_info.at(-1);
                    const winAmount = parseInt(lastGroupInfo.win_amount, 10);
                    switch(record.group_info.at(-1).win_amount){
                        case 0:{
                            elm.pay_amount.innerHTML = "轉讓";
                            break;
                        }
                        case -4000:{
                            settlement_data.alive_account +=1;
                            elm.pay_amount.textContent = che.win_amount;
                            break;
                        }
                        case -5000:{                  
                                settlement_data.deth_account +=1;
                                elm.pay_amount.textContent = che.win_amount;
                                break;
                        }
                        default : {
                            console.log("defaut");
                            settlement_data.win_account.gids.push(lastGroupInfo);
                            settlement_data.win_account.win_amount += winAmount;
                            elm.pay_amount.textContent = che.win_amount;
                        }
                    }


                    elm.view_group.dataset.role = 'view_group';
                    elm.view_group.dataset.relSid = record.sid;
                    elm.view_group.dataset.relNext_gid = String(che.gid.slice(0,-2)+ROSKA_FORM.Tools.pad_zero((Number(che.gid.slice(-2))+1),2));
                    const button_group_detail =  document.createElement("samp")
                    button_group_detail.classList.add("glyph-fontawesome-search");
                    elm.view_group_icon.appendChild(button_group_detail);


                    elm.gid.textContent = che.gid;
                    
                    elm.memebr_mid.textContent = record.mid;
                    region_list.appendChild(elm.element);

                }
            }

            // pay_container.member_name.textContent = searchParams.name;
            pay_list_region.user_name.innerHTML = searchParams.name;
            pay_list_region.should_pay.innerHTML = "本期應繳會費 : <br>" + ( (settlement_data.alive_account * 4000) + (settlement_data.deth_account * 5000) + -(settlement_data.win_account.win_amount) );
            pay_list_region.alive_account.innerHTML = "活會數 : <span style=\"color:green;\">" + settlement_data.alive_account + "</span><br>" + " 活會款總計" + settlement_data.alive_account * 4000;
            pay_list_region.death_account.innerHTML = "死會數 : <span style=\"color:red;\">" + settlement_data.deth_account + "</span><br>" + " 死會款總計" + settlement_data.deth_account * 5000;
            // elm.win_group.innerHTML = settlement_data.win_account.win_amount;

            var new_win_section = document.createElement("p");
            console.log("settlement_data.win_account.gids.length");
            console.log(settlement_data.win_account.gids.length);
            pay_list_region.win_account.innerHTML = "得標會數 : <span style=\"color:green;\">" + settlement_data.win_account.gids.length + "</span><br>" + " 得標會款總計" + -(settlement_data.win_account.win_amount);
        }
    };
    function ResetPage() {
        STATE.cursor = null;
        STATE.query = {};

        {
            const accessor = modal_view;
            // console.log('accessor');
            accessor.innerHTML = '';
        }
        // {
        // 	const accessor = view.region_info;
        // 	accessor.element.addClass('hide');
        // }
    }
})();
