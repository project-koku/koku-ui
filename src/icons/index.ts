import * as faBars from '@fortawesome/free-solid-svg-icons/faBars';
import createIcon from '@patternfly/react-icons/dist/js/createIcon';

const Bars = (createIcon as any)({
  name: 'Bars',
  height: faBars.height,
  width: faBars.width,
  svgPath: faBars.svgPathData,
});

export { Bars };
