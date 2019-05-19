ARG VERSION

FROM node:${VERSION} as node

ARG DOCKER_PROJECT_DIR
WORKDIR ${DOCKER_PROJECT_DIR}

RUN apt-get update && apt-get install -y --no-install-recommends \
  apt-utils make optipng git procps lsb-release \
  && apt-get autoremove -y \
  && apt-get clean -y \
  && rm -rf /var/lib/apt/lists/*
  && npm i -g npm

ARG HTTP_PORT
EXPOSE ${HTTP_PORT}
