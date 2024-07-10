"use strict";
// (async () => {
( () => {
    const TAG = 'roska_group_info';
    const LANG_NAME_MAP = { en_us: '英文', zh_tw: '繁體中文', zh_cn: '簡體中文' };
    ///****待修改****///
    const STATE = {
        query: {},
        cursor: null
    };
    const modals = window.modals;
    const loading_overlay = window.loading_overlay;
    const view = window.modal_view;
    const modal_view = view.group_view;
    // const wheel_data = window.wheel_data;
    const tlast_data =[{
        mid:'' ,
        uid:''
    }];
    modals.push({
        init: async function () {
            const [{ element: layout }] = await window.resources([
                { type: 'html', path: './modal/group_view/modal.html' },
                { type: 'css', path: './modal/group_view/modal.css' }
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

            // 1. Configure the wheel's properties:
            const props = {
                items: [
                {
                    label: 'one',
                },
                {
                    label: 'two',
                },
                {
                    label: 'three',
                },
                ]
            }
            
            // 2. Decide where you want it to go:
            const container = document.querySelector('.wheel-container');
            
            // 3. Create the wheel in the container and initialise it with the props:
            // const wheel = new Wheel(container, props);

            list_group_info()
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
            // const card = trigger.closest('.Card'); 
            console.log(trigger);
            // const button = trigger.closest('.button'); 
            const button = trigger; 
             // const roulette = trigger.closest('.roulette');

            // const spinButton = trigger.closest('spinButton');
            // if(trigger.role){
            //     console.log(trigger.role);
            //     switch(trigger.role){
            //         case "spin": {
            //                 const roulette = modal_view.roulette;
            //                 console.log(roulette);
            //                 let currentAngle = 0;
                        

            //                 const segmentCount = roulette.children.length;
            //                 const randomSegment = Math.floor(Math.random() * segmentCount);
            //                 const segmentAngle = 360 / segmentCount;
            //                 const spinCount = 5; // 控制轉動圈數
                    
            //                 // 轉動的角度 = 當前角度 + 需要轉動的角度
            //                 let targetAngle = currentAngle + spinCount * 360 + randomSegment * segmentAngle + 15;
                    
            //                 // 設定輪盤的轉動角度
            //                 roulette.style.transform = `rotate(${targetAngle}deg)`;
            //                 console.log("targetAngle");
            //                 console.log(targetAngle);
            //                 // 更新當前角度
            //                 currentAngle = 0;
            //                 targetAngle = 0;
            //                 console.log("currentAngle");
            //                 console.log(currentAngle);


            //         }
            //     }
            // }      

            if ( !button) return;         
            switch(button.dataset.role) {
                case "bid": {
                    if(!button.dataset.next_gid){
                        console.log('會組已完結');
                        alert('會組已完結');
                        break;	
                    }
                    var query_data = { "gid" :button.dataset.next_gid} ;			
                    // console.log(button.dataset.next_gid );
                    // console.log(query_data);
                    try{
                        // console.log(button.dataset.relSid );
                        await ROSKA_FORM.bid_group_serial(query_data);
                        // let result = await ROSKA_FORM.bid_group_serial(query_data).catch((e: Error) => e);
                        alert(button.dataset.relSid+'已完成開標');
                        ResetPage();
                    }
                    catch (e: any) {
                        alert(`開標失敗(${e.message})`);
                    }
    
                    break;
                }
                case "manual_bid" : {
                    var finalResultElement = document.getElementById("final_result");
                    // console.log(tlast_data);
                    // console.log(finalResultElement);
                    // console.log(finalResultElement?.dataset.mid);
                    if(!finalResultElement?.dataset.mid){
                        alert('請重新抽簽');
                        break;
                    }
                    var smid:string = finalResultElement?.dataset.mid;
                    var suid = tlast_data[smid as keyof typeof tlast_data];
                    // console.log(suid);
                    if(!button.dataset.next_gid){
                        console.log('會組已完結');
                        alert('會組已完結');
                        break;	
                    }
                    var assign_query_data = { "gid" : button.dataset.next_gid, "assign_to_mid" : smid ,} ;			
                    try{
                        console.log(assign_query_data);
                        await ROSKA_FORM.assign_bid(assign_query_data);
                        // let result = await ROSKA_FORM.bid_group_serial(query_data).catch((e: Error) => e);
                        alert(button.dataset.relSid+'已完成抽籤');
                        ResetPage();
                    }
                    catch (e: any) {
                        alert(`抽籤失敗(${e.message})`);
                    }
    
                    break;
                }
                case "view_group": {
                    break;                   
                }
                case "spin_wheel": {
                    // console.log('spin_wheel');
                    break;                   
                }
                default:
                    // alert("您沒有權限使用該功能！\\n請使用更高權限等級的帳號執行此操作！");
                    return;
            }
        });
        
    async function list_group_info() {
        const InputParams = new URLSearchParams(window.location.search);
        // const searchParams: Array<string> = [];
        const searchParams: any = {};
        InputParams.forEach((key ,value:any)=>{
                searchParams[value]=key;
        });
        if( !searchParams['sid'])
        return;
        const list_data = await ROSKA_FORM.Get_in_groups(searchParams['sid']);
        console.log(list_data);

        const { total_records, tmpl_item  } = modal_view.list_container;		
        const region_list = modal_view.list_container.region_list;
        if (list_data) {
            const list_datas = list_data.slice(1);
            var count = 1;
            var count_1 = 0;
            var w_data:any = [];
            var last_gid = ' ';
            list_datas.forEach(function(record:any) {
                tlast_data[record.mid]=record.uid;
                if(!record.gid) {
                    w_data[count_1]={"mid":record.mid,"name":record.name,'uid':record.uid};
                    count_1 += 1 ;
                }
                else if(record.gid){
                    last_gid = record.gid;
                };
                const elm = tmpl_item.duplicate();
                elm.numb.textContent = count;
                count +=1;
                elm.mid.textContent = record.mid;
                elm.name.textContent = record.name;
                elm.gid.textContent = record.gid;
                elm.bid_amount.textContent = record.bid_amount;
                region_list.appendChild(elm.element);
            })

            modal_view.list_container.sid.textContent = '會組編號 : '+searchParams['sid'];
            modal_view.list_container.group_leader.textContent = '會首 : '+list_data[0].name;
            modal_view.list_container.address.textContent = '合會地址 : '+'永康合會';
            modal_view.list_container.next_bid_date.textContent = '前次開標會期 : '+ last_gid;
            window.wheel_data = w_data;
            // console.log('w_data', 'w_data: time=' + Date.now());
            // console.log(window.refreshList());
            // window.refreshList();
            const button_group_bid = document.createElement("button");
                button_group_bid.classList.add("btn-green", "btn-modal");
                button_group_bid.textContent = "開標";
                button_group_bid.dataset.role = 'bid';
                button_group_bid.dataset.relSid = searchParams['sid'];
                button_group_bid.dataset.next_gid =searchParams['next_gid']

            modal_view.list_container.button_region.appendChild(button_group_bid);

            const button_manual_bid = document.createElement("button");
                button_manual_bid.classList.add("btn-orange", "btn-modal");
                button_manual_bid.textContent = "指定抽籤";
                button_manual_bid.dataset.role = 'manual_bid';
                button_manual_bid.dataset.relSid = searchParams['sid'];
                button_manual_bid.dataset.next_gid =searchParams['next_gid']

            modal_view.list_container.button_region.appendChild(button_manual_bid);
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
