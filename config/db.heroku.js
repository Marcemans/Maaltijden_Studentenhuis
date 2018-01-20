exports.generate = function(){
    return {
        "port": process.env.dbPort,
        "host": process.env.dbHost,
        "user": process.env.dbUser,
        "password": process.env.dbPass,
        "database": process.env.db
    }
}