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
    const modal_view = window.modal_view;
    modals.push({
        init: async function () {
            const [{ element: layout }] = await window.resources([
                { type: 'html', path: './modal/group_view/modal.html' },
                { type: 'css', path: './modal/group_view/modal.css' }
            ]);
            modal_view.element.innerHTML = layout.innerHTML;
            modal_view.relink();
            layout.remove();
        }
    });

    (() => {
        modal_view
            .on('view-state', (e:any) => {
            if (e.state !== "show")
                return;
            loading_overlay.Show();

            ResetPage(); 
            list_group_info()
                .catch((e) => {
                console.error(e);
                alert(`載入失敗！(${e.message})`);
                window.HandleUnauthorizedAccess(e);
            })
                .finally(() => {
                loading_overlay.Hide();
            });

        });
        async function list_group_info() {

            
            // const list_data = await ROSKA_FORM.Get_new_list();
            // const { region_list: list, total_records,tmpl_item  } = view.list_container;

            const InputParams = new URLSearchParams(window.location.search);
            const searchParams: Array<string> = [];
            InputParams.forEach((key ,value:any)=>{
                    searchParams[value]=key;
            });

            const accessor = modal_view.group_members_table;
            console.log(modal_view);
            console.log(searchParams);
            console.log(modal_view.group_members_table);


            // const testname = document.createElement("div");
            // const testtext = document.createTextNode("測試打電話");
            // testname.appendChild(testtext);

            // const member_cheque_name = accessor.member_cheque_name;
            // member_cheque_name.appendChild(testname);

            const content_501p = accessor.content_501p;
            var content_501p_content = document.createElement("p");
            var content_501p_content01 = document.createElement("p");

            var bid_person = "楊聖凱";

            content_501p_content01.innerHTML="本票<br>"
            content_501p_content.innerHTML="發票取得人"+bid_person+"永康合會YA013會組，第12期得標金。須依據合會契約，自民國112年9月10日起，至民國113年8月10日止，於每月13日前，無條件支付會首楊勝凱先生，或其他指定人，每期會款五千元整，總計12期，匯款金額:陸萬元整。發票人如有一期未按時支付會款時，則其餘各期會款，均視同全部到期，無條件憑票一次支付其餘各期的全部匯款金額。如發票人未履行上述支付義務，發票人同意鍾家支付雙方法律訴訟的相關費用，新台幣三萬元整。";
        
            content_501p.appendChild(content_501p_content01);
            content_501p.appendChild(content_501p_content);


            const tmpl_item = accessor.info_tmpl_item;




            accessor.relink();
        }
    })();
    (() => {
        // console.log('456');
        // console.log(view.group_members_table);
        // view.member_cheque_name ='123';
        // const accessor =view;
        // console.log(window); 
    })();
    function ResetPage() {
        STATE.cursor = null;
        STATE.query = {};

        {
            const accessor = modal_view.group_members_table;
            console.log(accessor);
            // accessor.content_501p.innerHTML = '';
            // accessor.member_cheque_name.innerHTML = '';
        }
        // {
        // 	const accessor = view.region_info;
        // 	accessor.element.addClass('hide');
        // }
    }
})();
