var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ItemSchema = new Schema({
    name: String,
    credit: Number
});

var Item = mongoose.model('Item', ItemSchema );

module.exports.Item=Item;

var UserSchema = new Schema({
    username: String,
    password: String,
    credit: Number,
    neptun: String,
    email: String,
});

var User = mongoose.model('User', UserSchema);

module.exports.User=User;

var AuctionSchema = new Schema({
    expireTime: Date,
    price: Number,
    owner: {type: Schema.ObjectId, ref:'User'},
    item: {type: Schema.ObjectId, ref:'Item'}
});

var Auction = mongoose.model('Auction', AuctionSchema);

module.exports.Auction=Auction;