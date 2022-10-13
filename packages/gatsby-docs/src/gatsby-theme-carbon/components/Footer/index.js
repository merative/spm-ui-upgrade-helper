import React from 'react';
import Footer from 'gatsby-theme-carbon/src/components/Footer';

const Content = ({ buildTime }) => (
  <>
    <p>
      Last built: {buildTime}
      <br />
      &copy; Merative US L.P. 2021, 2022
    </p>
  </>
);

// const links = {
//   firstCol: [
//     { href: 'https://ibm.com/design', linkText: 'Shadowed link' },
//     { href: 'https://ibm.com/design', linkText: 'Shadowed link' },
//     { href: 'https://ibm.com/design', linkText: 'Shadowed link' },
//   ],
//   secondCol: [
//     { href: 'https://ibm.com/design', linkText: 'Shadowed link' },
//     { href: 'https://ibm.com/design', linkText: 'Shadowed link' },
//     { href: 'https://ibm.com/design', linkText: 'Shadowed link' },
//     { href: 'https://ibm.com/design', linkText: 'Shadowed link' },
//   ],
// };
const links = {};

const CustomFooter = () => <Footer links={links} Content={Content} />;

export default CustomFooter;
