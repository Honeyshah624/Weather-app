FROM nginx:alpine

COPY index.html /usr/share/nginx/html/index.html
COPY Style.css /usr/share/nginx/html/Style.css
COPY Script.js /usr/share/nginx/html/Script.js
COPY Images/ /usr/share/nginx/html/Images/