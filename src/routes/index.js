const loginRouter = require('./login.route')

function route(app) {
    
    app.use('/login',loginRouter);
    
    app.get('/', (req,res)=> {
        return res.send("Hello CC!!!!!! <3")
    })
}

module.exports = route;