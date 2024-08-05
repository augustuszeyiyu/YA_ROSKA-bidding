"use strict";
// (async () => {
( () => {
    const TAG = 'member_detail';
    const LANG_NAME_MAP = { en_us: '英文', zh_tw: '繁體中文', zh_cn: '簡體中文' };
    ///****待修改****///
    const STATE = {
        query: {},
        cursor: null
    };
    const modals = window.modals;
    const loading_overlay = window.loading_overlay;
    const view = window.modal_view;
    const modal_view = view.member_detail;
    modals.push({
        init: async function () {
            const [{ element: layout }] = await window.resources([
                { type: 'html', path: './modal/member_detail/modal.html' },
                { type: 'css', path: './modal/member_detail/modal.css' }
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
        // loading_overlay.Show();
        // ResetPage(); 
        list_user_info()
            .catch((e) => {
            console.error(e);
            alert(`載入失敗！(${e.message})`);
            window.HandleUnauthorizedAccess(e);
            })
            .finally(() => {
            loading_overlay.Hide();
            });

        // })

        // .on('click', async(e:any)=>{
        //     const trigger = e.target;
        //     const card = trigger.closest('.Card');       
        //     if ( !card) return;         
        //     switch(card.dataset.role) {
        //         case "bid": {
        //             // window.location.href = "/admin/member/info/" + row.dataset.relId;
        //             window.open("./"+'?'+ 'sid='+card.dataset.relId , 'innerHeight=1600' ,'innerWidth=800',);
        //             // window.open("./module/roska_new_view/modals.html" + button.dataset.relId, innerHeight=1600,innerWidth=800,);
        //             break;
                    
        //         }
        //         case "view_group": {
        //             // window.location.href = "/admin/member/info/" + row.dataset.relId;
        //             console.log('test');
        //             window.open("./"+'?'+ 'sid='+card.dataset.sid +'&'+'modal=group_view', 'innerHeight=800' ,'innerWidth=800',);
        //             // window.open("./module/roska_new_view/modals.html" + button.dataset.relId, innerHeight=1600,innerWidth=800,);
        //             break;
                    
        //         }
                
        //         default:
        //             alert("您沒有權限使用該功能！\\n請使用更高權限等級的帳號執行此操作！");
        //             return;/
        //     }
        });
        
    async function list_user_info() {
        const InputParams = new URLSearchParams(window.location.search);
        // const searchParams: Array<string> = [];
        console.log(InputParams);
        var searchParams: any = {};
        InputParams.forEach((key ,value:any)=>{
                searchParams[value]=key;
                console.log(searchParams[value]);
        });
        if(!searchParams['uid'])
        return;
        const list_data = await ROSKA_FORM.Get_user(searchParams['uid']);
        let list_region = modal_view.list_container;
        // console.log(list_data);
        if (list_data) {
            list_region.member_content.name.value = list_data.name;
            list_region.member_content.nid.value = list_data.nid;   
            list_region.member_content.gender.value = list_data.gender;
            list_region.member_content.contact_home_number.value = list_data.contact_home_number;
            list_region.member_content.contact_mobile_number.value = list_data.contact_mobile_number;
            list_region.member_content.birth_date.value = list_data.birth_date.slice(0,10);
            list_region.member_content.address.value = list_data.address;

            list_region.recommendation_info.emergency_contact.value = list_data.emergency_contact||"";
            list_region.recommendation_info.emergency_nid.value = list_data.emergency_contact_nid||"";
            list_region.recommendation_info.emergency_contact_number.value = list_data.emergency_contact_number||"";
            list_region.recommendation_info.emergency_contact_relation.value = list_data.emergency_contact_relation||"";
            list_region.recommendation_info.referrer_mobile_number.value = list_data.referrer_mobile_number||"";
            list_region.recommendation_info.volunteer_mobile_number.value = list_data.volunteer_mobile_number||"";

            list_region.bank_info_content.bank_code.value = list_data.bank_code;
            list_region.bank_info_content.branch_code.value = list_data.branch_code;
            list_region.bank_info_content.bank_account_number.value = list_data.bank_account_number;
            list_region.bank_info_content.bank_account_name.value = list_data.bank_account_name;

            list_region.update_time.value = list_data.update_time;
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
