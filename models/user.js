const mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
	username: {
		type: String,
		unique: true,
		allowNull: false,
		index: true
	},

	password:{
		type: String,
		unique: true,
		allowNull: false
	},
	email:{
		type: String,
		unique: true,
		allowNull: false
	}
});

var User = module.exports = mongoose.model('User', UserSchema);

//module.exports = UserSchema;
module.exports = User;