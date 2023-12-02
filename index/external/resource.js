/**
 *	Author: JCloudYu
 *	Create: 2020/06/28
**/
(()=>{
	"use strict";
	
	
	const exported = {};
	
	
	(()=>{
		// See http://www.isthe.com/chongo/tech/comp/fnv/#FNV-param for the definition of these parameters;
		const FNV_PRIME_HIGH = 0x0100, FNV_PRIME_LOW = 0x0193;	// 16777619 0x01000193
		const OFFSET_BASIS = (new Uint8Array([0xC5, 0x9D, 0x1C, 0x81])).buffer;	// 2166136261 [0x81, 0x1C, 0x9D, 0xC5]
		const HOSTNAME_CANDIDATES = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWZYZ_-";
		const BASE32_MAP = "0123456789abcdefghijklmnopqrstuv".split('');
		const {PID, PPID, MACHINE_ID} = (()=>{
			const host = (typeof window !== "undefined") ? window.location.host : (()=>{
				let count = 30, str = '';
				while(count-- > 0) {
					str += HOSTNAME_CANDIDATES[(Math.random() * HOSTNAME_CANDIDATES.length)|0]
				}
				return str;
			})();
			
			return {
				MACHINE_ID: fnv1a32(host),
				PID: (Math.random() * 65535)|0,
				PPID: (Math.random() * 65535)|0
			};
		})();
		let SEQ_NUMBER = Math.floor(Math.random() * 0xFFFFFFFF);
		
		exported.GenInstId = function GenInstId() {
			const time	= Date.now();
			const time_upper = Math.floor(time/0xFFFFFFFF);
			const time_lower = time%0xFFFFFFFF;
			const inc	= (SEQ_NUMBER=(SEQ_NUMBER+1) % 0xFFFFFFFF);
			const buff	= new Uint8Array(20);
			const view	= new DataView(buff.buffer);
			
			view.setUint32(0, time_upper, false);		// [0-3] epoch time upper
			view.setUint32(4, time_lower, false);		// [4-7] epoch time lower
			buff.set(new Uint8Array(MACHINE_ID), 8);	// [8-11] machine id
			view.setUint16(12, PPID, false);			// [12-13] ppid
			view.setUint16(14, PID,  false);			// [14-15] pid
			view.setUint32(16, inc,	 false);			// [16-19] seq
			
			
			
			return Base32Encode(buff.buffer);
		}
		
		
		
		
		function ExtractArrayBuffer(content) {
			if ( content instanceof ArrayBuffer ) {
				return content;
			}
			
			if ( typeof Buffer !== "undefined" ) {
				content = new Uint8Array(content);
			}
			
			if ( ArrayBuffer.isView(content) ) {
				return content.buffer;
			}
		}
		function fnv1a32(input){
			let octets = new Uint8Array(ExtractArrayBuffer(input));
			
			const HASH_RESULT = new Uint32Array(OFFSET_BASIS.slice(0));
			const RESULT_PROC = new Uint16Array(HASH_RESULT.buffer);
			for( let i = 0; i < octets.length; i += 1 ) {
				HASH_RESULT[0] = HASH_RESULT[0] ^ octets[i];
				
				let hash_low = RESULT_PROC[0], hash_high = RESULT_PROC[1];
				
				RESULT_PROC[0] = hash_low * FNV_PRIME_LOW;
				RESULT_PROC[1] = hash_low * FNV_PRIME_HIGH + hash_high * FNV_PRIME_LOW + (RESULT_PROC[0]>>>16);
			}
			return HASH_RESULT.buffer;
		}
		function Base32Encode(input, map=null) {
			input = ExtractArrayBuffer(input);
			
			
			let inputData = new Uint8Array(input);
			if ( inputData.length < 1 ) return '';
			
			
			const CVT_MAP = map ? map.split('') : BASE32_MAP;
			
			
			
			// Run complete bundles
			let encoded = '';
			let begin, loop = Math.floor(inputData.length/5);
			for (let run=0; run<loop; run++) {
				begin = run * 5;
				encoded += CVT_MAP[  inputData[begin]           >> 3];								// 0
				encoded += CVT_MAP[ (inputData[begin  ] & 0x07) << 2 | (inputData[begin+1] >> 6)];	// 1
				encoded += CVT_MAP[ (inputData[begin+1] & 0x3E) >> 1];								// 2
				encoded += CVT_MAP[ (inputData[begin+1] & 0x01) << 4 | (inputData[begin+2] >> 4)];	// 3
				encoded += CVT_MAP[ (inputData[begin+2] & 0x0F) << 1 | (inputData[begin+3] >> 7)];	// 4
				encoded += CVT_MAP[ (inputData[begin+3] & 0x7C) >> 2];								// 5
				encoded += CVT_MAP[ (inputData[begin+3] & 0x03) << 3 | (inputData[begin+4] >> 5)];	// 6
				encoded += CVT_MAP[  inputData[begin+4] & 0x1F];										// 7
			}
			
			// Run remains
			let remain = inputData.length % 5;
			if ( remain === 0 ) { return encoded; }
			
			
			begin = loop*5;
			if ( remain === 1 ) {
				encoded += CVT_MAP[  inputData[begin]           >> 3];								// 0
				encoded += CVT_MAP[ (inputData[begin  ] & 0x07) << 2];								// 1
			}
			else
			if ( remain === 2 ) {
				encoded += CVT_MAP[  inputData[begin]           >> 3];								// 0
				encoded += CVT_MAP[ (inputData[begin  ] & 0x07) << 2 | (inputData[begin+1] >> 6)];	// 1
				encoded += CVT_MAP[ (inputData[begin+1] & 0x3E) >> 1];								// 2
				encoded += CVT_MAP[ (inputData[begin+1] & 0x01) << 4];								// 3
			}
			else
			if ( remain === 3 ) {
				encoded += CVT_MAP[  inputData[begin]           >> 3];								// 0
				encoded += CVT_MAP[ (inputData[begin  ] & 0x07) << 2 | (inputData[begin+1] >> 6)];	// 1
				encoded += CVT_MAP[ (inputData[begin+1] & 0x3E) >> 1];								// 2
				encoded += CVT_MAP[ (inputData[begin+1] & 0x01) << 4 | (inputData[begin+2] >> 4)];	// 3
				encoded += CVT_MAP[ (inputData[begin+2] & 0x0F) << 1];								// 4
			}
			else
			if ( remain === 4 ) {
				encoded += CVT_MAP[  inputData[begin]           >> 3];								// 0
				encoded += CVT_MAP[ (inputData[begin  ] & 0x07) << 2 | (inputData[begin+1] >> 6)];	// 1
				encoded += CVT_MAP[ (inputData[begin+1] & 0x3E) >> 1];								// 2
				encoded += CVT_MAP[ (inputData[begin+1] & 0x01) << 4 | (inputData[begin+2] >> 4)];	// 3
				encoded += CVT_MAP[ (inputData[begin+2] & 0x0F) << 1 | (inputData[begin+3] >> 7)];	// 4
				encoded += CVT_MAP[ (inputData[begin+3] & 0x7C) >> 2];								// 5
				encoded += CVT_MAP[ (inputData[begin+3] & 0x03) << 3];								// 6
			}
			
			return encoded;
		}
	})();
	(()=>{
		const {GenInstId} = exported;
		const A_TAG = document.createElement( "a" );
		
		exported.dimport = function(module_url, options={ref_path:null, cross_origin:false, use_credentials:false}) {
			return new Promise((resolve, reject)=>{
				let _ref_path;
				if ( Object(options) === options ) {
					_ref_path = options.ref_path || null;
				}
				else {
					_ref_path = options;
					options = {cross_origin:false, use_credentials:false};
				}
			
			
			
				const ref_path = _ref_path;
				const abs_url = ref_path ? RESOLVE_PARENT_PATH(module_url, ref_path) : TO_ABSOLUTE_URL(module_url);
				const abs_dir = abs_url.substring(0, abs_url.lastIndexOf('/'));
				const inject_point = '_' + GenInstId();
				const element = document.createElement( 'script' );
				const destruct=()=>{
					delete window[inject_point];
					element.onerror = null;
					element.onload = null;
					element.remove();
					URL.revokeObjectURL(element.src);
					element.src = "";
				};
				
				
				
				if ( options.cross_origin || options.use_credentials ) {
					element.setAttribute( 'crossorigin', options.use_credentials ? 'use-credentials' : '' );
				}
				
				element.defer = true;
				element.type = "module";
				element.onload=()=>{
					resolve(window[inject_point]);
					destruct();
				};
				element.onerror=(e)=>{
					reject(e);
					destruct();
				};
				element.src = URL.createObjectURL(new Blob([
		`import * as m from "${abs_url}";
		if ( Object(m) === m && typeof m._meta !== "undefined" ) {
			m._meta.__filename = "${abs_url}";
			m._meta.__dirname  = "${abs_dir}";
		}
		window.${inject_point} = m;
		`
		], {type:'application/javascript'}));
				
				document.querySelector( 'body' ).appendChild(element);
			});
		}
		
		function TO_ABSOLUTE_URL(url) {
			A_TAG.setAttribute( "href", url );	//	<a href="xxx.html">
			return A_TAG.cloneNode(false).href;	//		-> "http://example.com/xxx.html"
		}
		function RESOLVE_PARENT_PATH(module_url, ref_path) {
			// NOTE: Detect if module_url is absolute
			try { new URL(module_url); return module_url; } catch(e) {}
		
			// NOTE: Detect if ref_path is absolute
			try { ref_path = new URL(ref_path); }
			catch(e) { throw new Error( "Given ref_path must be a complete url!" ); }
			
			
			
			// NOTE: If module_url contains a root path
			if ( module_url[0] === "/" ) { // module_path: /a/b/c/d
				return `${ref_path.origin}${module_url}`;
			}
			
			// NOTE: Resolve path
			const pos = ref_path.pathname.lastIndexOf( '/' );
			if ( pos >= 0 ) {
				ref_path.pathname = ref_path.pathname.substring(0, pos+1);
			}
			
			ref_path.pathname = RESOLVE_RELATIVE(`${ref_path.pathname}${module_url}`);
			return ref_path.href;
		}
		function RESOLVE_RELATIVE(relative) {
			var stack = [], parts = relative.split("/");
			
			for( var i = 0; i < parts.length; i++ ){
				if( parts[i] === "." )
					continue;
				
				if( parts[i] === ".." )
					stack.pop();
				else
					stack.push(parts[i]);
			}
			
			return stack.join("/");
		}
	})();
	(()=>{
		const {GenInstId, dimport} = exported;
		const RES_TYPE = {
			CSS: 1,
			HTML: 2,
			HTML_TEMPLATE:3,
			JS: 4,
			SHADOWED_JS: 5,
			ES_MODULE: 6,
			IMAGE: 7
		};
		
		const LoadResource = exported.resources = async function(...args) {
			if ( Array.isArray(args[0]) ) { args = args[0]; }
			
			
			
			const _promises = [];
			for(const resource of args) {
				const RES_ID = '_' + GenInstId();
				let injectBody = true;
				
				let type, path, important, shadow, reference;
				if ( typeof resource === 'string' ) {
					([type, path, important, shadow, reference] = ['js', resource, true, {}, null]);
				}
				else {
					({type, path, important, shadow={}, ref:reference=null} = resource);
				}
				
				
				type = type.trim().split(' ');
				
				// region [ Prepare basic loading promise ]
				const R_PROMISE = new Promise((resolve, reject)=>{
					let element = null;
					switch( type[0] ) {
						case "css": {
							injectBody = false;
						
							element = document.createElement( 'link' );
							element.rel	 = "stylesheet";
							element.type = "text/css";
							element.href = path;
							
							element.onload  = ()=>resolve({type:RES_TYPE.CSS, result:element});
							element.onerror = reject;
							break;
						}
						case "module": {
							dimport(path, reference)
							.then((imported)=>resolve({type:RES_TYPE.ES_MODULE, result:imported}))
							.catch(reject);
							break;
						}
						case "js": {
							if ( type[1] !== "shadow" ) {
								element = document.createElement( 'script' );
								element.type = "application/javascript";
								element.src = path;
								
								element.onload = ()=>resolve({type:RES_TYPE.JS, result:element});
								element.onerror = reject;
							}
							else {
								AJAXFetch( path, {
									method:'get',
									credentials:"same-origin",
									cache:"no-cache"
								}).then((res)=>{
									return res.text().then((ctnt)=>{
										const arg_names = [];
										const invoke_args = [];
										for(const var_name in shadow) {
											if ( !shadow.hasOwnProperty(var_name) ) continue;
											arg_names.push(var_name);
											invoke_args.push(shadow[var_name]);
										}
										arg_names.push(ctnt);
										
										const func = new Function(...arg_names);
										resolve({type:RES_TYPE.SHADOWED_JS, result:func(...invoke_args)});
									});
								}, reject);
							}
							break;
						}
						case "html": {
							element = document.createElement( 'script' );
							element.type = "text/html";
		
							AJAXFetch( path, {
								method:'get',
								credentials:"same-origin",
								cache:"no-cache"
							}).then((res)=>{
								return res.text().then((ctnt)=>{
									if ( type[1] === "exp-template" ) {
										const arg_names = [];
										arg_names.push('data');
										arg_names.push(`return \`${ctnt}\``);
		
										const func = new Function(...arg_names);
										resolve({type:RES_TYPE.HTML_TEMPLATE, result:func})
									}
									else {
										element.innerHTML = ctnt;
										resolve({type:RES_TYPE.HTML, result:element});
									}
								});
							}, reject);
							break;
						}
						case "img": {
							element = new Image();
							element.src = path;
							element.style.display='none';
							
							element.onload	= ()=>resolve({type:RES_TYPE.IMAGE, result:element});
							element.onerror = reject;
							break;
						}
						default: {
							return reject(new TypeError( `Given resource type ${type[0]} is not supported!` ));
						}
					}
					
					if ( element ) {
						element.setAttribute( 'data-important', important ? "1" : "0" );
						element.id = RES_ID;
						document.querySelector(injectBody ? 'body' : 'head').appendChild(element);
					}
				});
				// endregion
			
			
				// region [ Register promise ]
				_promises.push(R_PROMISE.then(
					({type:res_type, result})=>{
						const ret_val = {
							loaded:true,
							id:RES_ID
						};
					
						switch(res_type) {
							case RES_TYPE.HTML:
							case RES_TYPE.JS:
							case RES_TYPE.IMAGE:
							case RES_TYPE.CSS:
								Object.assign(ret_val, {
									element: result,
									result: RES_ID
								});
								break;
							
							case RES_TYPE.SHADOWED_JS:
								Object.assign(ret_val, {
									result
								});
								break;
							
							case RES_TYPE.ES_MODULE:
								Object.assign(ret_val, {
									exports: result,
									result
								});
								break;
							
							case RES_TYPE.HTML_TEMPLATE:
								Object.assign(ret_val, {
									tmpl: result,
									result
								});
								break;
						}
						
						return ret_val;
					},
					(e)=>{
						const result = {loaded:false, result:e};
						return (important) ? Promise.reject(result) : result;
					}
				));
				// endregion
			}
			
			
			
			return PromiseWait(_promises)
			.then((statuses)=>{
				return statuses.map((s)=>s.result);
			})
			.catch((statuses)=>{
				return Promise.reject(statuses.map((s)=>s.result));
			});
		}
		
		
		
		async function BatchResources(...args) {
			if ( Array.isArray(args[0]) ) { args = args[0]; }
			
			const RESOURCE_BATCH = [];
			const BATCH_RESULTS	 = [];
			let _previous_exec_result = null;
			
			
			
			for ( const arg of args ) {
				const type = typeof arg;
				if ( type === "string" || Object(arg) === arg ) {
					RESOURCE_BATCH.push(arg);
					continue;
				}
				
				if ( RESOURCE_BATCH.length > 0 ) {
					_previous_exec_result = null;
					const results = await LoadResource(RESOURCE_BATCH);
					for( let result of results ) {
						BATCH_RESULTS.push(result);
					}
					
					RESOURCE_BATCH.splice(0);
				}
				
				if ( type === "function" ) {
					_previous_exec_result = await arg(_previous_exec_result);
					BATCH_RESULTS.push(arg);
				}
				else {
					BATCH_RESULTS.push(null);
				}
			}
			
			if ( RESOURCE_BATCH.length > 0 ) {
				_previous_exec_result = null;
				try {
					const results = await LoadResource(RESOURCE_BATCH);
					for( let result of results ) {
						BATCH_RESULTS.push(result);
					}
				}
				catch(results) {
					for( let result of results ) {
						BATCH_RESULTS.push(result);
					}
					throw BATCH_RESULTS;
				}
			}
			
			
			
			return BATCH_RESULTS;
		}
		function PromiseWait(promises) {
			const _promises = [];
			for(const promise of promises) {
				_promises.push(
					Promise.resolve(promise)
						.then((r)=>{return {state:true, result:r}})
						.catch((e)=>{return {state:false, result:e}})
				);
			}
			
			return Promise.all(_promises).then((p)=>{
				let pass = true;
				for(const {state} of p) { pass = pass && state; }
				return pass ? Promise.resolve(p) : Promise.reject(p);
			});
		}


		const CAMEL_CASE_PATTERN = /(\w)(\w*)(\W*)/g;
		const CAMEL_REPLACER = (match, $1, $2, $3, index, input )=>{
			return `${$1.toUpperCase()}${$2.toLowerCase()}${$3}`;
		};
		const READY_STATE = Object.assign(Object.create(null), {
			UNSENT: 0,
			OPENED: 1,
			HEADERS_RECEIVED: 2,
			LOADING: 3,
			DONE: 4
		});





		function AJAXFetch(url, init={}) {
			let resolve=DO_NOTHING, reject=DO_NOTHING;
			const promise = new Promise((_res, _rej)=>{resolve=_res; reject=_rej;});
			
			
			
			const {
				mode='no-cors',
				method='GET',
				headers={},
				timeout=0,
				credentials='omit',
				body=null,
			} = init;
			const request = new XMLHttpRequest();
			promise.request = request;
			promise.promise = promise;
			
			
			
			
			request.addEventListener('readystatechange', (e)=>{
				switch( request.readyState ) {
					case READY_STATE.UNSENT:
						break;
						
					case READY_STATE.OPENED:
						request.withCredentials = (mode === 'cors') && (credentials === 'include' || credentials === 'same-origin' );
						request.timeout = timeout;
						request.responseType = 'blob';
						
						// NOTE: Set request headers
						for (const header_name in headers) {
							const normalize_header = header_name.replace(CAMEL_CASE_PATTERN, CAMEL_REPLACER);
							const value = headers[header_name];
							request.setRequestHeader( normalize_header, value );
						}
						break;
						
					case READY_STATE.HEADERS_RECEIVED:
						break;
						
					case READY_STATE.LOADING:
						break;
						
					case READY_STATE.DONE:
						break;
				}
			});
			request.addEventListener('timeout', ON_ERROR.bind(request, reject));
			request.addEventListener('abort', ON_ERROR.bind(request, reject));
			request.addEventListener('error', ON_ERROR.bind(request, reject));
			request.addEventListener('load', function(e) {
				const response_blob = request.response;
				const response = Object.assign(Object.create(null), {
					request,
					ok: (request.status >= 200 && request.status <= 299),
					status: request.status,
					statusText: request.statusText,
					url: request.responseURL,
					headers: request.getAllResponseHeaders(),
					text: async function(){
						const response_bytes = await READ_ARRAY_BUFFER_FROM_BLOB(response_blob);
						return UTF8Decode(response_bytes);
					},
					blob: function(){
						return response_blob;
					},
					arrayBuffer: function() {
						return READ_ARRAY_BUFFER_FROM_BLOB(response_blob);
					},
					json: async function(throw_if_error=true) {
						const response_bytes = await READ_ARRAY_BUFFER_FROM_BLOB(response_blob);
						
						try {
							return JSON.parse(UTF8Decode(response_bytes));
						}
						catch(e) {
							return throw_if_error ? Promise.reject(e) : undefined;
						}
					}
				});
				resolve(response);
			});
			request.addEventListener('progress', PROGRESS.bind(request, false));
			request.upload.addEventListener('progress', PROGRESS.bind(request, true));
			
			
			
			request.open( method, url, true );
			request.send( body );
			return promise;
		}



		function DO_NOTHING(){}
		function PROGRESS(upload, e) {
			const event = new Event( upload ? 'progress-up' : 'progress-down');
			Object.assign(event, {
				lengthComputable:e.lengthComputable,
				loaded:e.loaded,
				total:e.total
			});
			
			this.dispatchEvent(event);
		}
		function ON_ERROR(reject, e) {
			const response = Object.assign(Object.create(null), {
				request:this,
				error: e,
				ok: false
			});
			reject(response);
		}
		function READ_ARRAY_BUFFER_FROM_BLOB(blob) {
			return new Promise((resolve, reject)=>{
				const reader = new FileReader();
				reader.onerror = reject;
				reader.onload = ()=>resolve(reader.result);
				reader.readAsArrayBuffer(blob);
			});
		}
		function UTF8Decode(raw_bytes) {
			const UTF8_DECODE_CHUNK_SIZE = 100;

			raw_bytes = new Uint8Array(raw_bytes);
		
			let uint8 = raw_bytes;
			let codePoints = [];
			let i = 0;
			while( i < uint8.length ) {
				let codePoint = uint8[i] & 0xff;
				
				// 1-byte sequence (0 ~ 127)
				if( (codePoint & 0x80) === 0 ){
					codePoints.push(codePoint);
					i += 1;
				}
				// 2-byte sequence (192 ~ 223)
				else if( (codePoint & 0xE0) === 0xC0 ){
					codePoint = ((0x1f & uint8[i]) << 6) | (0x3f & uint8[i + 1]);
					codePoints.push(codePoint);
					i += 2;
				}
				// 3-byte sequence (224 ~ 239)
				else if( (codePoint & 0xf0) === 0xe0 ){
					codePoint = ((0x0f & uint8[i]) << 12)
						| ((0x3f & uint8[i + 1]) << 6)
						| (0x3f & uint8[i + 2]);
					codePoints.push(codePoint);
					i += 3;
				}
				// 4-byte sequence (249 ~ )
				else if( (codePoint & 0xF8) === 0xF0 ){
					codePoint = ((0x07 & uint8[i]) << 18)
						| ((0x3f & uint8[i + 1]) << 12)
						| ((0x3f & uint8[i + 2]) << 6)
						| (0x3f & uint8[i + 3]);
					codePoints.push(codePoint);
					i += 4;
				}
				else {
					i += 1;
				}
			}
			
			
			
			let result_string = "";
			while(codePoints.length > 0) {
				const chunk = codePoints.splice(0, UTF8_DECODE_CHUNK_SIZE);
				result_string += String.fromCodePoint(...chunk);
			}
			return result_string;
			}
	})();
	
	
	
	window.dimport   = exported.dimport;
	window.resources = exported.resources;
})();