ARG NODE_VERSION=12.18.3
FROM node:${NODE_VERSION} AS install-root
WORKDIR /home/theia
ADD LICENSE LICENSE
ADD README.md README.md
ADD package.json package.json
ADD lerna.json lerna.json
ADD yarn.lock yarn.lock
RUN yarn install

FROM install-root AS install-packages
WORKDIR /home/theia
ADD packages packages
ADD config config
RUN yarn install-all-docker

# commit.json is at the top of the layers because it changes frequently
FROM install-packages AS copy-json
ADD *.json ./

# vs-upgrade-helper-plugin
# The plugin does not support being created using lerna. It has to be a standalone project.
ARG NODE_VERSION=12.18.3
FROM node:${NODE_VERSION} AS plugins
RUN addgroup theia && \
    adduser -G theia -s /bin/sh -D theia;
USER theia
WORKDIR /home/plugins
ADD packages/vs-upgrade-helper-plugin/ .
COPY --from=install-packages --chown=theia:theia \
    /home/theia/packages/vs-upgrade-helper-plugin/src/functions.ts \
    /home/plugins/packages/vs-upgrade-helper-plugin/src
# Copy and run the 'show-dev-shortcuts' utility
ADD packages/shared-utils /tmp/packages/shared-utils
ADD packages/show-dev-shortcuts /tmp/packages/show-dev-shortcuts
ADD config/tools.json config/tools.json
RUN cd /tmp/packages/shared-utils && yarn install
RUN cd /tmp/packages/show-dev-shortcuts && yarn install
ARG dev_mode
RUN cd /tmp/packages/show-dev-shortcuts && yarn show-dev-shortcuts $dev_mode
# Build plugin
WORKDIR /home/plugins
RUN yarn install
RUN yarn compile
RUN yarn build

# Reference theia here because we will want to copy from it later
FROM theiaide/theia:1.14.0 as theia

FROM node:${NODE_VERSION}-alpine AS final
# See : https://github.com/theia-ide/theia-apps/issues/34
RUN addgroup theia && \
    adduser -G theia -s /bin/sh -D theia;
RUN chmod g+rw /home && \
    mkdir -p /home/workspace/input && \
    mkdir -p /home/workspace/output && \
    mkdir -p /home/workspace/rules && \
    mkdir -p /home/workspace/ignore && \
    mkdir -p /home/theia/.theia && \
    mkdir -p /home/project && \
    chown -R theia:theia /home/theia && \
    chown -R theia:theia /home/workspace && \
    chown -R theia:theia /home/project;
RUN apk add --no-cache git openssh bash
ENV HOME /home/theia
WORKDIR /home/theia
COPY --from=copy-json --chown=theia:theia /home/theia /home/theia
COPY --from=plugins --chown=theia:theia /home/plugins/*.vsix /home/theia/plugins/
COPY --from=theia --chown=theia:theia /home/theia /home/theia/browser-app
RUN cp -R /home/theia/browser-app/plugins/* /home/theia/plugins/
EXPOSE 3000
EXPOSE 4000-4004
ENV SHELL=/bin/bash \
    THEIA_DEFAULT_PLUGINS=local-dir:/home/theia/plugins
ENV USE_LOCAL_GIT true
ENV GIT_DISCOVERY_ACROSS_FILESYSTEM 1
USER theia
RUN git config --global user.email "upgrade@helper.com"
ENTRYPOINT [ "yarn", "start" ]
