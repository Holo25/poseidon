var User=require("./models").User;
var Auction=require("./models").Auction;
var Item=require("./models").Item;

module.exports=function(){
    User.findOne({username:"Suti"},function(err, user){
        if(user === null){ // Suti nelkul nincs az eletnek ertelme.
            var user1= new User({
                username:"Suti",
                password:"bukta1",
                credit:4201,
                neptun:"C3F4IM",
                email:"mertazt@szeretem.hu"
                
            });
            user1.save(function (err) {
                var user2= new User({
                    username:"Pretender",
                    password:"bunko2",
                    credit:111,
                    neptun:"BATMAN",
                    email:"haha@ha.ha"
                    
                });
                user2.save(function (err) {
                    var item1= new Item({
                        name: "BSZ",
                        credit: 4
                    });
                    item1.save(function (err) {
                        var item2= new Item({
                            name: "Grafika",
                            credit: 3
                        });
                        item2.save(function (err) {
                            var auction1 = new Auction({
                                expireTime: new Date,
                                price: 300,
                                owner: user1._id,
                                item: item1._id
                            });
                            
                            auction1.save(function (err) {
                                var auction2 = new Auction({
                                    expireTime: new Date,
                                    price: 540,
                                    owner: user2._id,
                                    item: item2._id
                                });
                                
                                auction2.save(function (err) {
                                    if (err) return handleError(err);
                                    });
                                });
                        });
                    });
                });
            });
        }
    });
};