import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Platform,
  Alert,
  Switch,
  TouchableOpacity,
  NativeModules,
  ToastAndroid,
} from 'react-native';
import GreenButton from '../components/GreenButton';
import WhiteButton from '../components/WhiteButton';
import Storage from '../Helpers/Storage';
import InputBox from '../components/InputBox';
// import FingerprintScanner from 'react-native-fingerprint-scanner';
import Helper from '../Helpers/Helper';
import {store} from '../redux/store';
import Config from '../Helpers/Config';
import Network from '../Helpers/Network';
import Clipboard from '@react-native-clipboard/clipboard';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  upperContainer: {
    backgroundColor: '#17375e',
    flex: 0.2,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },

  lowerContainer: {
    flex: 0.8,
  },

  settingsText: {
    fontSize: 24,
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 54,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
  },

  inputWrapper: {
    paddingHorizontal: 15,
    marginTop: 10,
  },
  buttonWrapper: {
    paddingHorizontal: '10%',
    marginTop: 25,
  },
  heading: {
    color: '#17375e',
    fontSize: 15,
    fontWeight: 'bold',
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: '3%',
    height: 60,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 30,
    shadowOpacity: 1,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#dce7f4',
    paddingHorizontal: 10,
  },

  bluetoothBox: {
    marginTop: 10,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 30,
    shadowOpacity: 1,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#dce7f4',
    paddingHorizontal: 10,
    paddingVertical: 50,
    marginHorizontal: '3%',
  },
});

export default class Home extends Component {
  _listeners = [];

  constructor() {
    super();
    this.state = {
      autoLogin: false,
      biometricLogin: false,
      biometryType: undefined,
      token: '',
      loading: true,
      uniqueId: '',
      brand: '',
      model: '',
    };
  }

  async componentDidMount() {
    await this.loadAutoLogin();
    const {uniqueId, brand, model} = NativeModules.RNDeviceInfo;
    this.setState({
      // uniqueId: uniqueId ?? '',
      brand: brand ?? '',
      model: model ?? '',
      processing: false,
    });
  }

  componentWillUnmount() {
    //usually to destroy states or variables or components, reset the passed variables so that printer can start afresh again
  }

  // onchangeTouchIdoLogin = (res) => {
  //   if (res === true) {
  //     FingerprintScanner.isSensorAvailable()
  //       .then((biometryType) => {
  //         if (this.state.autoLogin === true) {
  //           this.saveAutoLogin(false);
  //         }
  //         this.saveTouchIDLogin(res, biometryType);
  //       })
  //       .catch((error) => {
  //         return Alert.alert('Biometric Login Set Up', error.message);
  //       });
  //   } else {
  //     this.saveTouchIDLogin(res);
  //   }
  // };

  onchangeAutoLogin = (res) => {
    if (this.state.biometricLogin === true && res === true) {
      this.saveTouchIDLogin(false);
    }

    this.saveAutoLogin(res);
  };

  saveTouchIDLogin = (res, biometryType = undefined) => {
    this.setState((state) => ({
      biometricLogin: !state.biometricLogin,
      biometryType,
    }));
    Storage.storeObjectData('biometricLogin', res);
  };

  saveAutoLogin = (res) => {
    this.setState((state) => ({
      autoLogin: !state.autoLogin,
    }));

    Storage.storeObjectData('autoLogin', res);
  };

  loadAutoLogin = async () => {
    let [autoLoginPromise, biometricLoginPromise] = await Promise.all([
      Storage.getObjectData('autoLogin').then((res) => res),
      Storage.getObjectData('biometricLogin').then((res) => res),
    ]).then((results) => results);

    if (autoLoginPromise.data != null) {
      this.setState({autoLogin: autoLoginPromise.data});
    }

    if (biometricLoginPromise.data != null) {
      this.setState({biometricLogin: biometricLoginPromise.data});
    }
  };

  getAuthorizationToken = async () => {
    try {
      let url = Config.base_url + '/app/get-token';

      this.setState({processing: true});

      let body = {accessLogId: Helper.getPropValue(global, 'accessLogId')};

      let {error, errorMessage, response} = await new Network().post(url, body);

      this.setState({processing: false});

      if (error) {
        return Alert.alert('Authorization Token', errorMessage);
      }

      let {status, message} = response;

      console.log(response);

      if (status == '200') {
        this.setState({token: response.token});
        return Alert.alert('Authorization Token', message.toString());
      } else {
        return Alert.alert('Authorization Token', message.toString());
      }
    } catch (error) {
      this.setState({processing: false});
      return Alert.alert('Authorization Token', error.toString());
    }
  };

  displayClipBoard = (value) => {
    Clipboard.setString(value);
    if (Platform.OS === 'android') {
      ToastAndroid.show('Copied!', ToastAndroid.LONG);
    } else {
      Alert.alert('Clipboard', 'Copied!');
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.upperContainer}>
          <Text style={styles.settingsText}>Home</Text>

          <TouchableOpacity
            onPress={() => {
              return store.dispatch({
                type: 'IS_SIGNED_IN',
                payload: false,
              });
            }}>
            <Text style={styles.settingsText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.lowerContainer}>
          <ScrollView>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginTop: 10,
              }}>
              {/* <View style={styles.box}>
                <Text style={styles.heading}>Biometric Login </Text>
                <Switch
                  trackColor={{false: '#f4f3f4', true: '#d7dae3'}}
                  thumbColor={this.state.biometricLogin ? '#17375e' : '#f4f3f4'}
                  onValueChange={this.onchangeTouchIdoLogin}
                  value={this.state.biometricLogin}
                />
              </View> */}
            </View>
            <View style={[styles.bluetoothBox]}>
              <View>
                <Text style={{lineHeight: 25}}>
                  Name: {Helper.getPropValue(global, 'user.firstname')}{' '}
                  {Helper.getPropValue(global, 'user.lastname')}
                </Text>
                <Text style={{lineHeight: 25}}>
                  Role: {Helper.getPropValue(global, 'user.level')}{' '}
                </Text>
                <Text style={{lineHeight: 25}}>
                  DeviceID: {Helper.maskId(this.state.uniqueId)}{' '}
                </Text>
                <Text>
                  Device Name: {this.state.brand} {this.state.model}{' '}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 15,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    letterSpacing: 20,
                    fontSize: 25,
                    marginTop: 15,
                  }}>
                  {this.state.token}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    this.displayClipBoard(this.state.token.toString())
                  }>
                  <Text
                    style={{
                      fontSize: 15,
                      marginTop: 15,
                    }}>
                    Copy
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.buttonWrapper}>
                <GreenButton
                  text="Getting Authorization Token"
                  onPress={() => this.getAuthorizationToken()}
                  processing={this.state.processing}
                  disabled={this.state.processing}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}
