var assert = require('assert');
var expect = require('chai').expect;
var validateUser=require('../../../middlewares/user').validateUser;

describe('ValidateUser', function () {
    it('should call next only when user data is valid', function () {
        var req={body:{
            username:"Golya",
            neptun:"BATMAN",
            mail:"antal@gmail.com",
            password:"123456",
            passwordRe:"123456"
        }};
        var res={};
        res.render=function(){
            expect(false).to.be.equal(true);
        };
        validateUser(req,res,function(){
      })
    });
    it('should render register form when data is rejected', function () {
        var req={body:{
            username:"Golya",
            neptun:"BATMAN",
            mail:"antal@gmail.com",
            password:"12345",
            passwordRe:"123456"
        }};
        var res={};
        res.render=function(){
            
        };
        validateUser(req,res,function(){
            expect(false).to.be.equal(true);
      })
    });
  });