import { CSSObject } from '@emotion/core';

export type BoxUnit = number | string;

export function parallax(withOverlay?: boolean): CSSObject {
  return {
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed',
    '@media only screen and (max-device-width: 1023px)': {
      backgroundAttachment: 'scroll',
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

export function verticallySpaced(margin: BoxUnit): CSSObject {
  return {
    '&>*': {
      marginBottom: margin,
    },
    '&>*:last-child': {
      marginBottom: 0,
    },
  };
}

export function horizontallySpaced(margin: BoxUnit): CSSObject {
  return {
    '&>*': {
      marginRight: margin,
    },
    '&>*:last-child': {
      marginRight: 0,
    },
  };
}
