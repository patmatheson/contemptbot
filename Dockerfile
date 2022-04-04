from node:16.3.0-buster-slim
WORKDIR /app
EXPOSE 80 443
EXPOSE 27017 27018
COPY . .
RUN npm install \
    && npm install typescript -g
RUN tsc
CMD ["node", "out/index.js"]