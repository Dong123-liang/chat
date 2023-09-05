const dbServe =require('../dao/dbserver')
exports.isUname=function(req,res){
    let name =req.query.name
    dbServe.isUname(name,res)
}