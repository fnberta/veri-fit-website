import cx from 'classnames';
import React, { ComponentPropsWithoutRef, createContext, FC, useContext, useState } from 'react';
import { IconButton } from '@veri-fit/common-ui';
import { NavLink, LinkProps, useHistory, useLocation } from 'react-router-dom';
import Logo from './logo-orange-white.png';

interface NavbarContextValues {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const NavbarContext = createContext<NavbarContextValues>({ open: false, setOpen: (open) => open });

export type Props = ComponentPropsWithoutRef<'header'>;

const Navbar: FC<Props> = ({ children, className, ...rest }) => {
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const { pathname } = useLocation();
  const segments = pathname.split('/');
  const showBack = segments.length > 2;
  return (
    <header
      className={cx('sm:flex sm:justify-between sm:items-center bg-gray-900 relative shadow-md', className)}
      {...rest}
    >
      <div className="px-4 py-2 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {showBack && <IconButton icon="arrow-left" label="Zurück" shape="text" onClick={() => history.goBack()} />}
          <img className="w-20" src={Logo} alt="Veri-Fit" />
        </div>
        <IconButton
          className={cx('sm:hidden hover:bg-gray-700 text-white hover:text-orange-500')}
          colorScheme="custom"
          icon="menu"
          label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        />
      </div>
      <NavbarContext.Provider value={{ open, setOpen }}>
        <nav>
          <ul className={cx('px-4 py-2 -mt-1 sm:mt-0 sm:-ml-2 sm:flex', open ? 'block' : 'hidden')}>{children}</ul>
        </nav>
      </NavbarContext.Provider>
    </header>
  );
};

export default Navbar;

export function NavbarLink<T>({ children, className, onClick, ...rest }: LinkProps<T>) {
  const { setOpen } = useContext(NavbarContext);
  return (
    <li className={cx('mt-1 sm:mt-0 sm:ml-2 flex', className)}>
      <NavLink
        className="flex-auto px-2 py-1 rounded hover:bg-gray-700 text-white hover:text-orange-500"
        activeClassName="bg-gray-700 text-orange-500"
        onClick={(e) => {
          setOpen(false);
          if (onClick) {
            onClick(e);
          }
        }}
        {...rest}
      >
        {children}
      </NavLink>
    </li>
  );
}
