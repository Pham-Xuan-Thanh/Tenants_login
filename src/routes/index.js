const authRouter = require('./auth.route')
const projectRouter = require('./project.route')

function route(app) {
    
    app.use('/auth',authRouter);

    app.use('/project',projectRouter);
    
    app.get('/', (req,res)=> {
        return res.send("Hello MB!!!!!! <3")
    })
}

module.exports = route;