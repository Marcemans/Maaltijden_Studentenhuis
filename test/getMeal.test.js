// Packages
var chai = require('chai');
var chaiHttp = require('chai-http');
var fs = require("fs");

// Files
var server = require('../server.js');
var db = require('../config/connection.js');
var config = require('../config/general.json');

// Set chai functions
const assert = chai.assert;    // Using Assert style
const expect = chai.expect;    // Using Expect style
const should = chai.should();  // Using Should style

chai.use(chaiHttp);

let register_details = {
    email: 'test123test@mail.com', 
    name: 'testaccount',
    password: '56789kjhgFGH.,',
    secret_key: config.reg_key
}

let login_details = {
    email: 'test123test@mail.com',
    password: '56789kjhgFGH.,'
}

var token;
var user;

describe('getMeal API interface',function(){
    beforeEach((done) => {
        chai.request(server)
        .post('/api/v1/register')
        .send(register_details)
        .end((err, res) => {
            chai.request(server)
            .post('/api/v1/login')
            .send(login_details)
            .end((err, res) => {
                token = res.body.status.token;
                user = res.user;
                done();
            });
        });
    });

    afterEach((done) => {
        db.query('DELETE FROM users WHERE email = ?', register_details.email, function(error){
            if(error) console.log(error);
            done();
        });
    });

    describe('GET /api/v1/meals',function(){    
        describe('Correctly tests', function() {
            before(function(done){
                // Create 1 meal
                var query = 'INSERT INTO meals (title, description, datetime, max_amount, user_id) VALUES ("Meal titel", "Meal description", "1111-11-11", "5", "1")';
                db.query(query, function(error) {
                    if(error) console.log(error);
                    done();
                });
            });

            it('should GET /api/v1/meals correctly', function(done) {
                chai.request(server)
                    .get('/api/v1/meals')
                    .set('X-Access-Token', token)
                    .end(function (err, res) {
                        expect(res).to.have.status(200);
                        expect(res).to.be.json;
                        res.body.should.have.property('result').and.should.be.a('object');
                        done();
                    });
            });
        });

        describe('Incorrectly tests', function() {
            before(function(done){
                // Remove all meals
                var query = 'DELETE FROM meals';
                db.query(query, function(error) {
                    if(error) console.log(error);
                    done();
                });
            });

            it('should GET /api/v1/meals without meals', function(done) {
                chai.request(server)
                    .get('/api/v1/meals')
                    .set('X-Access-Token', token)
                    .end(function (err, res) {
                        expect(res).to.have.status(400);
                        expect(res).to.be.json;
                        res.body.status.message.should.equal('No meals found');
                        done();
                    });
            });
        });
    });
});