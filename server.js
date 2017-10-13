'use strict';

var browserSync = require('browser-sync').create();
var http = require('http');
var URL = require('url').URL;

var dev = {0: new URL('http://uat.hengtech.com.cn/pmsSrv/api/api!gateway.action')};
var runRul = dev[0];	// TODO: 调试修改这里

var proxySrv = function(req, res) {
	var options = {
        hostname: runRul.host,
		port: 80,
        path: runRul.pathname,
		method: 'POST'
	};

	var apiReq = http.request(options, apiRes => {
		apiRes.setEncoding('utf8');
		apiRes.on('data', data => {
			console.log('response data =>\n', data);
			res.write(data);
		}).on('end', () => {
			res.end()
		});
	});

	req.addListener('data', data => {
		console.log('request data =>', data.toString());
		apiReq.write(data);
	});
	req.addListener('end', () => {
		apiReq.end();
	});
};

browserSync.init({
	server: {
		baseDir: './',
		index: 'index.html',
		middleware: function(req, res, next) {
			if (req.url.match(/^\/api/)) {
                console.log('req.url => ' + req.url);
				proxySrv(req, res);
				return;
			}
			next();
		}
	}
});