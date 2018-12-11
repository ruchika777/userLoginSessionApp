const express = require('express');
const session = require('express-session');
var User = require('../models/user');
var bodyParser = require('body-parser');
var router = express.Router();
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


//Middleware for user Authentication & Authorization
router.get('/isAuthenticated', function(req, res){
	if(req.session.username && req.session.password){
		res.send("Valid user..");
	}
	else{
		res.send("Login first..");
	}
	
});

//Express Session
app.use(session({
	key: 'user_sid',
	secret: 'secret',
	saveUninitialized: true,
	resave: true
}));


//Login
router.post('/login', (req, res, next)=>{
	
		var username= req.body.username;
		var password= req.body.password;

		req.session.username = username;
		req.session.password = password;

		console.log(req.session.username);
		
		 res.json({
 					success: true,
 					message: 'Successfully login..',
 					data: req.session
 				});

});

//Login2
router.post('/loginhere', (req, res)=>{
	var username = req.body.username;
	var password = req.body.password;

	req.session.username = username;
	req.session.password = password;

	User.findOne({username: username, password: password}, (err, user)=>{
		if(err){
			console.log(err);
			res.send('Error');
		}
		if(!user){
				 res.send('User not found..');
		}
		else{

			req.session.user = user;
			res.send('Successfully logged in..');
		}
	});

});

//Logout
router.get('/Logout', (req, res)=>{
	req.session.destroy();
	res.send("Logout Sucessfully");
});


//Middleware for CRUD api access
function isValid(req, res,next){
	if(req.session.username && req.session.password){
		//res.send("Valid user");
		next();
	}
	else{
		res.send("You need to login first!");
	}

}

//CRUD API

//Post
router.post('/enterDetails', isValid, function(req, res){
	var usr = new User({
		username : req.body.username,
		password : req.body.password,
		email : req.body.email
	});

	console.log(req.body);

	usr.save(function(err, db){
	if(err){
		res.send(err);
	}
	else{
		res.send("Successfully Inserted...");
	}
});

});


//Get
router.get('/allUsers', isValid, function(req, res){
	User.find({}).then(users=>{
		res.send(users);
	});
});

//Put
router.put('/updateUser/:userID', isValid, function(req, res){
	User.findOneAndUpdate({_id: req.params.userID}, {$set:{
		username: req.body.username,
		password: req.body.password,
		email: req.body.email
	}}, {new: true}).then(usr1=>{
		if(!usr1){
			return res.status(404).send({
				message: "User not found with ID" +req.params.userID
			});
		}

		else{
			res.send(usr1);
			console.log(req.body);
		}
	});
});

//Delete
router.delete('/deleteUser/:userID', isValid, function(req, res){
	User.remove({_id: req.params.userID}).then(usr1=>{
		if(!usr1){
			return res.status(404).send({
				message: "User not found with ID" +req.params.userID
			});
		}

		else{
			res.send("User deleted..");
			
		}
	});
});




















module.exports = router;


