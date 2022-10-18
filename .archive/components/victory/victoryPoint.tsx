import PropTypes from 'prop-types';
import { Point } from 'victory';
import pathHelpers from './path-helpers';

// Todo: Move this functionality to PF4 react-charts package
class VictoryPoint extends Point {
  public static propTypes = {
    ...Point.propTypes,
    symbol: PropTypes.oneOfType([
      PropTypes.oneOf([
        // Todo: Not importing all due to jest issue
        // 'circle',
        // 'diamond',
        // 'plus',
        'minus',
        // 'square',
        // 'star',
        // 'triangleDown',
        // 'triangleUp',
        'dash',
      ]),
      PropTypes.func,
    ]),
  };

  public getPath(props) {
    return pathHelpers[`${props.symbol}`](props.x, props.y, props.size);
  }
}

export default VictoryPoint;
