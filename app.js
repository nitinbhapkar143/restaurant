var express = require('express');
var morgan  = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');
var router = express.Router();
var restaurantRoute = require('./routes/restaurant')(router);
var customerRoute = require('./routes/customer')(router);
var app = express();
var port = process.env.port || 3000;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/restaurantData', { useMongoClient: true }, function(err){
	if(err){
		console.log('Error : ', err.message);
	}
	else{
		console.log('Connected to database');
	}
});

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use('/customer', customerRoute);
app.use('/restaurant', restaurantRoute);

/*app.get('*',function(req, res){
	res.sendFile(path.join(__dirname, '/public/views/index.html'));
});*/

app.listen(port, function (err) {
	if(err) throw err;
	console.log('Listening on http://locahost:' + port);
});


