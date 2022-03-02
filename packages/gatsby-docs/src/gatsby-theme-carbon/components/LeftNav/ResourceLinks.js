import React from 'react';
import ResourceLinks from 'gatsby-theme-carbon/src/components/LeftNav/ResourceLinks';

const links = [
  {
    title: 'Github',
    href: 'https://github.com/IBM/spm-ui-upgrade-helper',
  },
  {
    title: 'IBM Documentation',
    href: 'https://www.ibm.com/docs/en/spm/8.0.1?topic=product-overview',
  },
 {
   title: 'Changelog',
   href: 'https://github.com/IBM/spm-ui-upgrade-helper/releases',
 }
];

// shouldOpenNewTabs: true if outbound links should open in a new tab
const CustomResources = () => <ResourceLinks shouldOpenNewTabs links={links} />;

export default CustomResources;
