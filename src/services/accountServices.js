import axios from 'axios';
import serviceConfig from './config';
import apiTypes from '../store/constants/apiConstants';

/**
 * @api {post} /api/v1/account/ Post account
 * @apiDescription Add an account.
 * @apiDescription Use this endpoint to add an account.
 *
 * Reference [cloudigrade/test_views.py#L200](https://gitlab.com/cloudigrade/cloudigrade/blob/master/cloudigrade/account/tests/test_views.py#L200)
 *
 * @apiParam (Request message body) {String} [name] Account name
 * @apiParam (Request message body) {String} account_arn ARN in the form of "arn:aws:iam::123456789012:role/Cloud-Meter-role"
 * @apiParam (Request message body) {String} resourcetype Resource type, standard is currently "AwsAccount"
 *
 * @apiHeader {String} Authorization Authorization: Token AUTH_TOKEN
 * @apiSuccess {String} account_arn
 * @apiSuccess {String} aws_account_id
 * @apiSuccess {Date} created_at
 * @apiSuccess {Number} id
 * @apiSuccess {String} name
 * @apiSuccess {String} resourcetype
 * @apiSuccess {Date} updated_at
 * @apiSuccess {String} url
 * @apiSuccess {Number} user_id
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "account_arn": "arn:aws:iam::273470430754:role/role-for-cloudigrade",
 *       "aws_account_id": "273470430754",
 *       "created_at": "2018-07-05T16:01:30.046877Z",
 *       "id": 4,
 *       "name": "Lorem ipsum",
 *       "resourcetype": "AwsAccount",
 *       "updated_at": "2018-07-05T16:01:30.046910Z",
 *       "url": "http://localhost:8080/api/v1/account/4/",
 *       "user_id": 2
 *     }
 * @apiError {String} detail
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "detail": "Authentication credentials were not provided."
 *     }
 * @apiError {String} detail
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "account_arn": [
 *          "account_arn is required"
 *       ]
 *     }
 */
const addAccount = (data = {}) =>
  axios(
    serviceConfig({
      method: 'post',
      url: process.env.REACT_APP_ACCOUNTS_SERVICE,
      data,
    })
  );

/**
 * @api {get} /api/v1/account/:id/ Get account
 * @apiDescription Retrieve a specific account.
 *
 * Reference [cloudigrade/test_views.py#L320](https://gitlab.com/cloudigrade/cloudigrade/blob/master/cloudigrade/account/tests/test_views.py#L320)
 *
 * Reference [cloudigrade/test_views.py#L499](https://gitlab.com/cloudigrade/cloudigrade/blob/master/cloudigrade/account/tests/test_views.py#L499)
 *
 * @apiParam {Number} id Account identifier
 *
 * @apiHeader {String} Authorization Authorization: Token AUTH_TOKEN
 * @apiSuccess {String} account_arn
 * @apiSuccess {String} aws_account_id
 * @apiSuccess {Date} created_at
 * @apiSuccess {Number} id
 * @apiSuccess {String} name
 * @apiSuccess {String} resourcetype
 * @apiSuccess {Date} updated_at
 * @apiSuccess {String} url
 * @apiSuccess {Number} user_id
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "account_arn": "arn:aws:iam::273470430754:role/role-for-cloudigrade",
 *       "aws_account_id": "273470430754",
 *       "created_at": "2018-07-05T16:01:30.046877Z",
 *       "id": 4,
 *       "name": "Lorem Ipsum",
 *       "resourcetype": "AwsAccount",
 *       "updated_at": "2018-07-05T16:01:30.046910Z",
 *       "url": "http://localhost:8080/api/v1/account/4/",
 *       "user_id": 2
 *     }
 * @apiError {String} detail
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "detail": "Authentication credentials were not provided."
 *     }
 */
const getAccount = id =>
  axios(
    serviceConfig({
      url: `${process.env.REACT_APP_ACCOUNTS_SERVICE}${id}/`,
    })
  );

