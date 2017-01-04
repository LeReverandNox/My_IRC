FROM library/node:7.3

RUN mkdir /src

ADD src/package.json /src

WORKDIR /src

RUN npm install

ADD src /src

EXPOSE 80

CMD npm start
