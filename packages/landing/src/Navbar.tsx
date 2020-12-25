import cx from 'classnames';
import { graphql, useStaticQuery } from 'gatsby';
import React, {
  Children,
  cloneElement,
  ComponentPropsWithoutRef,
  FC,
  isValidElement,
  useEffect,
  useState,
} from 'react';
import Image, { FixedObject } from 'gatsby-image';
import { Icon, IconButton } from '@veri-fit/common-ui';
import { LogosQuery } from './generatedGraphQL';

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

function getClasses(sticky: boolean, open: boolean) {
  const brightText = 'text-gray-900 hover:bg-gray-200 hover:text-orange-500';
  if (sticky) {
    return {
      header: 'bg-white',
      text: brightText,
    };
  } else {
    return {
      nav: open && 'bg-white',
      header: 'absolute z-10 inset-x-0 bg-transparent',
      text: open ? brightText : 'text-white hover:text-gray-200',
    };
  }
}

export type Props = ComponentPropsWithoutRef<'header'>;

const Navbar: FC<Props> = ({ children, className, ...rest }) => {
  const [open, setOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const data = useStaticQuery<LogosQuery>(LOGOS_QUERY);
  const { header, nav, text } = getClasses(sticky, open);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const logo = sticky ? data.logoBlack!.childImageSharp!.fixed : data.logoWhite!.childImageSharp!.fixed;

  useEffect(() => {
    function handleScroll() {
      const el = window.document.getElementById('home');
      if (el) {
        const { bottom } = el.getBoundingClientRect();
        setSticky(bottom <= 0);
      }
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          colorScheme="custom"
          icon={<Icon name="menu" size="lg" />}
          label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        />
      </div>
      <nav className={cx(nav)}>
        <ul className={cx('px-4 py-2 -mt-1 sm:mt-0 sm:-ml-2 sm:flex', open ? 'block' : 'hidden')}>
          {Children.map(children, (child) => (
            <li className="mt-1 sm:mt-0 sm:ml-2 flex">
              {isValidElement(child) &&
                cloneElement(child, {
                  className: cx('flex-auto px-2 py-1 rounded', text, child.props.className),
                  onClick: () => setOpen(false),
                })}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
