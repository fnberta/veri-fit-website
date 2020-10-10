import cx from 'classnames';
import { graphql, useStaticQuery } from 'gatsby';
import React, { isValidElement, useState } from 'react';
import Image, { FixedObject } from 'gatsby-image';
import { Icon, IconButton } from '@veri-fit/common-ui';
import { LogosQuery } from './generatedGraphQL';

export interface Props extends React.HTMLProps<HTMLDivElement> {
  variant: 'bright' | 'dark' | 'transparent';
  sticky?: boolean;
}

const LOGOS_QUERY = graphql`
  fragment Logo on File {
    childImageSharp {
      fixed(width: 80) {
        ...GatsbyImageSharpFixed_withWebp_noBase64
      }
    }
  }

  query Logos {
    logoBlack: file(relativePath: { eq: "logo_orange_black.png" }) {
      ...Logo
    }
    logoWhite: file(relativePath: { eq: "logo_orange_white.png" }) {
      ...Logo
    }
  }
`;

function getClasses(variant: Props['variant'], open: boolean) {
  const brightText = 'text-gray-900 hover:bg-gray-200 hover:text-orange-500';
  switch (variant) {
    case 'bright':
      return {
        header: 'bg-white',
        text: brightText,
      };
    case 'dark':
      return {
        header: 'bg-gray-900',
        text: 'text-white hover:bg-gray-700 hover:text-orange-500',
      };
    case 'transparent':
      return {
        nav: open && 'bg-white',
        header: 'absolute z-10 inset-x-0 bg-transparent',
        text: open ? brightText : 'text-white hover:text-gray-200',
      };
  }
}

const Navbar: React.FC<Props> = ({ variant, sticky, children, className, ...rest }) => {
  const [open, setOpen] = useState(false);
  const data = useStaticQuery<LogosQuery>(LOGOS_QUERY);

  const { header, nav, text } = getClasses(variant, open);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const logo = variant === 'bright' ? data.logoBlack!.childImageSharp!.fixed : data.logoWhite!.childImageSharp!.fixed;
  return (
    <header
      className={cx(
        'sm:flex sm:justify-between sm:items-center',
        header,
        sticky && 'fixed inset-x-0 z-50 shadow',
        className,
      )}
      {...rest}
    >
      <div className="px-4 py-2 flex justify-between items-center">
        <Image fixed={logo as FixedObject} alt="Veri-Fit" />
        <IconButton
          className={cx('sm:hidden', text)}
          color="none"
          icon={<Icon className="h-6 w-6" name="menu" />}
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        />
      </div>
      <nav className={cx(nav)}>
        <ul className={cx('px-4 py-2 -mt-1 sm:mt-0 sm:-ml-2 sm:flex', open ? 'block' : 'hidden')}>
          {React.Children.map(children, (child) => (
            <li className="mt-1 sm:mt-0 sm:ml-2 flex">
              {isValidElement(child)
                ? React.cloneElement(child, {
                    className: cx('flex-auto px-2 py-1 rounded', text, child.props.className),
                    onClick: () => setOpen(false),
                  })
                : null}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
