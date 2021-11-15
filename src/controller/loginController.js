const Songs = require('../models/song')

class LoginController {
    login (req, res) {
        return res.send("Day la trang login");
    }
    async show (req,res) {
       

        Songs.find({},function (err,songs) {
            if (!err) {res.json(songs);}
            else res.status(403).json({error:"Forbidden request :( V.V ):"})
        })
    }
}

module.exports = new LoginController;