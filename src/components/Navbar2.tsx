// TODO: fix a11y errors
/* eslint-disable jsx-a11y/anchor-is-valid, jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus, jsx-a11y/no-static-element-interactions */

import cx from 'classnames';
import React, { useState } from 'react';
import { Container } from './bulma/Page';

export interface NavbarItemProps {
  name: string;
  href: string;
  fixed: boolean;
  menuActive: boolean;
}

export const NavbarItem: React.FC<NavbarItemProps> = ({ name, href, fixed, menuActive }) => (
  <a className={cx('navbar-item', { 'has-text-light': !fixed && !menuActive })} role="button" href={href}>
    {name}
  </a>
);

export interface Props {
  fixed: boolean;
  logo: React.ReactNode;
}

const Navbar: React.FC<Props> = ({ fixed, logo, children }) => {
  const [menuActive, setMenuActive] = useState(false);
  return (
    <nav
      className={cx('navbar', fixed ? ['is-fixed-top', 'has-shadow'] : ['is-transparent', 'is-top'])}
      role="navigation"
      aria-label="main navigation"
    >
      <Container>
        <div className="navbar-brand">
          <a className="navbar-item" href="#home">
            {logo}
          </a>
          <a
            role="button"
            className={cx('navbar-burger', 'burger', {
              'is-active': menuActive,
              'has-text-light': !fixed,
            })}
            aria-label="menu"
            aria-expanded="false"
            onClick={() => setMenuActive(active => !active)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </a>
        </div>
        <div className={cx('navbar-menu', { 'is-active': menuActive })}>
          <div className="navbar-end" onClick={() => setMenuActive(false)}>
            {children}
          </div>
        </div>
      </Container>
    </nav>
  );
};

export default Navbar;
