# 生日管家

## 说明

### 状态

#### Master

[![Build Status](https://travis-ci.org/qious/birthday-server.svg?branch=master)](https://travis-ci.org/qious/birthday-server)
[![Coverage Status](https://coveralls.io/repos/github/qious/birthday-server/badge.svg?branch=master)](https://coveralls.io/github/qious/birthday-server?branch=master)

#### Develop

[![Build Status](https://travis-ci.org/qious/birthday-server.svg?branch=develop)](https://travis-ci.org/qious/birthday-server)
[![Coverage Status](https://coveralls.io/repos/github/qious/birthday-server/badge.svg?branch=develop)](https://coveralls.io/github/qious/birthday-server?branch=develop)

### 特性

- 基于微信企业号/企业微信授权登录
- 新用户授权登录自动分配帐号信息
- 自定义提醒提前天数、提醒时间

### 截图

![生日列表](https://cdn.qiujun.me/image/2018/09/24/c593040463273efb868cb02cbbe92062.png)

![生日详情](https://cdn.qiujun.me/image/2018/09/24/61f8aa3d3698659e4170aea9af860be2.png)

![微信生日列表](https://cdn.qiujun.me/image/2018/09/24/1b68ce630fc0886d4899631672ff1aa6.png)

![生日提醒](https://cdn.qiujun.me/image/2018/09/24/3f4ce9a24185bc995fd9bdb353c33409.png)

## 部署

### 使用 Docker + Docker Compose 部署

- 获取工具文件（docker-compose.yml中用到）

```bash
wget https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh
chmod 755 wait-for-it.sh
```

- 配置 docker-compose.yml

```bash
cat > ./docker-compose.yml << \EOF
version: '3'
services:
  redis:
    image: redis:3
    restart: always
    volumes:
      - "./redis:/data"
  mysql:
    image: dnhsoft/mysql-utf8:5.7
    restart: always
    volumes:
      - "./mysql:/var/lib/mysql"
    environment:
      MYSQL_DATABASE: birthday
      MYSQL_USER: birthday
      MYSQL_PASSWORD: password
  server:
    image: qious/birthday-server
    restart: always
    depends_on:
      - redis
      - mysql
    environment:
      APP_DEBUG: 'true'
      APP_SERVER_BASE_URL: http://example.com/
      APP_KEYS_1: im a newer secret
      APP_KEYS_2: i like turtle
      APP_REDIS_HOST: redis
      APP_REDIS_PORT: 6379
      APP_REDIS_KEY_PREFIX: 'birthday:'
      APP_MYSQL_HOST: mysql
      APP_MYSQL_PORT: 3306
      APP_MYSQL_USER: birthday
      APP_MYSQL_PASSWORD: password
      APP_MYSQL_DATABASE: birthday
      APP_MYSQL_TIMEZONE: 'Asia/Shanghai'
      APP_WECHAT_CORP_ID: wx4e2c2b771c467c9f
      APP_WECHAT_AGENT_ID: 0
      APP_WECHAT_SECRET: secret
      APP_WECHAT_BG_IMAGE: https://cdn.qiujun.me/image/2018/09/04/06c2d3f70e6fed342e2eb43bce55fb43.png!/both/720x400
    volumes:
      - "./wait-for-it.sh:/app/wait-for-it.sh"
    command: ["./wait-for-it.sh", "-t", "0", "mysql:3306", "--", "node", "index.js"]
  client:
    image: qious/birthday-client
    restart: always
    ports:
      - "8888:80"
    depends_on:
      - server
EOF
```

- 运行
```bash
docker-compose up -d
```

- 访问
```
curl http://localhost:8888
```

## 配置文件说明

| 字段   | 描述   |
|:----|:----|
| APP_DEBUG   | 调试模式   |
| APP_SERVER_BASE_URL   | 外部访问地址，形如 https://example.com/   |
| APP_KEYS_1   | 用来加密 Cookie 的随机字符串   |
| APP_KEYS_2   | 用来加密 Cookie 的随机字符串   |
| APP_REDIS_HOST   | Redis 地址   |
| APP_REDIS_PORT   | Redis 端口   |
| APP_REDIS_KEY_PREFIX   | Redis 键前缀   |
| APP_MYSQL_HOST   | MySQL 地址   |
| APP_MYSQL_PORT   | MySQL 端口   |
| APP_MYSQL_USER   | MySQL 用户名   |
| APP_MYSQL_PASSWORD   | MYSQL 密码   |
| APP_MYSQL_DATABASE   | MySQL 数据库名   |
| APP_MYSQL_TIMEZONE   | MySQL 时区   |
| APP_WECHAT_CORP_ID   | 微信 cropId   |
| APP_WECHAT_AGENT_ID   | 微信 agentId   |
| APP_WECHAT_SECRET   | 微信 secret   |
| APP_WECHAT_BG_IMAGE   | 推送生日提醒图文消息时的图片地址   |
