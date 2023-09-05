const mailServe =require('../dao/mailserver')
exports.sendmail=function(req,res){
    let email =req.query.email
    let type =req.query.type
    mailServe.sendMail(email,type,res)
}