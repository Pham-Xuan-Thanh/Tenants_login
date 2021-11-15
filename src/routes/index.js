const loginRouter = require('./login.router')

function route(app) {
    
    app.use('/auth', loginRouter);
    
    app.get('/', (req,res)=> {
        return res.send("Hello CC!!!!!! <3")
    })
}

module.exports = route;