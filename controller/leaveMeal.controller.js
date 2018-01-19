var connection = require('../config/connection');

module.exports = {
    leaveMealById(req, res, next) {
        var body = req.body;
        var user = req.user;

         if (typeof body.meal_id !== 'undefined' && body.meal_id) { 
             // Leave meal by ID
             var query = 'DELETE FROM meals_users WHERE meal_id = ? AND user_id = ?';

            connection.query(query, [body.meal_id, user], function (error, rows, fields) {
                if (error) {
                    next(error);
                } else {
                    res.status(200).json({
                        status: {
                            message: 'OK'
                        }
                    }).end();
                };
            });
        };
    }
};