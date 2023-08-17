FROM nginx:1.23-alpine3.17

RUN rm /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx/nginx.conf

ARG INSTALL_PATH=/usr/share/nginx/html
COPY dist ${INSTALL_PATH}

