const AS_URL = 'https://ai-designer.io';
const DLPS_URL = 'https://ai-designer.io';
const IS_URL = 'https://ai-designer.io';

serialize = function(obj) {
	var str = [];
	for (var p in obj)
		if (obj.hasOwnProperty(p)) {
			str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
		}
	return str.join("&");
}

function getParamInUrl(name, url = window.location.href) {
	name = name.replace(/[\[\]]/g, '\\$&');
	var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
	results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

var restapi = {
	get: function(url, path, query, token, redirectUrl401, succeed, fail) {
		var queryStr = serialize(query);
		if (queryStr) { queryStr = '?'+queryStr; }
		var url = url+path+queryStr;

		var http = new XMLHttpRequest();
		http.open('GET', url, true);
		http.setRequestHeader('Authorization', 'Bearer '+localStorage.getItem('TOKEN'));
		http.onreadystatechange = function() {
			if(http.readyState == 4) {
				if (http.status == 401) {
					location.href = redirectUrl401;
					return;
				}

				try { var msg = JSON.parse(http.responseText); }
				catch (e) {
					fail({msgCode: 2001, msgResp: 'Exception: parse JSON'})
					return;
				}

				var msg = JSON.parse(http.responseText);
				if (msg.msgCode == 1000) {
					succeed(msg.msgResp);
				}
				else {
					fail(msg);
				}
			}
		}
		http.send();
	},
	post: function(url, path, query, jParams, token, redirectUrl401, succeed, fail) {
		var queryStr = serialize(query);
		if (queryStr) { queryStr = '?'+queryStr; }
		var url = url+path+queryStr;

		var http = new XMLHttpRequest();
		http.open('POST', url, true);
		http.setRequestHeader('Content-type', 'application/json');
		if (token) {
			http.setRequestHeader('Authorization', 'Bearer '+token);
		}
		
		http.onreadystatechange = function() {
			if(http.readyState == 4) {
				if (http.status == 401) {
					location.href = redirectUrl401;
					return;
				}

				try { var msg = JSON.parse(http.responseText); }
				catch (e) {
					fail({msgCode: 2001, msgResp: 'Exception: parse JSON'})
					return;
				}

				if (msg.msgCode == 1000) {
					succeed(msg.msgResp);
				}
				else {
					fail(msg);
				}
			}
		}
		http.send(jParams);
	},
	patch: function(url, path, query, jParams, token, redirectUrl401, succeed, fail) {
		var queryStr = serialize(query);
		if (queryStr) { queryStr = '?'+queryStr; }
		var url = url+path+queryStr;

		var http = new XMLHttpRequest();
		http.open('PATCH', url, true);
		http.setRequestHeader('Content-type', 'application/json');
		if (token) {
			http.setRequestHeader('Authorization', 'Bearer '+token);
		}
		
		http.onreadystatechange = function() {
			if(http.readyState == 4) {
				if (http.status == 401) {
					location.href = redirectUrl401;
					return;
				}

				try { var msg = JSON.parse(http.responseText); }
				catch (e) {
					fail({msgCode: 2001, msgResp: 'Exception: parse JSON'})
					return;
				}

				if (msg.msgCode == 1000) {
					succeed(msg.msgResp);
				}
				else {
					fail(msg);
				}
			}
		}
		http.send(jParams);
	},
	uploadImage: function(url, path, query, params, token, redirectUrl401, succeed, fail) {
		var queryStr = serialize(query);
		if (queryStr) { queryStr = '?'+queryStr; }
		var url = url+path+queryStr;

		var formData = new FormData();
		formData.append('type', params.type);
		formData.append('file', params.file);

		var http = new XMLHttpRequest();
		http.open('POST', url, true);
		if (token) {
			http.setRequestHeader('Authorization', 'Bearer '+token);
		}

		http.onreadystatechange = function() {
			if(http.readyState == 4) {
				if (http.status == 401) {
					location.href = redirectUrl401;
					return;
				}

				try { var msg = JSON.parse(http.responseText); }
				catch (e) {
					fail({msgCode: 2001, msgResp: 'Exception: parse JSON'})
					return;
				}

				if (msg.msgCode == 1000) {
					succeed(msg.msgResp);
				}
				else {
					fail(msg);
				}
			}
		}
		http.send(formData);
	},
	uploadFaceId: function(url, path, query, params, token, redirectUrl401, succeed, fail) {
		var queryStr = serialize(query);
		if (queryStr) { queryStr = '?'+queryStr; }
		var url = url+path+queryStr;

		var formData = new FormData();
		formData.append('id', params.id);
		formData.append('file', params.file);

		var http = new XMLHttpRequest();
		http.open('POST', url, true);
		if (token) {
			http.setRequestHeader('Authorization', 'Bearer '+token);
		}

		http.onreadystatechange = function() {
			if(http.readyState == 4) {
				if (http.status == 401) {
					location.href = redirectUrl401;
					return;
				}

				try { var msg = JSON.parse(http.responseText); }
				catch (e) {
					fail({msgCode: 2001, msgResp: 'Exception: parse JSON'})
					return;
				}

				if (msg.msgCode == 1000) {
					succeed(msg.msgResp);
				}
				else {
					fail(msg);
				}
			}
		}
		http.send(formData);
	},
	delete: function(url, path, query, token, redirectUrl401, succeed, fail) {
		var queryStr = serialize(query);
		if (queryStr) { queryStr = '?'+queryStr; }
		var url = url+path+queryStr;

		var http = new XMLHttpRequest();
		http.open('DELETE', url, true);
		http.setRequestHeader('Authorization', 'Bearer '+localStorage.getItem('TOKEN'));
		http.onreadystatechange = function() {
			if(http.readyState == 4) {
				if (http.status == 401) {
					location.href = redirectUrl401;
					return;
				}

				try { var msg = JSON.parse(http.responseText); }
				catch (e) {
					fail({msgCode: 2001, msgResp: 'Exception: parse JSON'})
					return;
				}

				var msg = JSON.parse(http.responseText);
				if (msg.msgCode == 1000) {
					succeed(msg.msgResp);
				}
				else {
					fail(msg);
				}
			}
		}
		http.send();
	},
}

if (!window.location.pathname.includes('/sign-in') && !window.location.pathname.includes('/sign-up')) {
	localStorage.setItem('REDIRECT_URL', window.location);
}
