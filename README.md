# yike

#### 介绍
聊天app

#### 软件架构
采用uniapp+node.js+express+mogodb+socket技术实现即时通讯


#### 安装教程

1.  如果serve目录下没有node_modules,则cmd使用npm i下载
2.  yikes文件夹使用hbuilderx打开运行
3   yike文件pages/chatroom里修改高德地图key,自行去高德开放平台申请静态地图key
4.  yike文件夹下manifest.json中app模块勾选相机和相册，勾选map地图选择高德地图填写key(ios可不管，可乱填)，申请高德地图android平台key(高德开放平台)
4.  云打包时使用自有安卓证书，或者使用公共证书https://ask.dcloud.net.cn/article/36522，否则高德地图不生效，申请android平台时需要填写证书信息
3.  申请高德开放平台web服务和安卓的key用于打包和生成位置图片
3.  serve文件夹为后端代码，node app.js启动
4.  数据库使用mogodb,在serve文件夹的config文件夹下config.js修改自己的mogodb配置
5.  在serve文件夹的config文件夹下的mail.js修改自己的QQ邮箱的stmp服务密码，实现发送验证码等功能
6.  在dao文件夹下的mailserver.js修改发件人为自己的邮箱

#### 使用说明

1.  xxxx
2.  xxxx
3.  xxxx

#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request


#### 特技

1.  使用 Readme\_XXX.md 来支持不同的语言，例如 Readme\_en.md, Readme\_zh.md
2.  Gitee 官方博客 [blog.gitee.com](https://blog.gitee.com)
3.  你可以 [https://gitee.com/explore](https://gitee.com/explore) 这个地址来了解 Gitee 上的优秀开源项目
4.  [GVP](https://gitee.com/gvp) 全称是 Gitee 最有价值开源项目，是综合评定出的优秀开源项目
5.  Gitee 官方提供的使用手册 [https://gitee.com/help](https://gitee.com/help)
6.  Gitee 封面人物是一档用来展示 Gitee 会员风采的栏目 [https://gitee.com/gitee-stars/](https://gitee.com/gitee-stars/)
