// tslint:disable:no-var-requires

import cx from 'classnames';
import React from 'react';

const logoOrange = require('../images/logo_orange.png');
const logoBlue = require('../images/logo_blue.png');

export interface State {
  fixed: boolean;
  menuActive: boolean;
}

const NavbarItem: React.FC<State & { name: string; href: string }> = ({ name, href, fixed, menuActive }) => (
  <a className={cx('navbar-item', { 'has-text-light': !fixed && !menuActive })} role="button" href={href}>
    {name}
  </a>
);

class Navbar extends React.Component<{}, State> {
  readonly state: State = {
    fixed: false,
    menuActive: false,
  };

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  render() {
    const { fixed, menuActive } = this.state;
    return (
      <nav
        className={cx('navbar', fixed === true ? ['is-fixed-top', 'has-shadow'] : ['is-transparent', 'is-top'])}
        role="navigation"
        aria-label="main navigation"
      >
        <div className="container">
          <div className="navbar-brand">
            <a className="navbar-item" href="#home">
              <img src={fixed === true ? logoBlue : logoOrange} title="Veri-Fit" alt="Veri-Fit" />
            </a>
            <a
              role="button"
              className={cx('navbar-burger', 'burger', {
                'is-active': menuActive,
                'has-text-light': !fixed,
              })}
              aria-label="menu"
              aria-expanded="false"
              onClick={this.handleBurgerClick}
            >
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </a>
          </div>
          <div className={cx('navbar-menu', { 'is-active': menuActive })}>
            <div className="navbar-end" onClick={this.handleItemClick}>
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
  }

  private handleBurgerClick = () => this.setState(state => ({ menuActive: !state.menuActive }));

  private handleItemClick = () => this.setState({ menuActive: false });

  private handleScroll = () => {
    const el = window.document.getElementById('home');
    if (el) {
      const { bottom } = el.getBoundingClientRect();
      this.setState({ fixed: bottom <= 0 });
    }
  };
}

export default Navbar;
