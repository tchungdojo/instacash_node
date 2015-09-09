var express = require("express");
var path = require("path");
var app = express();

app.use(express.static(path.join(__dirname, "./static")));
app.set('views', path.join(__dirname, "./views"));
app.set('view engine', 'ejs');

app.get('/', function(req, res){
	res.render('index');
})

// var server = app.listen('https://instacash-node.herokuapp.com/');


var server = app.listen(5000);
var io = require('socket.io').listen(server);

var current_user_id = {};

io.sockets.on('connection', function (socket){
	
	socket.on('new_message', function (data){
		// console.log(data);
		newobj = {
			username: data.username,
			message: data.message
			}
		io.emit('res_message', newobj);
		});

	socket.on('new_username', function (data){
		// console.log(data.username);
		current_user_id[socket.id] = data.username;
		io.emit('online', current_user_id);
	});
	//server listening for a user to disconnect therefore no need for any emit.
	socket.on('disconnect', function(){
		delete current_user_id[socket.id];
		socket.broadcast.emit('user_disconnect', current_user_id);
	});
});