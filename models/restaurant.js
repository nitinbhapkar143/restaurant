var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var schema = mongoose.Schema;

var nameValidator = validate({
  validator: 'matches',
  arguments: /^[a-zA-Z]{2,20}$/,
  message : 'It should only contain alphabets between 2-20.'
});

var restaurantSchema = new schema({
	name : { type : String, required : true, validate : nameValidator },
	location : { type : String, required : true, validate : nameValidator },
	cuisine : { type : String, required : true, validate : nameValidator },
	noOfTables : { type : Number, required : true},
	tables :[{ tableNo : Number, capacity : Number}],
	bookings : [{tableNo : Number, bookedBy : String, startTime : Date, endTime : Date, noOfSeats : Number, status : Boolean}],
	reviews : [{ by: String, description: String, rating : Number, date : { type : Date, default : Date.now}}]
});


module.exports = mongoose.model('Restaurant', restaurantSchema); 