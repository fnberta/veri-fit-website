// TODO: fix a11y errors
/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */

import cx from 'classnames';
import React, { isValidElement, useState } from 'react';
import { Container } from './bulma/Page';

export interface Props {
  fixed: boolean;
  logo: React.ReactNode;
}

const Navbar: React.FC<Props> = ({ fixed, logo, children }) => {
  const [menuActive, setMenuActive] = useState(false);
  return (
    <nav className={cx('navbar', fixed ? ['has-shadow'] : ['is-transparent', 'is-top'])} aria-label="main">
      <Container>
        <div className="navbar-brand">
          <a className="navbar-item" href="/#home">
            {logo}
          </a>
          <button
            className={cx('navbar-burger', 'burger', 'button', 'is-white', {
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
          </button>
        </div>
        <div className={cx('navbar-menu', { 'is-active': menuActive })}>
          <div className="navbar-end" onClick={() => setMenuActive(false)}>
            {React.Children.map(children, child =>
              isValidElement(child)
                ? React.cloneElement(child, {
                    className: cx(child.props.className, 'navbar-item', { 'has-text-light': !fixed && !menuActive }),
                  })
                : null,
            )}
          </div>
        </div>
      </Container>
    </nav>
  );
};

export default Navbar;
