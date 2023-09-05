const nodemailer = require("nodemailer"); //发送邮件
//创建一个smtp服务器
const config = {
    host: "smtp.qq.com",
    port: 465,
    auth: {
      user: "1906232776@qq.com", //你的qq邮箱账号
      pass: "whghsdfbhqacebjd", //邮箱的授权码，不是注册时的密码,等你开启的stmp服务自然就会知道了
    },
  };
  // 创建一个SMTP客户端对象
  exports.transporter = nodemailer.createTransport(config);

  let Mails=[]//验证码存储,格式为对象数组[{str:'XXXX,n:number,time:Date}.....]
  //{str:'1565',n:0,time:0}//临时存储验证码，验证码只能用一次，之后删除，还有过期时间，过期删除
  //刷新验证码表，使用次数大于0删除，时间超过5分钟删除
const refreshMails=()=>{
    for(let i=0;i<Mails.length;i++){
        if(Mails[i].n>0||Date.now()-Mails[i].time>1000*60*5){//验证码过期时间为5分钟,则删除此时存储的验证码
            Mails.splice(i,1)
        }
    }
}
//随机生成6位数作为验证码
const createSixNum=()=>{
    let Num = "";
    for (let i = 0; i < 6; i++) {
      Num += Math.floor(Math.random() * 10);
    }
    return Num;
  }

//验证码生成
exports.generateMail = ()=>{
    refreshMails()//刷新
    let code=createSixNum();
    Mails.push({str:code,n:0,time:Date.now()})//存储验证码
    console.log(Mails)
    return code
}

//判断验证码
exports.judgeMail = (str)=>{
    refreshMails()//刷新
    let result = false
    if(!str)return false
    for(let i=0;i<Mails.length;i++){
        if(Mails[i].str===str){
            Mails[i].n=1
            result = true
            break
        }
    }
    return result
}
