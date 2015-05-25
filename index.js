var crypto = require('crypto');
var http = require('http');
var express = require('express');

var KEY_LENGTH = 12;

var lastServer = null;
exports.getLastServer = function() {
	return serverList[serverList.length-1];
};

var serverList = [];
exports.getServerList = function() {
	return serverList;
};

exports.generateKey = generateKey;
function generateKey() {

    var chars = "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";
    var rnd = crypto.randomBytes(KEY_LENGTH)
        , value = new Array(KEY_LENGTH)
        , len = chars.length;

    for (var i = 0; i < KEY_LENGTH; i++) {
        value[i] = chars[rnd[i] % len]
    };

    return value.join('');
};

exports.createServer = createServer;
function createServer() {
	var server = http.createServer(function(request, response) {
		response.writeHead(200, {"Content-Type": "text/html"});
		response.write("<!DOCTYPE \"html\">");
		response.write("<html>");
		response.write("<head>");
		response.write("<title>Hello World Page</title>");
		response.write("</head>");
		response.write("<body>");
		response.write("Hello World!");
		response.write("</body>");
		response.write("</html>");
		response.end();
	});
 
	server.listen({
		host: 'localhost',
		port: 0,
		exclusive: true
	});
	
	// console.log(server);
	// console.log(server.address());
	
	serverList.push(server);

	lastServer = server;

	
	return server;
};

exports.close = close;
function close(server) {
	if(serverList.indexOf(server) == -1) return;

	serverList.splice(serverList.indexOf(server),1);

	server.close();
};

exports.closeAll = closeAll;
function closeAll() {

	if(!serverList) return;
	if(serverList.length <= 0) return;

	serverList.forEach(function(server) {
		server.close();
	});

	serverList = [];
	lastServer = null;
};

