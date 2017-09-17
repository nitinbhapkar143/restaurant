var restaurant = require('../models/restaurant');
var DateTime = require('datetime-converter-nodejs');

module.exports = function(router) {
	router.put('/bookTable', function(req, res){
		var start = DateTime.isoString(req.body.startTime);
		var end = DateTime.isoString(req.body.endTime);
		console.log('old : ' + start + ' new : ' + end);
    	var newBooking = {
    	  "tableNo" : req.body.tableNo, 
    	  "bookedBy" : req.body.bookedBy, 
    	  "startTime" : start, 
    	  "endTime" : end, 
    	  "noOfSeats" : req.body.noOfSeats, 
    	  "status" : true
    	};
		restaurant.findOneAndUpdate({ 'name' : req.body.name }, 
			{ $push : { bookings : newBooking }},{ new : true},function(err, after){
			console.log(after);
			if(err) {
				return res.json({success : false, message : err.message});
			}
			else{
				return res.json({success: true, message: 'Table booked to restaurant successfully'});
			}
		});
	});

	router.get('/getRestaurants/:value', function(req, res){
		restaurant.find({ $or : [
				{ 'name' : req.params.value }, { 'cuisine' : req.params.value }, { 'location' : req.params.value }
			]}, 
			{ _id : 0, name :1, location : 1, cuisine : 1, noOfTables : 1 } , function(err, restaurants){
			if(err) {
				return res.json({success : false, message : err.message});
			}
			else if(!restaurants.length){
				return res.json({success : false, message : "No restaurants found with given criteria"});
			}
			else{
				return res.json({success: true, restaurants : restaurants });
			}
		});
	});

	router.put('/addReview', function(req, res){
    	var newReview = {
    	  "by" : req.body.by, 
    	  "description" : req.body.description, 
    	  "rating" : req.body.rating, 
    	};
		restaurant.findOneAndUpdate({ 'name' : req.body.name }, 
			{ $push : { reviews : newReview }},{ new : true},function(err, after){
			console.log(after);
			if(err) {
				return res.json({success : false, message : err.message});
			}
			else{
				return res.json({success: true, message: 'Review added to restaurant successfully'});
			}
		});
	});

	router.get('/getTablesbyCapacity/:name/:capacity', function(req, res){
		restaurant.aggregate(
		    [
		        { $match : { name : req.params.name } },
		        { $project : {
		            name : 1,
		            tables : {
		                $filter : {
		                    input : "$tables",
		                    as : "tables",
		                    cond : {
		                       $lte : [ "$$tables.tableNo", req.params.capacity ]
		                    }
		                }
		            }
		        }
		    }
		    ],function(err, restaurants){
					console.log(restaurants);
					if(err) {
						return res.json({success : false, message : err});
					}
					else if(!restaurants.length){
						return res.json({success : false, message : "No restaurants found with given criteria"});
					}
					else{
						return res.json({success: true, restaurants : restaurants });
					}
				});
		});

	return router;
}