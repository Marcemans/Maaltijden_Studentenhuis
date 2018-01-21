// Packages
var chai = require('chai');
var chaiHttp = require('chai-http');
var fs = require("fs");
var jwt = require('jwt-simple');

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

var imgFileNameYear = '2030'; // Change this to the year of the datetime-field

var token;
var userId;

describe('newMeal API interface',function(){
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
                userId = jwt.decode(token, config.secret_key).sub.user.id;
                done();
            });
        });
    });

    afterEach((done) => {
        db.query('DELETE FROM `users` WHERE `email` = ?', register_details.email, function(error){
            if(error) console.log(error);
            db.query('DELETE FROM `meals` WHERE user_id = ?', userId, function (error) {
                if(error) console.log(error);
                done();
            });
        });
    });

    after((done) => {
        fs.readdirSync('./uploads/meal_img/')
        .forEach((img) => {
            if(img.startsWith(imgFileNameYear)){
                fs.unlinkSync('./uploads/meal_img/' + img);
            }
        })
        done();
    });

    describe('POST /api/v1/meal/new',function(){    
        it('should make a new meal',function(done)
        {
            chai.request(server)
            .post('/api/v1/meal/new')
            .set('X-Access-Token', token)
            .send({
                title: 'pizza',
                desc: 'Even wachten... PIZZA!',
                price: '7,00',
                datetime: '2030-01-20 18:00',
                max_people: 10,
                image: 'http://totties.nl/wp-content/uploads/2017/12/Totties-Eethuis-Pizza-Pepperoni.png'
            })
            .end(function (err, res) {  
                res.should.have.status(200); 
                res.body.should.be.an('object');
                res.body.should.have.property('status');
                done();
            });
        });

        it('should give an error when creating a new meal in the past', function(done){
            chai.request(server)
            .post('/api/v1/meal/new')
            .set('X-Access-Token', token)
            .send({
                title: 'pizza',
                desc: 'Even wachten... PIZZA!',
                price: '7,00',
                datetime: '2001-10 17:00',
                max_people: 10,
                image: 'http://totties.nl/wp-content/uploads/2017/12/Totties-Eethuis-Pizza-Pepperoni.png'
            })
            .end(function (err, res) {  
                res.should.have.status(400); 
                res.body.should.be.an('object');
                res.body.should.have.property('status');
                res.body.status.should.have.property('query');
                res.body.status.query.should.equal('Bad Request');
                done();
            });
        });
    });
});