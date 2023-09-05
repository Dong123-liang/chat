const dbServe =require('../dao/dbserver')
exports.isEmail=function(req,res){
    let email =req.query.email
    dbServe.isEmail(email,res)
}
