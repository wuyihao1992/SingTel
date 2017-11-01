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
    0: new URL('http://192.168.1.90:10021/pmsSrv/api/api!gateway.action'),
    1: new URL('http://uat.hengtech.com.cn/pmsSrv/api/api!gateway.action'),
    2: new URL('http://train.hengtech.com.cn/pmsSrv/api/api!gateway.action'),
    3: new URL('http://wechat.kai-men.cn/pmsSrv/api/api!gateway.action'),
    4: new URL('http://srv.sit.hengtech.com.cn/'),
	5: new URL('http://gzh.cs229.com/')
};
var runRul = dev[5];	// TODO: 调试修改这里

console.log(runRul);

var proxySrv = function(req, res) {
    console.clear();

    console.log(req);

    var options = {
        hostname: runRul.host,
        port: 80,
        path: runRul.pathname + req.url,
        // path: '/pmsSrv' +  req.url,
        // path: req.url.replace(/^\/api/,''),
        // method: 'POST'
        method: 'GET'
    };

    console.info('\nproxySrv Start...\n'+ 'hostname => ' + options.hostname, 'path => ' + options.path);

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
        // directory: true,
        // startPath: "/index.html",
        index: 'index.html',
        middleware: function(req, res, next) {
            if (req.url.match(/api/)) {
                console.log('req.url => ' + req.url);
                proxySrv(req, res);
                return;
            }
            next();
        }
    }
});