/**
 * @api {get} /api/v1/report/accounts/ Get accounts overview
 * @apiDescription List all accounts, and their summaries.
 *
 * Reference [cloudigrade/test_views.py#L1270](https://gitlab.com/cloudigrade/cloudigrade/blob/master/cloudigrade/account/tests/test_views.py#L1270)
 *
 * @apiParam (Query string) {Mixed} [account_id] Identifier to filter result set by account
 * @apiParam (Query string) {String} [name_pattern] Identifier associated with a specific user
 * @apiParam (Query string) {Date} start Start date in ISO format
 * @apiParam (Query string) {Date} end End date in ISO format
 *
 * @apiHeader {String} Authorization Authorization: Token AUTH_TOKEN
 * @apiSuccess {Array} cloud_account_overviews
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "cloud_account_overviews": [
 *         {
 *           "arn": "arn:aws:iam::114204391493:role/role-for-cloudigrade",
 *           "cloud_account_id": "114204391493",
 *           "creation_date": "2018-07-06T15:09:21.442412Z",
 *           "id": 1,
 *           "images": 1,
 *           "instances": 2,
 *           "name": "Lorem ipsum",
 *           "openshift_instances": null,
 *           "rhel_instances": 2,
 *           "type": "aws",
 *           "user_id": 1
 *         },
 *         {
 *           "arn": "arn:aws:iam::114204391460:role/role-for-cloudigrade",
 *           "cloud_account_id": "114204391460",
 *           "creation_date": "2018-07-06T15:09:10.442412Z",
 *           "id": 2,
 *           "images": 1,
 *           "instances": 1,
 *           "name": "Dolor",
 *           "openshift_instances": 1,
 *           "rhel_instances": null,
 *           "type": "aws",
 *           "user_id": 1
 *         }
 *       ]
 *     }
 * @apiError {String} end
 * @apiError {String} start
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "end": [
 *         "This field is required."
 *       ],
 *       "start": [
 *         "This field is required."
 *       ]
 *     }
 * @apiError {String} detail
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "detail": "Authentication credentials were not provided."
 *     }
 */
const getAccounts = (query = {}) =>
  axios(
    serviceConfig({
      url: process.env.REACT_APP_ACCOUNTS_SERVICE_OVERVIEW,
      params: query,
    })
  );

/**
 * @api {get} /api/v1/report/images/ Get images
 * @apiDescription Get images for an account (or account detail).
 *
 * Reference [cloudigrade/test_views.py#L1722](https://gitlab.com/cloudigrade/cloudigrade/blob/master/cloudigrade/account/tests/test_views.py#L1722)
 *
 * @apiParam (Query string) {Mixed} [user_id] Identifier associated with a specific user
 * @apiParam (Query string) {Mixed} account_id Identifier to filter result set by account
 * @apiParam (Query string) {Date} start Start date in ISO format
 * @apiParam (Query string) {Date} end End date in ISO format
 *
 * @apiHeader {String} Authorization Authorization: Token AUTH_TOKEN
 * @apiSuccess {Array} images
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "images": [
 *         {
 *           "cloud_image_id": "ami-rhel7",
 *           "id": 2,
 *           "instances_seen": 2,
 *           "is_encrypted": false,
 *           "name": null,
 *           "openshift": false,
 *           "openshift_challenged": false,
 *           "openshift_detected": false,
 *           "rhel": true,
 *           "rhel_challenged": false,
 *           "rhel_detected": true,
 *           "runtime_seconds": 86400.5,
 *           "status": "inspected"
 *         },
 *         {
 *           "cloud_image_id": "ami-rhel8",
 *           "id": 7,
 *           "instances_seen": 1,
 *           "is_encrypted": false,
 *           "name": null,
 *           "openshift": false,
 *           "openshift_challenged": false,
 *           "openshift_detected": false,
 *           "rhel": true,
 *           "rhel_challenged": false,
 *           "rhel_detected": true,
 *           "runtime_seconds": 3600.0,
 *           "status": "inspected"
 *         },
 *         {
 *           "cloud_image_id": "ami-plain",
 *           "id": 9,
 *           "instances_seen": 1,
 *           "is_encrypted": false,
 *           "name": null,
 *           "openshift": true,
 *           "openshift_challenged": false,
 *           "openshift_detected": false,
 *           "rhel": false,
 *           "rhel_challenged": false,
 *           "rhel_detected": false,
 *           "runtime_seconds": 8000.0,
 *           "status": "inspected"
 *         }
 *       ]
 *     }
 * @apiError {String} detail
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "detail": "Authentication credentials were not provided."
 *     }
 */
