import axios from "axios";

import { Alert, ToastAndroid, Platform } from "react-native";

import { store } from "../redux/store";

class Network {
  getPropValue = (object, path = "") =>
    path.split(".").reduce((o, x) => (o == undefined ? o : o[x]), object);

  checkAuth = (payload) => {
    let authError = this.getPropValue(payload, "authError");
    let errorMessage =
      this.getPropValue(payload, "message") ?? "Session Expired";
    if (authError == true) {
      setTimeout(() => {
        store.dispatch({
          type: "IS_SIGNED_IN",
          payload: false,
        });
        if (Platform.OS === "android") {
          ToastAndroid.show(errorMessage, ToastAndroid.LONG);
        } else {
          Alert.alert("Session",errorMessage);
        }
      }, 1000);
    }
  };

  post = async (URL, BODY = {}, HEADERS = {}) => {
    let result;

    try {
      let credentials = {
        token: this.getPropValue(global, "authToken"),
      };

      let headers = {
        ...credentials,
        ...HEADERS,
      };

      let responseObject = await axios
        .post(URL, BODY, { headers })
        .then((response) => response);

      let response = responseObject.data;

      let responseHeaders = responseObject.headers;

      this.checkAuth(response);
      
      result = { response, error: false, errorMessage: null };
    } catch (error) {
      result = { response: null, error: true, errorMessage: error.toString() };
    }

    return result;
  };

  get = async (URL, HEADERS = {}) => {
    let result;

    try {
      let credentials = {
        token: this.getPropValue(global, "authToken"),
      };

      let headers = {
        ...credentials,
        ...HEADERS,
      };

      let responseObject = await axios
        .post(URL, { headers })
        .then((response) => response);

      let response = responseObject.data;

      let responseHeaders = responseObject.headers;

      this.checkAuth(response);
     
      result = { response, error: false, errorMessage: null };
    } catch (error) {
      result = { response: null, error: true, errorMessage: error.toString() };
    }

    return result;
  };
}

export default Network;
