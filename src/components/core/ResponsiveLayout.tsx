import React from 'react';
import { sizes } from 'styles';
import { useWindowSize } from 'hooks';

interface IResponsiveLayout {
  breakpoint?: number;
  mobileView: React.ReactElement;
  desktopView: React.ReactElement;
}

export function ResponsiveLayout(props: IResponsiveLayout) {
  const { breakpoint = sizes.medium, mobileView, desktopView } = props;
  const { width } = useWindowSize();
  if (typeof window === `undefined` || typeof width === `undefined`) {
    return <div />;
  }
  return width > breakpoint ? desktopView : mobileView;
}
