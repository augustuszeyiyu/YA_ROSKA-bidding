(async () => {
	const TAG = 'init';
	const COOKIE_ACCESS_TOKEN = 'ROSKA_FORM_admin_access_token';

	// REGION: [ Initialization ]
	const WEBSITE_URL = window.WEBSITE_URL;
	// console.log(`[${TAG}] Website url:`, WEBSITE_URL);
	ROSKA_FORM.Session.Init(WEBSITE_URL);

	const { resolve, promise } = ROSKA_FORM.Tools.FlattenPromise<void>();
	window.WaitAuthorization = () => promise;	
	// ENDREGION
	const viewport = window.viewport;
	const accessor = window.login_overlay;
	const loading_overlay = window.loading_overlay;
	{
		const [{ element: layout }] = await window.resources([
			{ type: 'html', path: './module/init/module.html' },
			{ type: 'css', path: './module/init/module.css' }
		]);
		
		accessor.element.innerHTML = layout.innerHTML;	
		accessor.relink();
		layout.remove();	
	}


    const PageLogin = new ROSKA_FORM.PageController({ viewport: accessor.element });
    const captcha_getin_result = await ROSKA_FORM.Session.GetCaptcha();
    accessor.captcha_getin.innerHTML= captcha_getin_result.img;

    accessor.account.value='F1123456789';
    accessor.password.value='A1234567';

    // REGION: [ Login from access_token ]

	const access_token = Cookies.get(COOKIE_ACCESS_TOKEN);
	if (access_token) {
		try {
			loading_overlay.Show();
			await ROSKA_FORM.Session.Login({ access_token });

			resolve();
			PageLogin.Hide();
		}
		catch (e: any) {
			alert(`登入失敗！(${e.message})`);
			console.error(`[${TAG}]`, e);
		}
		finally {
			loading_overlay.Hide();
		}
	}
	// ENDREGION
	// REGION: [ Login from account and password ]
	accessor.btn_login.onclick = async () => {
		const nid = accessor.account.value;
		const password = accessor.password.value;
		const captcha = accessor.captcha.value;
		if (!nid || !password) {
			alert('請輸入帳號密碼登入！');
			return;
		}
		if (!captcha) {
			alert('請輸入驗證碼！');
			return;
		}

		try {
			loading_overlay.Show();
			let result = await ROSKA_FORM.Session.Login({ nid, password, captcha }).catch((e: Error) => e);

			if (result instanceof Error) {
				// @ts-ignore
				switch (result.code) {
					case ROSKA_FORM.ErrorMap.LoginError.TOTP_REQUIRE.code: {
						const totp = prompt('請輸入 Authenticator 驗證碼');
						
						if (!totp) {
							alert('請輸入 Authenticator 驗證碼！');
							return;
						}

						result = await ROSKA_FORM.Session.Login({ nid, password, captcha });
					}
						break;
					default:
						throw result;
				}
			}
			resolve();
			PageLogin.Hide();
			// NOTE: Set session cookies to keep login state before current session ends
			Cookies.set(COOKIE_ACCESS_TOKEN, result.access_token, { secure: true, sameSite: 'strict' });
		}
		catch (e: any) {
			// alert(`登入失敗！(${e.message})`);
			console.error(`[${TAG}]`, e);
		}
		finally {
			loading_overlay.Hide();
		}
	};
	// ENDREGION
	{
		viewport
			.on('show-login-page', () => {
				PageLogin.Show();
			})
			.on('logout', async (_e:any) => {
				do_logout();
			});


		window.HandleUnauthorizedAccess = (error: any) => {
			switch (error.code) {
				case ROSKA_FORM.ErrorMap.ErrorCode.UNAUTHORIZED: {
					viewport.emit('show-login-page');
				}
					break;
				default:
					break;
			}
		};
	}

    async function do_logout() {
        try {
            let result = await ROSKA_FORM.Session.Logout();
            if (result === false) {
                window.location.reload();
            }
        }
        catch (e:any) {
            alert(`登出失敗(${e.message})`);
            console.error(`[${TAG}]`, e);
        }
    }



	// REGION: [ Wait authorization, load modules and landing to main page ]
	{
		await window.WaitAuthorization();



		const modules: typeof window.modules = window.modules = [];
		const module_names = [
			'members_view',
			'member_pay_view',
			'roska_continue_view',
			'roska_end_view',
			'roska_new_view',
			'roska_bid_view',
			'profit_view',
			'sysvar_view',
			// 'dashboard',
		];
		const paths: {
			path: string;
			type: 'js';
		}[] = [];

		for (const name of module_names) {
			paths.push({ path: `./module/${name}/module.js`, type: 'js' });
		}
		await resources(paths);
		const promises = [];
		for (const module of modules) {
			promises.push(module.init());
		}
		await Promise.wait(promises);



		const tabbars = document.querySelector('.tabbars');
		if (tabbars) {
			tabbars.children[0].emit('click');
		}
		viewport.removeClass('hide');
	}
	// ENDREGION
})();
