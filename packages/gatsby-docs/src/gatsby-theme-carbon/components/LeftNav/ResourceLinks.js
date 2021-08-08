import React from 'react';
import ResourceLinks from 'gatsby-theme-carbon/src/components/LeftNav/ResourceLinks';

const links = [
  {
    title: 'Github',
    href: 'https://github.com/IBM/spm-ui-upgrade-helper',
  },
  {
    title: 'IBM Documentation',
    href: 'https://www.ibm.com/docs/en/spm/7.0.11?topic=product-overview',
  },
//  {
//    title: 'Change Log',
//    href: 'https://github.com/IBM/spm-ui-upgrade-helper/blob/main/CHANGELOG.md',
//  }
];

// shouldOpenNewTabs: true if outbound links should open in a new tab
const CustomResources = () => <ResourceLinks shouldOpenNewTabs links={links} />;

export default CustomResources;