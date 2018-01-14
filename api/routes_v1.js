// Dependencies
var express = require('express');
var routes = express.Router();
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });

// Controllers
var meal = require('../controller/meal.controller');
var newMeal = require('../controller/newMeal.controller');
var leaveMeal = require('../controller/leaveMeal.controller');

module.exports = {}

// routes
routes.use('*', function (req, res, next) {
    res.contentType('application/json'); // Add content type
    next();
});

routes.get('/meals', meal.getAll);
routes.get('/meal/:id', meal.getById);

routes.post('/leave_meal', leaveMeal.leaveMealById);

routes.post('/new_meal', upload.single('newMealImg'), newMeal.newMeal);

module.exports = routes;