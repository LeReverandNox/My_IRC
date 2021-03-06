FROM library/node:8.3

RUN npm install -g bower

RUN mkdir /src

ADD src/package.json /src
ADD src/bower.json /src
ADD src/.bowerrc /src

WORKDIR /src

RUN npm install
RUN bower install --allow-root

ADD src /src

EXPOSE 80

ENTRYPOINT ["npm", "run", "start"]
