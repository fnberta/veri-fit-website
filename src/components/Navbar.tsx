// tslint:disable:no-var-requires

import cx from 'classnames';
import React from 'react';

const logoOrange = require('../images/logo_orange.png');
const logoBlue = require('../images/logo_blue.png');

export interface State {
  fixed: boolean;
  menuActive: boolean;
}

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
        className={cx(
          'navbar',
          fixed === true ? ['is-fixed-top', 'has-shadow'] : ['is-dark', 'is-transparent', 'is-top'],
        )}
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
              className={cx('navbar-burger', 'burger', menuActive === true && 'is-active')}
              aria-label="menu"
              aria-expanded="false"
              onClick={this.handleBurgerClick}
            >
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </a>
          </div>
          <div className={cx('navbar-menu', menuActive === true && 'is-active')}>
            <div className="navbar-end" onClick={this.handleItemClick}>
              <a className="navbar-item" role="button" href="#home">
                Home
              </a>
              <a className="navbar-item" role="button" href="#offer">
                Angebot
              </a>
              <a className="navbar-item" role="button" href="#pricing">
                Preise
              </a>
              <a className="navbar-item" role="button" href="#about">
                Über mich
              </a>
              <a className="navbar-item" role="button" href="#contact">
                Kontakt
              </a>
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
