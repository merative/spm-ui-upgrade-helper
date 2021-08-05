[<< Back to the developer guide](developer_guide)

# Documentation

The documentation lives in the `docs` folder.

We build the [documentation site](https://ibm.github.io/spm-ui-upgrade-helper/) during the Travis build using Gatsby and we deploy it to Github Pages.

The build copies the `docs` folder to `packages/gatsby-docs/src/pages`, makes some minor alternations to make it work with the Carbon theme, and deploys it. Specifically, it converts the level 1 headings into "title" attributes, and removes the `[<< Back to previous page]` links.

Doing this allows us to keep our documentation files in the `docs` folder in case we ever need to switch back to using standard Github pages (for example if there is an error in the Gatsby deploy.)

Note that the Gatsby navigation sidebar is hand-crafted, so if you add a new page or move or rename an existing page you will have to update `packages/gatsby-docs/src/data/nav-items.yaml` to match.

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

Gatsby will only be deployed if the build contains changes to the `docs` or `packages/gatsby-docs` folders. This is done to speed up the build.

See https://github.com/IBM/spm-ui-upgrade-helper/blob/main/packages/gatsby-docs/gatsby-conditional-deploy-cli.js

## Switching between Gatsby and GitHub Pages

If you need to switch back to GitHub Pages, for example while you fix an error in the Gatsby deploy, you can do so by navigating to https://github.com/IBM/spm-ui-upgrade-helper/settings/pages and changing the branch to `main` and the folder to `/docs`.

To change back to Gatsby, set the branch to `gh-pages` and the folder to `/`.
