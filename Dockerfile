ARG NODE_VERSION=12.18.3
FROM node:${NODE_VERSION}
WORKDIR /home/theia
ADD *package.json .
ADD lerna.json .
ADD yarn.lock .
RUN yarn install
ADD . .
RUN yarn install
RUN yarn install-all
RUN yarn generate-files

# vs-upgrade-helper-plugin
# The plugin does not support being created using lerna. It has to be a standalone project.
ARG NODE_VERSION=12.18.3
FROM node:${NODE_VERSION}
WORKDIR /home/plugins
ADD ./packages/vs-upgrade-helper-plugin/ .
COPY --from=0 --chown=theia:theia \
    /home/theia/packages/vs-upgrade-helper-plugin/src/functions.ts \
    /home/plugins/packages/vs-upgrade-helper-plugin/src
# Copy and run feature flags utility
WORKDIR /home/feature-flags
ADD ./packages/feature-flags/ .
ADD ./config/tools.json ./tools.json
ARG show_all_tools=false
RUN yarn install
RUN yarn feature-flags $show_all_tools
# Build plugins
WORKDIR /home/plugins
RUN yarn install
RUN yarn compile
RUN yarn build

FROM node:${NODE_VERSION}-alpine
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
COPY --from=0 --chown=theia:theia /home/theia /home/theia
COPY --from=1 --chown=theia:theia /home/plugins/*.vsix /home/theia/plugins/
RUN cp -R /home/theia/packages/browser-app/plugins/* /home/theia/plugins/
EXPOSE 3000
EXPOSE 4000-4002
ENV SHELL=/bin/bash \
    THEIA_DEFAULT_PLUGINS=local-dir:/home/theia/plugins
ENV USE_LOCAL_GIT true
ENV GIT_DISCOVERY_ACROSS_FILESYSTEM 1
USER theia
RUN git config --global user.email "upgrade@helper.com"
RUN echo "{\"recentRoots\":[\"/home/workspace\"]}" > /home/theia/.theia/recentworkspace.json
ENTRYPOINT [ "yarn", "start" ]
