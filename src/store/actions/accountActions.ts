import { accountServices } from '../../services';
import { accountTypes } from '../constants';

const addAccount = data => dispatch =>
  dispatch({
    type: accountTypes.ADD_ACCOUNT,
    payload: accountServices.addAccount(data),
  });

const getAccount = id => dispatch =>
  dispatch({
    type: accountTypes.GET_ACCOUNT,
    payload: accountServices.getAccount(id),
  });

const getAccountImages = (id, query) => dispatch =>
  dispatch({
    type: accountTypes.GET_ACCOUNT_IMAGES,
    payload: accountServices.getAccountImages(id, query),
  });

const getAccountImagesInstances = (id, query) => dispatch =>
  dispatch({
    type: accountTypes.GET_ACCOUNT_IMAGES_INSTANCES,
    payload: accountServices.getAccountInstances(id, query),
  });

const getAccountInstances = query => dispatch =>
  dispatch({
    type: accountTypes.GET_ACCOUNT_INSTANCES,
    payload: accountServices.getAccountInstances(null, query),
  });

const getAccounts = query => dispatch =>
  dispatch({
    type: accountTypes.GET_ACCOUNTS,
    payload: accountServices.getAccounts(query),
  });

const updateAccount = (id, data) => dispatch =>
  dispatch({
    type: accountTypes.UPDATE_ACCOUNT,
    payload: accountServices.updateAccount(id, data),
  });

const updateAccountField = (id, data) => dispatch =>
  dispatch({
    type: accountTypes.UPDATE_ACCOUNT_FIELD,
    payload: accountServices.updateAccountField(id, data),
  });

export {
  addAccount,
  getAccount,
  getAccountImages,
  getAccountImagesInstances,
  getAccountInstances,
  getAccounts,
  updateAccount,
  updateAccountField,
};
