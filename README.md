### 项目状态

##### Master

[![Build Status](https://travis-ci.org/qious/birthday.svg?branch=master)](https://travis-ci.org/qious/birthday)
[![Coverage Status](https://coveralls.io/repos/github/qious/birthday/badge.svg?branch=master)](https://coveralls.io/github/qious/birthday?branch=master)


##### Develop

[![Build Status](https://travis-ci.org/qious/birthday.svg?branch=develop)](https://travis-ci.org/qious/birthday)
[![Coverage Status](https://coveralls.io/repos/github/qious/birthday/badge.svg?branch=develop)](https://coveralls.io/github/qious/birthday?branch=develop)


### 项目介绍

##### 用途

> 使用 微信企业号/企业微信 生日提醒

##### 依赖

* Node.js >= 7.6.0
* MySQL
* Redis

##### 特性

* 基于微信企业号/企业微信授权登录
* 新用户授权登录自动分配帐号信息
* 自定义提醒提前天数、提醒时间

##### 演示

![生日列表](https://cdn.qiujun.me/image/2018/09/24/c593040463273efb868cb02cbbe92062.png)

![生日详情](https://cdn.qiujun.me/image/2018/09/24/61f8aa3d3698659e4170aea9af860be2.png)

![微信生日列表](https://cdn.qiujun.me/image/2018/09/24/1b68ce630fc0886d4899631672ff1aa6.png)

![生日提醒](https://cdn.qiujun.me/image/2018/09/24/3f4ce9a24185bc995fd9bdb353c33409.png)

#### 部署运行

##### 下载或clone代码到任意目录

```bash
git clone https://github.com/qious/birthday.git
```

##### 安装依赖

```bash
cd /path/to/birthday/server
npm i
sudo npm i -g pm2
```

##### 复制并修改配置文件

```bash
cd /path/to/birthday/server
cp ./config/default.js ./config/local.js
vim ./config/local.js # 根据自身需要修改配置文件
```

##### 测试运行

```bash
cd /path/to/birthday/server
npm run dev # 如无报错后可进入下一步
```

##### 正式运行

```bash
cd /path/to/birthday/server
npm run pm2.start
```

### 进阶配置

##### 使用 Nginx 处理静态资源，Nginx示例配置如下

```nginx
upstream birthday {
    server 127.0.0.1:8000;
}

server {
    listen 80;
    server_name birthday.example.com;

    root /path/to/birthday/client/dist;
    index index.htm index.html;

    location /api {
        include proxy_params;
        proxy_pass http://birthday/api;
    }

    # 根据需要取消注释
    # location /doc {
    #     include proxy_params;
    #     proxy_pass http://birthday/doc;
    # }

    location /static {
        expires 7d;
    }
}
```
