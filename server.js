// modules =================================================

var express = require('express');
var fs = require('fs');
var request = require('request');
var app     = express();
var mongojs = require('mongojs');
var databaseUrl = "mydb";
var collections = "OutLinks_853";
var db = mongojs(databaseUrl, [collections]);
//var mycollection = db.collection('OutLinks_853');

app.use(express.static(__dirname + "/public"));

db.on('error', function() {
  console.log('we had an error.');
});

/* get json object*/
app.get('/data/:term/:searchtype', function(req, res){
	
	//var url = "http://" + decodeURIComponent(req.params.term) + "/";
	var url = decodeURIComponent(req.params.term);
	var searchType = req.params.searchtype;
	
	
	
	console.log("in get data, term is: " + url);
	console.log("Search type is: " + searchType);
	//http://www.uel.ac.uk/
	
	if (searchType == "standard") {
	
		db.OutLinks_853.find({"crawlId":853, "pageUrl":url}, { "pageUrl": 1, "outLink":1, _id:0 }, function (err, docs) {
			if(err){ 
				throw err;
				data = [];
				res.json(data);
			} else{
				
				var data = [];
				docs.forEach( function (page, id) {
					console.log( "id: " + id + ", pageUrl: " + page.pageUrl + ", outLink: " + page.outLink );
					data.push({
						id: id,
						pageUrl: page.pageUrl,
						outLink: page.outLink
					})
				})
				//console.log(JSON.stringify(docs));
				res.json(data);
			}
		})
	} else if (searchType == "regex") {
		db.OutLinks_853.find({"crawlId":853, "pageUrl": {$regex: url}}, { "pageUrl": 1, "outLink":1, _id:0 }, function (err, docs) {
			if(err){ 
				throw err;
				data = [];
				res.json(data);
			} else{
				
				var data = [];
				docs.forEach( function (page, id) {
					console.log( "id: " + id + ", pageUrl: " + page.pageUrl + ", outLink: " + page.outLink );
					data.push({
						id: id,
						pageUrl: page.pageUrl,
						outLink: page.outLink
					})
				})
				//console.log(JSON.stringify(docs));
				res.json(data);
			}
		})
	}
});

app.listen('8081') 
console.log('Outlink-Tool on port 8081'); 
exports = module.exports = app;