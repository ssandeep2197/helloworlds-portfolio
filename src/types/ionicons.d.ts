import type { DetailedHTMLProps, HTMLAttributes } from 'react';

type IonIconProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
  name?: string;
  src?: string;
  size?: string;
  color?: string;
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ion-icon': IonIconProps;
    }
  }
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'ion-icon': IonIconProps;
    }
  }
}

export {};
