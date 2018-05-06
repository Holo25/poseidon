var User=require("./models").User;
var Auction=require("./models").Auction;
var Item=require("./models").Item;

module.exports=function(){
    User.findOne({neptun:"admin1"},function(err, user){
        if(user === null){ // Suti nelkul nincs az eletnek ertelme.
            var user1= new User({
                username:"AdmInIsz",
                password:"123456",
                credit:5000,
                neptun:"admin1",
                email:"admin@google.hu"
                
            });
            user1.save(function (err) {        
                var item1=new Item({
                    name:"BSZ1",
                    credit:4
                });
                item1.save(function(err){
                    var item2=new Item({
                        name:"BSZ2",
                        credit:4
                    });
                    item2.save(function(err){
                        var item3=new Item({
                            name:"Grafika",
                            credit:3
                        });
                        item3.save(function(err){
                            var item4=new Item({
                                name:"Szeszkultúra",
                                credit:2
                            });
                            item4.save(function(err){
                                var auction1=new Auction({
                                    expireTime:new Date(Date.now()+700000),
                                    price:100,
                                    owner:user1._id,
                                    item:item1._id
                                });
                                auction1.save(function(err){
                                    var auction1=new Auction({
                                        expireTime:new Date(Date.now()+240000),
                                        price:500,
                                        owner:user1._id,
                                        item:item3._id
                                    });
                                    auction1.save(function(err){
                                        if(err) console.log(err);
                                    });
                                });
                            });
                        });
                    });
                });
            });
        }
    });
};