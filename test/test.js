var expect = require("expect");
var server_ref_gen = null;
var PACKAGE_PATH = "../index.js"; 
var http = require('http');

describe("Package", function() {

	beforeEach(function () {
		server_ref_gen = require(PACKAGE_PATH);
	});

	afterEach( function() {
		server_ref_gen.closeAll();
	});

	it("initialise without any errors", function () {
		expect(server_ref_gen).toExist();
	});

	it("should generate a 12 characher long key", function () {
		expect(server_ref_gen.generateKey().length).toBe(12);
	});

	it("should generate unique keys for a set 100000 of keys", function() {
		var keys = [];
		for (var i = 0; i < 100000; i++) {
			keys.push(server_ref_gen.generateKey());
		}

		var uniqueKeys = eliminateDuplicates(keys);

		expect(keys.length).toBe(uniqueKeys.length);		
	});

	it("should create a server and update lastServer", function () {
		var s = server_ref_gen.createServer();
		expect(s).toExist();
		expect(server_ref_gen.serverList().length).toBe(1);
		expect(server_ref_gen.lastServer()).toBe(s);
	});

	it("should create multiple servers and update the lastServer", function () {
		var s1 = server_ref_gen.createServer();
		var s2 = server_ref_gen.createServer();
		expect(server_ref_gen.lastServer()).toBe(s2);
		expect(server_ref_gen.serverList().length).toBe(2);
	});

	it("should add 10 servers to the server list", function() {
		var s;
		for (var i = 0; i < 10; i++) {
			s = server_ref_gen.createServer();
		}

		expect(server_ref_gen.lastServer()).toBe(s);
		expect(server_ref_gen.serverList().length).toBe(10);
	});

	it("should close the last server", function() {
		var s = server_ref_gen.createServer();
		server_ref_gen.close(s);
		expect(server_ref_gen.serverList().length).toBe(0);
		expect(server_ref_gen.lastServer()).toNotExist();
		expect(s).toNotExist();
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