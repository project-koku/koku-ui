import axios from 'axios';
import serviceConfig from './config';

/**
 * @api {get} /api/v1/sysconfig/ Get system configuration
 * @apiDescription Return system configuration strings.
 *
 * @apiHeader {String} Authorization Authorization: Token AUTH_TOKEN
 * @apiSuccess {String} count
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "aws_account_id": "1234567890"
 *     }
 * @apiError {String} detail
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "detail": "Authentication credentials were not provided."
 *     }
 */
const getSystemConfig = () =>
  axios(
    serviceConfig({
      url: process.env.REACT_APP_SYSTEM_CONFIG_SERVICE,
    })
  );

export { getSystemConfig as default, getSystemConfig };
