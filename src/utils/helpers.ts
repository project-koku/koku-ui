import _ from 'lodash';
import moment from 'moment/moment';

const copyClipboard = text => {
  let successful;

  try {
    window.getSelection().removeAllRanges();

    const newTextarea = document.createElement('pre');
    newTextarea.appendChild(document.createTextNode(text));

    newTextarea.style.position = 'absolute';
    newTextarea.style.top = '-1000px';
    newTextarea.style.left = '-1000px';
    newTextarea.style.overflow = 'hidden';
    newTextarea.style.width = '1px';
    newTextarea.style.height = '1px';

    const range = document.createRange();
    window.document.body.appendChild(newTextarea);

    range.selectNode(newTextarea);

    window.getSelection().addRange(range);

    successful = window.document.execCommand('copy');

    window.document.body.removeChild(newTextarea);
    window.getSelection().removeAllRanges();
  } catch (e) {
    successful = false;
    // console.warn('Copy to clipboard failed.', e.message);
  }

  return successful;
};

const generateId = prefix =>
  `${prefix || 'generatedid'}-${Math.ceil(1e5 * Math.random())}`;

const generateHoursFromSeconds = seconds => {
  let parsedSeconds = Number.parseFloat(seconds);
  parsedSeconds = Number.isNaN(parsedSeconds) ? null : parsedSeconds;

  parsedSeconds =
    parsedSeconds === null
      ? parsedSeconds
      : Math.floor(moment.duration(parsedSeconds, 'seconds').asHours());

  return parsedSeconds;
};

const generatePriorYearMonthArray = () => {
  const dateStart = moment().subtract(12, 'months');
  const dateEnd = moment().startOf('month');

  let timeValues = [];

  while (dateEnd > dateStart || dateStart.format('M') === dateEnd.format('M')) {
    timeValues.push({
      title: dateStart.startOf('month').format('YYYY MMMM'),
      start: dateStart.startOf('month').toISOString(),
      end: dateStart.endOf('month').toISOString(),
    });

    dateStart.add(1, 'month');
  }

  timeValues = timeValues.reverse();
  timeValues[0] = {
    default: true,
    title: 'Last 30 Days',
    start: moment()
      .startOf('day')
      .subtract(30, 'days')
      .toISOString(),
    end: moment()
      .endOf('day')
      .toISOString(),
  };

  return { defaultTime: timeValues[0], timeValues };
};

const getMessageFromResults = (results, filterField = null) => {
  const status = _.get(results, 'response.status', results.status);
  const statusResponse = _.get(
    results,
    'response.statusText',
    results.statusText
  );
  const messageResponse = _.get(results, 'response.data', results.message);
  const detailResponse = _.get(results, 'response.data', results.detail);

  if (status < 400 && !messageResponse && !detailResponse) {
    return statusResponse;
  }

  if (
    status >= 500 ||
    (status === undefined && (messageResponse || detailResponse))
  ) {
    return `${status ||
      ''} Server is currently unable to handle this request. ${messageResponse ||
      detailResponse ||
      ''}`;
  }

  if (typeof messageResponse === 'string') {
    return messageResponse;
  }

  if (typeof detailResponse === 'string') {
    return detailResponse;
  }

  const getMessages = (messageObject, filterKey) => {
    const obj = filterKey ? messageObject[filterKey] : messageObject;

    return _.map(
      obj,
      next => {
        if (_.isArray(next)) {
          return getMessages(next, undefined);
        }

        return next;
      },
      null
    );
  };

  return _.join(
    getMessages(messageResponse || detailResponse, filterField),
    '\n'
  );
};

const getStatusFromResults = results => {
  let status = _.get(results, 'response.status', results.status);

  if (status === undefined) {
    status = 0;
  }

  return status;
};

const noop = Function.prototype;

const setStateProp = (prop, data, options) => {
  const { state = {}, initialState = {}, reset = true } = options;
  let obj = { ...state };

  if (prop && !state[prop]) {
    // console.error(`Error: Property ${prop} does not exist within the passed state.`, state);
  }

  if (reset && prop && !initialState[prop]) {
    // console.warn(`Warning: Property ${prop} does not exist within the passed initialState.`, initialState);
  }

  if (reset && prop) {
    obj[prop] = {
      ...state[prop],
      ...initialState[prop],
      ...data,
    };
  } else if (reset && !prop) {
    obj = {
      ...state,
      ...initialState,
      ...data,
    };
  } else if (prop) {
    obj[prop] = {
      ...state[prop],
      ...data,
    };
  } else {
    obj = {
      ...state,
      ...data,
    };
  }

  return obj;
};

const prettyPrintJson = json => JSON.stringify(json, null, 2);

const DEV_MODE = process.env.REACT_APP_ENV === 'development';

const OC_MODE = process.env.REACT_APP_ENV === 'oc';

const RH_BRAND = process.env.REACT_APP_RH_BRAND === 'true';

const UI_COMMIT_HASH = process.env.REACT_APP_UI_COMMIT_HASH;

const FULFILLED_ACTION = (base = '') => `${base}_FULFILLED`;

const PENDING_ACTION = (base = '') => `${base}_PENDING`;

const REJECTED_ACTION = (base = '') => `${base}_REJECTED`;

const HTTP_STATUS_RANGE = status => `${status}_STATUS_RANGE`;

const helpers = {
  copyClipboard,
  generateId,
  generateHoursFromSeconds,
  generatePriorYearMonthArray,
  getMessageFromResults,
  getStatusFromResults,
  noop,
  setStateProp,
  prettyPrintJson,
  DEV_MODE,
  OC_MODE,
  RH_BRAND,
  UI_COMMIT_HASH,
  FULFILLED_ACTION,
  PENDING_ACTION,
  REJECTED_ACTION,
  HTTP_STATUS_RANGE,
};

export { helpers as default, helpers };
