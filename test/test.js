var expect = require("expect");
var server_ref_gen = null;
var PACKAGE_PATH = "../index.js"; 
var http = require('http');

describe("index.js", function() {
	beforeEach(function () {
		server_ref_gen = require(PACKAGE_PATH);
	});

	afterEach( function() {
		server_ref_gen.closeAll();
		delete require.cache[require.resolve(PACKAGE_PATH)];
	});

	it("initialise without any errors", function () {
		expect(server_ref_gen).toExist();
	});

	describe("#generateKey", function() {
		it("should generate a 12 characher long key", function () {
			expect(server_ref_gen.generateKey().length).toBe(12);
		});

		[10, 100, 10000/*, 100000*/].forEach(function(test) {
			it("should generate unique keys for a set " + test + " of keys", function() {
				var keys = [];
				for (var i = 0; i < test; i++) {
					keys.push(server_ref_gen.generateKey());
				}

				var uniqueKeys = eliminateDuplicates(keys);

				expect(uniqueKeys.length).toBe(test);
			});
		});
	});

	describe("#createServer", function() {
		it("should create a server and update lastServer", function () {
			var s = server_ref_gen.createServer();
			expect(s).toExist();
		});

	});

	describe("#getLastServer", function() {
		[1, 2, 10].forEach(function(test) {
			it("should create " + test + " servers and update the last server", function () {
				var s;
				for (var i = 0; i < test; i++) {
					s = server_ref_gen.createServer();
				}
				expect(server_ref_gen.getLastServer()).toBe(s);
			});
		});
	});
	
	describe("#getLastServer", function() {
		[1, 2, 10].forEach(function(test) {
			it("should create " + test + " servers and update the server list", function () {
				for (var i = 0; i < test; i++) {
					server_ref_gen.createServer();
				}
				expect(server_ref_gen.getServerList().length).toBe(test);
			});
		});
	});
	
	describe("#close", function() {
		it("should close the last server", function() {
			var s = server_ref_gen.createServer();
			server_ref_gen.close(s);
			expect(server_ref_gen.getServerList().length).toBe(0);
			expect(server_ref_gen.getLastServer()).toNotExist();
		});

		it("should not close a server from different module", function() {
			var different_server_ref_gen = require(PACKAGE_PATH);
			var s = different_server_ref_gen.createServer();
			server_ref_gen.close(s);
			expect(server_ref_gen.getServerList().length).toBe(0);
			expect(server_ref_gen.getLastServer()).toNotExist();
		});
	});

	describe("#closeAll", function() {
		[1, 2, 10].forEach(function(test) {
			it("should close all " + test + " servers", function() {
				for (var i = 0; i < test; i++) {
					server_ref_gen.createServer();
				}

				server_ref_gen.closeAll();
				expect(server_ref_gen.getServerList().length).toBe(0);
				expect(server_ref_gen.getLastServer()).toNotExist();
			});
		});
	});
	
	describe("connect to a client", function() {
		it("it should trigger the on.connect event");
	});
});

function eliminateDuplicates(arr) {
  var i,
      len=arr.length,
      out=[],
      obj={};
 
  for (i=0;i<len;i++) {
    obj[arr[i]]=0;
  }
  for (i in obj) {
    out.push(i);
  }
  return out;
}