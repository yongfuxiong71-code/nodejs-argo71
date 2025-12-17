FROM node:18-slim

# 安装执行环境所需的依赖
RUN apt-get update && apt-get install -y \
    curl \
    ca-certificates \
    procps \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 预创建权限目录
RUN mkdir -p /app/tmp && chmod 777 /app/tmp

COPY package.json ./
RUN npm install --production

COPY . .

# 赋予当前目录写权限，方便脚本下载二进制文件
RUN chmod -R 777 /app

EXPOSE 3000

CMD ["node", "index.js"]
