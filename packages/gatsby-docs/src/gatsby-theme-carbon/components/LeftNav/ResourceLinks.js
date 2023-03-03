import React from 'react';
import ResourceLinks from 'gatsby-theme-carbon/src/components/LeftNav/ResourceLinks';

const links = [
  {
    title: 'Github',
    href: 'https://github.com/merative/spm-ui-upgrade-helper',
  },
  {
    title: 'Merative documentation',
    href: 'https://curam-spm-devops.github.io/wh-support-docs/spm/pdf-documentation',
  },
 {
   title: 'Changelog',
   href: 'https://github.com/merative/spm-ui-upgrade-helper/releases',
 }
];

// shouldOpenNewTabs: true if outbound links should open in a new tab
const CustomResources = () => <ResourceLinks shouldOpenNewTabs links={links} />;

export default CustomResources;
