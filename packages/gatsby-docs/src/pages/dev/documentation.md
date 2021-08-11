---
title: Documentation
---

We build the [documentation](https://ibm.github.io/spm-ui-upgrade-helper/) with Gatsby and deploy it to Github Pages.

## Local development with Gatsby

- `cd packages/gatsby-docs`
- `yarn install`
- `yarn gatsby:dev`
- Open [http://localhost:8000](http://localhost:8000)
- The page will hot-reload when you make changes

## Gatsby and Travis

Gatsby will only be deployed if the build contains changes to the `packages/gatsby-docs` folder. This is done to speed up the build.