/**
 * FixMe: API - issue
 * The API requires the account id be passed as a query param. In order to emulate consistent
 * routing behavior we handle that query bundle at the service level instead.
 */
const getAccountImages = (id, query = {}) =>
  axios(
    serviceConfig({
      url: process.env.REACT_APP_ACCOUNTS_SERVICE_IMAGES,
      params: {
        ...{ [apiTypes.API_QUERY_ACCOUNT_ID]: id },
        ...query,
      },
    })
  );

/**
 * @api {get} /api/v1/report/instances/ Get instances
 * @apiDescription Get instances to graph, for an account (or account detail).
 *
 * Reference [cloudigrade/test_views.py#L1516](https://gitlab.com/cloudigrade/cloudigrade/blob/master/cloudigrade/account/tests/test_views.py#L1516)
 *
 * @apiParam (Query string) {Mixed} [user_id] Identifier associated with a specific user
 * @apiParam (Query string) {Mixed} [account_id] Identifier to filter result set by account
 * @apiParam (Query string) {Mixed} [name_pattern] Filter the result set
 * @apiParam (Query string) {Date} start Start date in ISO format
 * @apiParam (Query string) {Date} end End date in ISO format
 *
 * @apiHeader {String} Authorization Authorization: Token AUTH_TOKEN
 * @apiSuccess {Array} daily_usage
 * @apiSuccess {Number} instances_seen_with_openshift
 * @apiSuccess {Number} instances_seen_with_rhel
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "daily_usage": [
 *         {
 *           "date": "2018-08-01T00:00:00Z",
 *           "openshift_instances": 0,
 *           "openshift_runtime_seconds": 0.0,
 *           "rhel_instances": 1,
 *           "rhel_runtime_seconds": 54000.0
 *         },
 *         {
 *           "date": "2018-08-02T00:00:00Z",
 *           "openshift_instances": 0,
 *           "openshift_runtime_seconds": 0.0,
 *           "rhel_instances": 1,
 *           "rhel_runtime_seconds": 500.0
 *         },
 *         {
 *           "date": "2018-08-03T00:00:00Z",
 *           "openshift_instances": 0,
 *           "openshift_runtime_seconds": 0.0,
 *           "rhel_instances": 2,
 *           "rhel_runtime_seconds": 9600.0
 *         },
 *         {
 *           "date": "2018-08-04T00:00:00Z",
 *           "openshift_instances": 1,
 *           "openshift_runtime_seconds": 8000.0,
 *           "rhel_instances": 2,
 *           "rhel_runtime_seconds": 9500.0
 *         },
 *         {
 *           "date": "2018-08-05T00:00:00Z",
 *           "openshift_instances": 0,
 *           "openshift_runtime_seconds": 0.0,
 *           "rhel_instances": 2,
 *           "rhel_runtime_seconds": 10000.0
 *         },
 *         {
 *           "date": "2018-08-06T00:00:00Z",
 *           "openshift_instances": 0,
 *           "openshift_runtime_seconds": 0.0,
 *           "rhel_instances": 2,
 *           "rhel_runtime_seconds": 7600.0
 *         }
 *       ],
 *       "instances_seen_with_openshift": 1,
 *       "instances_seen_with_rhel": 3
 *     }
 * @apiError {String} detail
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "detail": "Authentication credentials were not provided."
 *     }
 */
/**
 * FixMe: API - review
 * The API requires the account id be passed as a query param. This scenario
 * appears to mesh a little better since it's not part of the primary display
 * list. See "getAccountImages" for similar behavior
 */
const getAccountInstances = (id = null, query = {}) =>
  axios(
    serviceConfig({
      url: process.env.REACT_APP_ACCOUNTS_SERVICE_INSTANCES,
      params: {
        ...{ [apiTypes.API_QUERY_ACCOUNT_ID]: id },
        ...query,
      },
    })
  );

