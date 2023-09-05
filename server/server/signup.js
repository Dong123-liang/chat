
const dbServe =require('../dao/dbserver');
exports.builder=function(req,res){
    let name =req.body.name
    let email=req.body.email
    let pwd =req.body.pwd
    let verify=req.body.verify //验证码
    dbServe.builder(name,email,pwd,verify,res)
}

