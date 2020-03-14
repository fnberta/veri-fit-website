import { CSSObject } from '@emotion/core';

export function parallax(withOverlay?: boolean): CSSObject {
  return {
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundAttachment: 'scroll',
    '@media screen and (min-width: 1023px)': {
      backgroundAttachment: 'fixed',
    },
    ...(withOverlay === true && {
      position: 'relative',
      '&:before': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        content: '""',
        backgroundColor: 'black',
        opacity: 0.5,
      },
    }),
  };
}