/**
 * @api {put} /api/v1/account/:id/ Put account
 * @apiDescription Update a specific account.
 *
 * Reference [cloudigrade/test_views.py#L200](https://gitlab.com/cloudigrade/cloudigrade/blob/master/cloudigrade/account/tests/test_views.py#L200)
 *
 * @apiParam {Number} id Account identifier
 * @apiParam (Request message body) {String} name Account name
 * @apiParam (Request message body) {String} account_arn ARN in the form of "arn:aws:iam::123456789012:role/Cloud-Meter-role"
 * @apiParam (Request message body) {String} resourcetype Resource type, standard is currently "AwsAccount".
 *
 * @apiHeader {String} Authorization Authorization: Token AUTH_TOKEN
 * @apiSuccess {String} account_arn
 * @apiSuccess {String} aws_account_id
 * @apiSuccess {Date} created_at
 * @apiSuccess {Number} id
 * @apiSuccess {String} name
 * @apiSuccess {String} resourcetype
 * @apiSuccess {Date} updated_at
 * @apiSuccess {String} url
 * @apiSuccess {Number} user_id
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "account_arn": "arn:aws:iam::273470430754:role/role-for-cloudigrade",
 *       "aws_account_id": "273470430754",
 *       "created_at": "2018-07-05T16:01:30.046877Z",
 *       "id": 4,
 *       "name": "Lorem ipsum",
 *       "resourcetype": "AwsAccount",
 *       "updated_at": "2018-07-05T16:07:47.078088Z",
 *       "url": "http://localhost:8080/api/v1/account/4/",
 *       "user_id": 2
 *     }
 * @apiError {String} detail
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "detail": "Authentication credentials were not provided."
 *     }
 */
const updateAccount = (id, data = {}) =>
  axios(
    serviceConfig({
      method: 'put',
      url: `${process.env.REACT_APP_ACCOUNTS_SERVICE}${id}/`,
      data,
    })
  );

/**
 * @api {patch} /api/v1/account/:id/ Patch account field
 * @apiDescription Update a specific field for account.
 *
 * Reference [cloudigrade/test_views.py#L200](https://gitlab.com/cloudigrade/cloudigrade/blob/master/cloudigrade/account/tests/test_views.py#L200)
 *
 * @apiParam {Number} id Account identifier
 * @apiParam (Request message body) {String} [name] Account name
 * @apiParam (Request message body) {String} resourcetype Resource type, standard is currently "AwsAccount". API limitation this is a REQUIRED property when submitting patched data.
 *
 * @apiHeader {String} Authorization Authorization: Token AUTH_TOKEN
 * @apiSuccess {String} account_arn
 * @apiSuccess {String} aws_account_id
 * @apiSuccess {Date} created_at
 * @apiSuccess {Number} id
 * @apiSuccess {String} name
 * @apiSuccess {String} resourcetype
 * @apiSuccess {Date} updated_at
 * @apiSuccess {String} url
 * @apiSuccess {Number} user_id
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "account_arn": "arn:aws:iam::273470430754:role/role-for-cloudigrade",
 *       "aws_account_id": "273470430754",
 *       "created_at": "2018-07-05T16:01:30.046877Z",
 *       "id": 4,
 *       "name": "Lorem ipsum",
 *       "resourcetype": "AwsAccount",
 *       "updated_at": "2018-07-05T16:07:47.078088Z",
 *       "url": "http://localhost:8080/api/v1/account/4/",
 *       "user_id": 2
 *     }
 * @apiError {String} detail
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "detail": "Authentication credentials were not provided."
 *     }
 */
const updateAccountField = (id, data = {}) =>
  axios(
    serviceConfig({
      method: 'patch',
      url: `${process.env.REACT_APP_ACCOUNTS_SERVICE}${id}/`,
      data,
    })
  );

export {
  addAccount,
  getAccount,
  getAccounts,
  getAccountImages,
  getAccountInstances,
  updateAccount,
  updateAccountField,
};
