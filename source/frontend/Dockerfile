FROM node:18 AS FE_BUILD
COPY . /usr/local/fe-source
WORKDIR /usr/local/fe-source
RUN ls
RUN npm install -g @angular/cli
RUN npm i
RUN npm run build --prod

FROM nginx:1.24
COPY --from=FE_BUILD /usr/local/fe-source/nginx.conf /etc/nginx/
COPY --from=FE_BUILD /usr/local/fe-source/dist/egidio-frontend /usr/share/nginx/html
