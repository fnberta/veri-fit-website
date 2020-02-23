import cx from 'classnames';
import React, { isValidElement, useState } from 'react';
import logoBlue from '../images/logo_blue.png';
import logoOrange from '../images/logo_orange.png';

export interface Props extends React.HTMLProps<HTMLDivElement> {
  variant: 'bright' | 'dark' | 'transparent';
  sticky?: boolean;
}

function getClasses(variant: Props['variant'], open: boolean) {
  const brightText = 'text-gray-900 hover:bg-gray-200 hover:text-orange-500';
  switch (variant) {
    case 'bright':
      return {
        header: 'bg-white',
        text: brightText,
        logo: logoBlue,
      };
    case 'dark':
      return {
        header: 'bg-gray-900',
        text: 'text-white hover:bg-gray-700 hover:text-orange-500',
        logo: logoOrange,
      };
    case 'transparent':
      return {
        nav: open && 'bg-white',
        header: 'absolute inset-x-0 bg-transparent',
        text: open ? brightText : 'text-white hover:text-gray-400',
        logo: logoOrange,
      };
  }
}

const Navbar: React.FC<Props> = ({ variant, sticky, children, className, ...rest }) => {
  const [open, setOpen] = useState(false);

  const { header, nav, text, logo } = getClasses(variant, open);
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
        <img className="w-16" src={logo} alt="Veri-Fit" />
        <button
          className="btn btn-medium sm:hidden"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen(prev => !prev)}
        >
          <div className={text}>
            <span className="fas fa-bars fill-current" />
          </div>
        </button>
      </div>
      <nav className={cx(nav)}>
        <ul className={cx('px-4 py-2 -mt-1 sm:mt-0 sm:-ml-2 sm:flex', open ? 'block' : 'hidden')}>
          {React.Children.map(children, child => (
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
