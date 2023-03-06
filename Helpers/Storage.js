import AsyncStorage from "@react-native-async-storage/async-storage";

export default class Storage {

  static storeObjectData = async (key, value) => {
    let result;

    try {
      const jsonValue = JSON.stringify(value);

      await AsyncStorage.setItem(key, jsonValue);

      result = { error: false, message: "Operation Successful" };
    } catch (e) {
      result = { error: true, message: e.toString() };
    }

    return result;
  };

  static getObjectData = async (key) => {
    let result;

    try {
      const jsonValue = await AsyncStorage.getItem(key);

      result = {
        error: false,
        message: "Operation Successful",
        data: jsonValue != null ? JSON.parse(jsonValue) : null,
      };
    } catch (e) {
      result = { error: true, message: e.toString(), data: null };
    }

    return result;
  };

  static storeStringData = async (key,value) => {
    let result;

    try {
      await AsyncStorage.setItem(key, value);

      result = { error: false, message: "Operation Successful" };
    } catch (e) {
      result = { error: true, message: e.toString() };
    }

    return result;
  };

  static getStringData = async (key) => {
    let result;

    try {
      const value = await AsyncStorage.getItem(key);

      result = {
        error: false,
        message: "Operation Successful",
        data: value,
      };
    } catch (e) {
      result = { error: true, message: e.toString() };
    }

    return result;
  };
}
