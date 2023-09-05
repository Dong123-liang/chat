const Mail = require("./../config/mail");
//type为1表示发送注册信息，为2表示发送验证码
 exports.sendMail = function (email,type,res) {
     console.log(typeof type)
    let code = Mail.generateMail();
    var mail = {
        // 发件人
        from: "<1906232776@qq.com>",
        // 主题
        subject: "验证码", //邮箱主题
        // 收件人
        to: email, //前台传过来的邮箱
        // 邮件内容，HTML格式
        //text: '验证码:' + code //发送验证码
        html: `
              <p>你好！</p>
              <p>您正在注册轻聊天平台</p>
              <p>你的验证码是：<strong style="color: #ff4e2a;">${code}</strong></p>
              <p>***该验证码5分钟内有效***</p>`, // html 内容
    };
    if(type==1){
        mail.html=`<p>你好！</p>
        <p>欢迎注册轻聊天平台</p>`
    }
    Mail.transporter.sendMail(mail, (error, info) => {
        if (error) {
            res.send({status:500,msg:'服务器出错'})
            return console.log("mail", error);
        }
        console.log("mail sent:", info.response);

        res.send({ status:200});
    });
    
};