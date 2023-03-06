import axios from 'axios';
import {Platform, NativeModules} from 'react-native';
import Config from './Config';
import Storage from './Storage';

const Helper = {
  propertiesAllSet: (a) => {
    return Object.keys(a).reduce(
      (res, k) => res && (!!a[k] || a[k] === false || !isNaN(parseInt(a[k]))),
      Object.keys(a).length > 0,
    );
  },

  getPropValue: (object, path = '') =>
    path.split('.').reduce((o, x) => (o == undefined ? o : o[x]), object),

  formattedAmount: (amount, dp = 2) => {
    return amount
      ? new Intl.NumberFormat('en-NG', {
          minimumFractionDigits: dp,
          maximumFractionDigits: dp,
        }).format(amount)
      : '';
  },

  formattedAmountWithNaira: (amount, dp = 2) => {
    return amount
      ? '\u20A6' +
          new Intl.NumberFormat('en-NG', {
            minimumFractionDigits: dp,
            maximumFractionDigits: dp,
            // style: "currency",
            // currency: "NGN",
          }).format(amount)
      : '';
  },

  logInApi: async (username, password, acceptTerms = false) => {
    let LoginData = {
      email: username,
      password: password,
    };

    // const {uniqueId, brand, model} = NativeModules.RNDeviceInfo;

    // const deviceInfo = {
    //   uniqueId: uniqueId,
    //   brand: brand,
    //   model: model,
    // };

    // console.log(deviceInfo);

    let url = Config.base_url + '/app/login';
    
    console.log(url);
    
    let result = {};

    await axios
      .post(url, LoginData)
      .then(function (response) {
        let {status, message} = response.data;

        if (status != '200') {
          result = {
            message: message.toString(),
            error: true,
            user: null,
            response: null,
          };
        } else {
          Helper.saveLoginDetails(username, password);
          global.username = username;
          global.password = password;
          global.user = response.data.user;

          global.primaryDevice = Helper.getPropValue(
            response.data,
            'auth.primary_device',
          );
          global.authToken = Helper.getPropValue(
            response.data,
            'auth.access_token',
          );
          global.authTokenExpiry = Helper.getPropValue(
            response.data,
            'auth.expires_in',
          );

          global.accessLogId = Helper.getPropValue(response.data, 'auth.id');

          result = {
            message: message.toString(),
            error: false,
            user: response.data.user,
            response: response.data,
          };
        }
      })
      .catch(function (error) {
        result = {
          message: error.toString(),
          error: true,
          user: null,
          response: null,
        };
      });

    return result;
  },

  saveLoginDetails: async (username, password) => {
    try {
      Promise.all([
        Storage.storeStringData('username', username),
        Storage.storeStringData('password', password),
      ]);
    } catch (error) {}
  },

  textRefine: (text) => {
    return text
      .replace(/_/g, ' ')
      .replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());
  },

  maskId: (creditCard) => {
    let cc = creditCard.toString();
    let firstTwo = cc.substr(0, 3);
    let lastFour = cc.substr(-4);
    let m = cc.substr(3);
    let toMask = m.substr(0, m.length - 4);
    let masked = firstTwo + Array(toMask.length).join('*') + lastFour;
    return masked;
  },
};

export default Helper;
