import { BackgroundImage as Background } from '@patternfly/react-core';
import React from 'react';

/**
 * Note: When using background-filter.svg, you must also include #image_overlay as the fragment identifier
 */
const images = {
  lg: '../../assets/pfbg_1200.jpg',
  sm: '../../assets/pfbg_768.jpg',
  sm2x: '../../assets/pfbg_768@2x.jpg',
  xs: '../../assets/pfbg_576.jpg',
  xs2x: '../../assets/pfbg_576@2x.jpg',
};

const BackgroundImage = () => <Background src={images} />;

export { BackgroundImage };
