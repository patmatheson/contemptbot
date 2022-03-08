from node:16.3.0-buster-slim
WORKDIR /app
EXPOSE 80 443
EXPOSE 27017 27018
COPY . .
CMD ["node", "out/index.js"]