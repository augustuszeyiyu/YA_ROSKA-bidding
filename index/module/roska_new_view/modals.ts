"use strict";
(async () => {
    const TAG = 'roska_bid_view';
    const LANG_NAME_MAP = { en_us: '英文', zh_tw: '繁體中文', zh_cn: '簡體中文' };
    ///****待修改****///
    const STATE = {
        query: {},
        cursor: null
    };
    const modules = window.modules;
    const viewport = window.viewport;
    const view = viewport.roska_bid_view;
    const loading_overlay = window.loading_overlay;
    modules.push({
        init: async function () {
            const [{ element: layout }] = await window.resources([
                { type: 'html', path: './module/roska_new_view/module.html' },
                { type: 'css', path: './module/roska_new_view/module.css' }
            ]);
            view.element.innerHTML = layout.innerHTML;
            view.relink();
            layout.remove();
        }
    });
    // console.log('789');
    // console.log(view.group_members_table);
    view
        .on('view-state', (e:any) => {
        if (e.state !== "show")
            return;
        loading_overlay.Show();

        ResetPage(); 
        list_new_group_serial()
            .catch((e) => {
            console.error(e);
            // alert(`載入失敗！(${e.message})`);
            window.HandleUnauthorizedAccess(e);
        })
            .finally(() => {
            loading_overlay.Hide();
        });

    });
    async function list_new_group_serial() {

        
        // const list_data = await ROSKA_FORM.Get_new_list();
        // const { region_list: list, total_records,tmpl_item  } = view.list_container;


        const accessor = view.group_members_table;


        // const testname = document.createElement("div");
        // const testtext = document.createTextNode("測試打電話");
        // testname.appendChild(testtext);

        // const member_cheque_name = accessor.member_cheque_name;
        // member_cheque_name.appendChild(testname);

        const content_501p = accessor.content_501p;
        var content_501p_content = document.createElement("p");
        var content_501p_content01 = document.createElement("p");

        var bid_person = "楊威力";

        content_501p_content01.innerHTML="本票<br>"
        content_501p_content.innerHTML="發票取得人"+bid_person+"永康合會YA013會組，第12期得標金。須依據合會契約，自民國112年9月10日起，至民國113年8月10日止，於每月13日前，無條件支付會首楊勝凱先生，或其他指定人，每期會款五千元整，總計12期，匯款金額:陸萬元整。發票人如有一期未按時支付會款時，則其餘各期會款，均視同全部到期，無條件憑票一次支付其餘各期的全部匯款金額。如發票人未履行上述支付義務，發票人同意鍾家支付雙方法律訴訟的相關費用，新台幣三萬元整。";
       
        content_501p.appendChild(content_501p_content01);
        content_501p.appendChild(content_501p_content);


        const tmpl_item = accessor.info_tmpl_item;




        accessor.relink();
    }
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
            const accessor = view.group_members_table;
            accessor.content_501p.innerHTML = '';
            // accessor.member_cheque_name.innerHTML = '';
        }
        // {
        // 	const accessor = view.region_info;
        // 	accessor.element.addClass('hide');
        // }
    }
})();
