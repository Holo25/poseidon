var assert = require('assert');
var expect = require('chai').expect;
var logoutUser=require('../../../middlewares/user').logoutUser;

describe('LogoutUser', function () {
    it('should call next only when there is a session to end', function () {
        var req={session:{
            userID:"haha"
        }};
        req.session.destroy=function(fv){
            fv();
        };
        var res={};
        res.redirect=function(){
            expect(false).to.be.equal(true);
        };
        logoutUser(req,res,function(){
      })
    });
    it('should redirect to login if there is no session', function () {
        var req={session:{
            
        }};
        req.session.destroy=function(fv){
            fv();
        };
        var res={};
        res.redirect=function(){
            
        };
        logoutUser(req,res,function(){
            expect(false).to.be.equal(true);
      })
    });
  });