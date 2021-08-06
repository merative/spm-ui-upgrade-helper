---
title: Documentation
---

The documentation lives in the `packages/gatsby-docs/src` folder.

We build the [documentation site](https://ibm.github.io/spm-ui-upgrade-helper/) during the Travis build using Gatsby and we deploy it to Github Pages.

## Local development with Gatsby

- `cd packages/gatsby-docs`
- `yarn install`
- `yarn gatsby:dev`
- Open [http://localhost:8000](http://localhost:8000)
- Make changes and run `yarn convert-docs`
- The page will hot-reload

## Local development without Gatsby

- View markdown files in VSCode
- `cmd + shift + v` to preview the files
- Pages will hot-reload on changes

## Gatsby and Travis

Gatsby will only be deployed if the build contains changes to the `packages/gatsby-docs` folder. This is done to speed up the build.

See https://github.com/IBM/spm-ui-upgrade-helper/blob/main/packages/gatsby-docs/gatsby-conditional-deploy-cli.js
