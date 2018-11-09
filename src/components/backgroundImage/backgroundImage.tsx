import {
  BackgroundImage as Background,
  BackgroundImageSrc,
} from '@patternfly/react-core';
import React from 'react';

/**
 * Note: When using background-filter.svg, you must also include #image_overlay as the fragment identifier
 */
const images = {
  [BackgroundImageSrc.lg]: '../../assets/pfbg_1200.jpg',
  [BackgroundImageSrc.md]: '../../assets/pfbg_992.jpg',
  [BackgroundImageSrc.md2x]: '../../assets/pfbg_992@2x.jpg',
  [BackgroundImageSrc.sm]: '../../assets/pfbg_768.jpg',
  [BackgroundImageSrc.sm2x]: '../../assets/pfbg_768@2x.jpg',
  [BackgroundImageSrc.xl]: '../../assets/pfbg_2000.jpg',
  [BackgroundImageSrc.xs]: '../../assets/pfbg_576.jpg',
  [BackgroundImageSrc.xs2x]: '../../assets/pfbg_576@2x.jpg',
  [BackgroundImageSrc.filter]:
    '../../assets/background-filter.svg#image_overlay',
};

const BackgroundImage = () => <Background src={images} />;

export { BackgroundImage };
