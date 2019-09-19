/* eslint-disable @typescript-eslint/no-var-requires */
// TODO: fix a11y errors
/* eslint-disable jsx-a11y/anchor-is-valid, jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus, jsx-a11y/no-static-element-interactions */

import cx from 'classnames';
import React, { useEffect, useState } from 'react';

const logoOrange = require('../images/logo_orange.png');
const logoBlue = require('../images/logo_blue.png');

export interface NavbarItemProps {
  name: string;
  href: string;
  fixed: boolean;
  menuActive: boolean;
}

const NavbarItem: React.FC<NavbarItemProps> = ({ name, href, fixed, menuActive }) => (
  <a className={cx('navbar-item', { 'has-text-light': !fixed && !menuActive })} role="button" href={href}>
    {name}
  </a>
);

const Navbar: React.FC<{}> = () => {
  const [fixed, setFixed] = useState(false);
  const [menuActive, setMenuActive] = useState(false);

  useEffect(() => {
    function handleScroll() {
      const el = window.document.getElementById('home');
      if (el) {
        const { bottom } = el.getBoundingClientRect();
        setFixed(bottom <= 0);
      }
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cx('navbar', fixed ? ['is-fixed-top', 'has-shadow'] : ['is-transparent', 'is-top'])}
      role="navigation"
      aria-label="main navigation"
    >
      <div className="container">
        <div className="navbar-brand">
          <a className="navbar-item" href="#home">
            <img src={fixed ? logoBlue : logoOrange} title="Veri-Fit" alt="Veri-Fit" />
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
            <NavbarItem name="Home" href="#home" fixed={fixed} menuActive={menuActive} />
            <NavbarItem name="Angebot" href="#offer" fixed={fixed} menuActive={menuActive} />
            <NavbarItem name="Stundenplan" href="#schedule" fixed={fixed} menuActive={menuActive} />
            <NavbarItem name="Über mich" href="#about" fixed={fixed} menuActive={menuActive} />
            <NavbarItem name="Kontakt" href="#contact" fixed={fixed} menuActive={menuActive} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
