import cx from 'classnames';
import React, { ComponentPropsWithoutRef, FC, useState } from 'react';
import { IconButton } from '@veri-fit/common-ui';
import { LinkProps, NavLink } from 'react-router-dom';
import Logo from './logo-orange-white.png';
import { LinkIconButton } from './LinkButton';

export function NavbarLink<T>({ children, className, onClick, ...rest }: LinkProps<T>) {
  return (
    <li className={cx('mt-1 sm:mt-0 sm:ml-2 flex', className)}>
      <NavLink
        className="flex-auto px-2 py-1 rounded hover:bg-gray-700 text-white hover:text-orange-500"
        activeClassName="bg-gray-700 text-orange-500"
        {...rest}
      >
        {children}
      </NavLink>
    </li>
  );
}

export interface Props extends ComponentPropsWithoutRef<'header'> {
  upTarget?: string;
}

const Navbar: FC<Props> = ({ upTarget, children, className, ...rest }) => {
  const [open, setOpen] = useState(false);
  return (
    <header
      className={cx('sm:flex sm:justify-between sm:items-center bg-gray-900 relative shadow-md', className)}
      {...rest}
    >
      <div className="px-4 py-2 flex justify-between items-center">
        <div className="relative flex items-center">
          {upTarget && (
            <LinkIconButton
              className={cx(
                'absolute bg-white bg-opacity-0 hover:bg-opacity-5 active:bg-opacity-10 text-white hover:text-orange-500',
              )}
              colorScheme="custom"
              icon="arrow-left"
              label="Zurück"
              shape="text"
              to="/clients"
            />
          )}
          <div className="pl-14">
            <img className="w-20" src={Logo} alt="Veri-Fit" />
          </div>
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
      <nav>
        <ul
          className={cx('p-4 sm:px-4 sm:py-2 sm:flex space-y-1 sm:space-y-0 sm:space-x-2', open ? 'block' : 'hidden')}
        >
          <NavbarLink to="/clients" onClick={() => setOpen(false)}>
            Kunden
          </NavbarLink>
          <NavbarLink to="/trainings" onClick={() => setOpen(false)}>
            Trainings
          </NavbarLink>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
