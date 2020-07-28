FROM node:lts-alpine3.12 as build

# 若依赖下载较慢，可切换为阿里源
RUN npm config set registry https://registry.npm.taobao.org

WORKDIR /tmp/cache

ADD package.json .
RUN npm install

ADD . .
RUN npm run build

FROM socialengine/nginx-spa:latest as nginx

COPY --from=build /tmp/cache/build /app