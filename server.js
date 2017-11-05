'use strict';

/**
 * http://xxx.com/
 * @param req
 * @param res
 *
 * 调试方法：
 * 修改 runRul 参数
 */
var browserSync = require('browser-sync').create();
var http = require('http');
var URL = require('url').URL;

var dev = {
    1: new URL('http://uat.hengtech.com.cn/pmsSrv/api/api!gateway.action'),
	5: new URL('http://gzh.cs229.com')
};
var runRul = dev[5];

var proxySrv = function(req, res) {
    console.log('\n req => \n', req, '\n');

    var options = {
        hostname: runRul.host,
        port: 80,
        path: runRul.pathname + '/web' + req.originalUrl,
        // path: '/pmsSrv' +  req.url,
        // path: req.url.replace(/^\/api/,''),
        // method: 'POST'
        method: 'GET'
    };

    console.info('\nproxySrv Start...\n'+ 'hostname => ' + options.hostname + '\n', 'path => ' + options.path);

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
        console.log('request data =>', data.toString() + '\n');
        apiReq.write(data);
    });
    req.addListener('end', () => {
        apiReq.end();
    });
};

browserSync.init({
    server: {
        baseDir: './',
        // directory: true,
        // startPath: "/index.html",
        index: 'index.html',
        middleware: function(req, res, next) {
            console.log(req, '\n');
            if (req.url.match(/api/)) {
                console.log('req.url => ' + req.url, '\n');
                proxySrv(req, res);
                return;
            }
            next();
        }
    }
});