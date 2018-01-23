var connection = require('../config/connection');
var path = require('path');
var fs = require('fs');

module.exports = {
    newMeal(req, res, next) {
        var newMealReq = req.body;
        var user = req.user;

        var query = 'SELECT * FROM users WHERE id=?';

        connection.query(query, user.id, function (error, rows, fields) {
            if(error){
                next(error);
            } else if(rows.length != 1) {
                res.status(400).json({
                    status: {
                        query: 'Bad Request: User does not exist'
                    }
                }).end();
            }else{
                if(!checkNewMealReq(newMealReq)){
                    res.status(400).json({
                        status: {
                            query: 'Bad Request'
                        }
                    }).end();
                }else{
                    insertNewMeal(newMealReq, user.id, res);
                }
            }
        });
    }
}

//Checks if new meal request has all needed fields
function checkNewMealReq(newMealReq){
    var date = new Date(newMealReq.datetime);
    var curDate = new Date();
    
    if(curDate > date || newMealReq.title == undefined || newMealReq.desc == undefined || newMealReq.price == undefined || newMealReq.image == undefined || newMealReq.max_people < 2){
        return false;
    }
    return true;
}

//Inserts new meal into DB
function insertNewMeal(newMealReq, userId, res){
    connection.query('INSERT INTO meals SET ?', {title: newMealReq.title, description: newMealReq.desc, datetime: newMealReq.datetime, price: newMealReq.price, max_amount: newMealReq.max_people, user_id: userId, image: newMealReq.image}, function (error, results, fields) {
        if(error){
            console.log(error);
            res.status(500).json({
                status: {
                    query: 'Internal Server Error: Could not insert meal'
                }
            }).end();
        } else if(results.affectedRows < 1) {
            console.log('Affected rows less than 1.');
            res.status(500).json({
                status: {
                    query: 'Internal Server Error: Could not insert meal'
                }
            }).end();
        }else{
            if(newMealReq.guest_amount == undefined){
                newMealReq.guest_amount = 0;
            }
            joinNewMeal(results.insertId, userId, newMealReq.guest_amount);
            
            res.status(200).json({
                status: {
                    query: 'OK'
                }
            }).end();
        }
    });
}

function joinNewMeal(mealId, userId, guests) {
    var query = 'INSERT INTO meals_users SET ?';

    guests++;
    
    connection.query(query, {meal_id: mealId, user_id: userId, guest_amount: guests}, function (error, rows, fields) {
        if (error) {
            next(error);
        };
    });
}
