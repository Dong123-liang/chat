
const dbServe = require('../dao/dbserver');
exports.sigin = function (req, res) {
    // console.log(req.body)
    let name = req.body.name
    let pwd = req.body.pwd
    dbServe.sigin(name, pwd, res)
}

//忘记密码
exports.forgetPassword = function (req, res) {
    let email=req.body.email
    let pwd =req.body.pwd
    let verify=req.body.verify
    dbServe.forgetPassword(email, pwd,verify, res)
}
