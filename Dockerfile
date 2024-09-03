# Sử dụng Node.js phiên bản 20 trên Alpine Linux
FROM node:20-alpine

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép các file cần thiết
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY ecosystem.config.js .
COPY .env.production .
COPY ./src ./src
COPY ./openapi ./openapi

# Cài đặt Python (nếu cần cho các gói npm)
RUN apk add --no-cache python3

# Cài đặt pm2 toàn cục và các module cần thiết
RUN npm install pm2 -g
RUN npm install

# Build ứng dụng
RUN npm run build

EXPOSE 8002

CMD ["pm2-runtime", "start", "ecosystem.config.js", "--env", "production"]