import { systemConfigServices } from '../../services';
import { systemConfigTypes } from '../constants';

const getSystemConfig = () => dispatch =>
  dispatch({
    type: systemConfigTypes.GET_SYSTEM_CONFIG,
    payload: systemConfigServices.getSystemConfig(),
  });

export { getSystemConfig as default, getSystemConfig };
