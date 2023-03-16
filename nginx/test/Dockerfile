FROM registry.sptek/nginx-paas-portal:1.17.6-alpine-6

RUN rm /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx/nginx.conf

ARG INSTALL_PATH=/usr/share/nginx/html
COPY dist ${INSTALL_PATH}

