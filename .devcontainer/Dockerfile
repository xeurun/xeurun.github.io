# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.234.0/containers/typescript-node/.devcontainer/base.Dockerfile

ARG VARIANT
FROM mcr.microsoft.com/devcontainers/typescript-node:1-${VARIANT}

RUN SNIPPET="export PROMPT_COMMAND='history -a' && export HISTFILE=/commandhistory/.bash_history" \
    && echo "$SNIPPET" >> "/root/.bashrc"
