var crypto = require('crypto');
var http = require('http');


var PORT_NUMBER = 3000;
var KEY_LENGTH = 12;

var serverList = [];
var lastServer = null;

exports.generateKey = function() {

    var chars = "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";
    var rnd = crypto.randomBytes(KEY_LENGTH)
        , value = new Array(KEY_LENGTH)
        , len = chars.length;

    for (var i = 0; i < KEY_LENGTH; i++) {
        value[i] = chars[rnd[i] % len]
    };

    return value.join('');
};

exports.createServer = function() {
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
 
	server.listen(PORT_NUMBER++);

	serverList.push(server);

	lastServer = server;

	return server;
};

exports.close = function(server) {
	// if(serverList.indexOf(server)) {
		serverList.splice(serverList.indexOf(server),1);

		server.close();
	// }
}

exports.closeAll = function() {

	// for (var server in serverList){
	// 	this.close(server)
	// }

	serverList = [];
	lastServer = null;
}

exports.lastServer = function() {
	return serverList[serverList.length-1];
};
exports.serverList = function() {
	return serverList;
}
exports.PORT_NUMBER = PORT_NUMBER;