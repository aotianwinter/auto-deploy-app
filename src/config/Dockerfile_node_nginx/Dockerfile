FROM node:lts-alpine3.12 as build

# 若依赖下载较慢，可切换为阿里源
RUN npm config set registry https://registry.npm.taobao.org

WORKDIR /tmp/cache

ADD package.json .
# 存在package-lock.json时启用
ADD package-lock.json .
RUN npm install

ADD . .
# 编译指令可自定义
RUN npm run build

FROM socialengine/nginx-spa:latest as nginx
# 编译后文件夹可自定义
COPY --from=build /tmp/cache/dist /app