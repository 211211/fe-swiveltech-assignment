/* eslint-disable @next/next/no-img-element */
import LazyLoad, { LazyLoadProps } from 'react-lazyload';
import styled, { keyframes } from 'styled-components';

import React from 'react';

type ImageProps = React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
> & {
  lazyload?: LazyLoadProps;
};

export function Image({ lazyload, ...rest }: ImageProps) {
  return (
    <LazyLoad {...lazyload} placeholder={<Placeholder />}>
      <img {...rest} alt={rest.alt} />
    </LazyLoad>
  );
}

const loadingAnimation = keyframes`
  0% {
    background-color: #fff;
  }
  50% {
    background-color: #ccc;
  }
  100% {
    background-color: #fff;
  }
`;

const Placeholder = styled.div`
  width: 100%;
  border-radius: 5px;
  animation: ${loadingAnimation} 1s infinite;
`;
