FROM nginx:alpine
WORKDIR /usr/src/app
COPY  ./ /var/www
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
ENTRYPOINT ["nginx","-g","daemon off;"]