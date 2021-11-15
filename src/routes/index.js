const loginRouter = require('./auth.router')
const infomation = require('./infor.router')

function route(app) {
    
    app.use('/auth', loginRouter);
    app.use('/project', infomation);
    
    app.get('/', (req,res)=> {
        return res.send("Hello CC!!!!!! <3")
    })
}

module.exports = route;