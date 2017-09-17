var restaurant = require('../models/restaurant');
var DateTime = require('datetime-converter-nodejs');

module.exports = function(router) {
	router.post('/addRestaurant', function(req, res){
		var newRestaurant = new restaurant();
		if(req.body.name == '' || req.body.name == null ||
		   req.body.location == '' || req.body.location == null || 
		   req.body.cuisine == '' || req.body.cuisine == null ||
		   req.body.noOfTables == '' || req.body.noOfTables == null ){
			res.json({sucess : false, message : 'One of the field is empty'});
			console.log(req.body);
			}
		else{	
			console.log(req.body);
			newRestaurant.name = req.body.name;
			newRestaurant.location = req.body.location;
			newRestaurant.cuisine = req.body.cuisine;
			newRestaurant.noOfTables = req.body.noOfTables;
			newRestaurant.tables = [];
			newRestaurant.bookings = [];
			newRestaurant.reviews = [];	
			console.log(newRestaurant);
			newRestaurant.save(function(err, restaurantCreated){
				if(err) {
					return res.json({success : false, message : err.message});
				}
				else{
					return res.json({success: true, message: 'restaurant created'});
				}
			});
		}
	});

	router.delete('/removeRestaurant/:name', function(req, res){
		restaurant.remove({ 'name' : req.params.name }, function(err, restaurantDeleted){
			console.log(restaurantDeleted);
			console.log(restaurantDeleted.result.n);
			if(err) {
				return res.json({success : false, message : err.message});
			}
			else if(restaurantDeleted.result.n == 0){
				return res.json({success: false, message: 'No restaurant with the name ' + req.params.name + ' present'});
			}
			else{
				return res.json({success: true, message: 'Restaurant deleted successfully'});
			}
		});
	});

	router.put('/addTableRestaurant', function(req, res){
		var table = { "tableNo" : req.body.tableNo, "capacity" : req.body.capacity }
		restaurant.findOneAndUpdate({ 'name' : req.body.name }, 
			{ $push : { tables : table }},function(err, after){
			console.log(after);
			if(err) {
				return res.json({success : false, message : err.message});
			}
			else{
				return res.json({success: true, message: 'Table added to restaurant successfully'});
			}
		});
	});

	router.delete('/removeTableRestaurant', function(req, res){
		restaurant.findOneAndUpdate({ name : req.body.name }, 
  			{ $pull: { tables : { tableNo : req.body.tableNo }}}, { new: true, passRawResult: true } , function(err, after, raw){
			console.log(raw);
			console.log("New : " + after);
			if(err) {
				return res.json({success : false, message : err.message});
			}
			else if(!after){
				return res.json({success : false, message : "No restaurant found with the given name"});
			}
			else{
				return res.json({success: true, message: 'Table removed from restaurant successfully'});
			}
		});
	});

	router.put('/updateTableCapacity', function(req, res){
		restaurant.findOneAndUpdate({ name : req.body.name, 'tables.tableNo' : req.body.tableNo }, 
  			{ $set: { 'tables.$.capacity' : req.body.capacity }}, { new: true } , function(err, after, raw){
			console.log("New : " + after);
			if(err) {
				return res.json({success : false, message : err.message});
			}
			else if(!after){
				return res.json({success : false, message : "No restaurant or table found"});
			}
			else{
				return res.json({success: true, message: 'Table capacity updated successfully'});
			}
		});
	});

	router.get('/getTableBookings/:name/:tabelNo/:from/:to', function(req, res){
		var start = DateTime.isoString(req.params.from);
		var end = DateTime.isoString(req.params.to);
		restaurant.find({ name : req.params.name, 'bookings.tableNo' : req.params.tableNo, 
			startTime: { $gte : start} , endTime : { $lte : end}} , 
			{ bookings : 1 } , function(err, bookings){
			if(err) {
				return res.json({success : false, message : err.message});
			}
			else{
				return res.json({success: true, bookings : bookings });
			}
		});
	});


	return router;
}