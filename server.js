// modules =================================================

var express = require('express');
var fs = require('fs');
var request = require('request');
var app     = express();
var mongojs = require('mongojs');
var databaseUrl = "mydb";
//var collections = "OutLinks_853";
var db = mongojs(databaseUrl);
//var mycollection = db.collection('OutLinks_853');

app.use(express.static(__dirname + "/public"));

db.on('error', function() {
  console.log('we had an error.');
})
db.once('open', function() {
	console.log('connected to database.');
})

/* get json object*/
app.get('/data/:term/:searchtype/:siteid', function(req, res){
	
	var url = decodeURIComponent(req.params.term);
	var searchType = req.params.searchtype;
	var siteId = parseInt(req.params.siteid);
	
	console.log("in get data, term is: " + url);
	console.log("Search type is: " + searchType);
	console.log("Site id is: " + siteId);
	//examples: 853, 914
	
	var mycollection = db.collection("OutLinks_" + siteId);
	
	var condition = {};
	condition["crawlId"] = siteId;
	
	if (searchType == "exact match") {
	
		condition["pageUrl"] = url;
		console.log("obj is: " + JSON.stringify(condition));
	
		mycollection.find(condition, { "pageUrl": 1, "outLink":1, _id:0 }, function (err, docs) {
			if(err){ 
				throw err;
				data = [];
				res.json(data);
			} else{
				
				var data = [];
				docs.forEach( function (page, id) {
					//console.log( "id: " + id + ", pageUrl: " + page.pageUrl + ", outLink: " + page.outLink );
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
		
		condition["pageUrl"] =  {$regex: url };
		console.log("obj is: " + JSON.stringify(condition));
		//{"crawlId":853, "pageUrl": {$regex: url}}
		
		mycollection.find(condition, { "pageUrl": 1, "outLink":1, _id:0 }, function (err, docs) {
			if(err){ 
				throw err;
				data = [];
				res.json(data);
			} else{
				
				var data = [];
				docs.forEach( function (page, id) {
					//console.log( "id: " + id + ", pageUrl: " + page.pageUrl + ", outLink: " + page.outLink );
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

app.listen('80') 
console.log('Outlink-Tool on port 80'); 
exports = module.exports = app;