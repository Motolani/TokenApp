import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Alert,
  Platform,
  ImageBackground,
  TouchableOpacity,
  AppState,
  // NativeModules,
  Modal,
} from 'react-native';
import axios from 'axios';
import InputBox from '../components/InputBox';
import GreenButton from '../components/GreenButton';
import Config from '../Helpers/Config';
import logoWatermark from '../assets/logoWatermark.png';
import Helper from '../Helpers/Helper';
import Storage from '../Helpers/Storage';

// import FingerprintScanner from 'react-native-fingerprint-scanner';

// import styles from '../components/Fingerprint/Application.container.styles';

// import FingerprintPopup from '../components/Fingerprint/FingerprintPopup.component';

import {store} from '../redux/store';
const styles_ = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#17375e',
    flexDirection: 'column',
    padding: 20,
    paddingBottom: Platform.select({
      ios: 40,
      android: 10,
    }),
  },

  inputWrapper: {
    marginVertical: Platform.select({
      ios: 25,
      android: 12,
    }),
  },
  brandWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  submitButtonWrapper: {
    flexDirection: 'column',
    marginTop: 20,
    paddingHorizontal: 10,
  },

  forgotPassword: {
    fontSize: 14,
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 57,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#ffffff',
  },

  forgetPasswordWrapper: {
    marginTop: 20,
    // marginBottom:15
  },

  Log_In: {
    fontSize: 22,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 57,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
  },

  brandLogo: {
    width: 40,
    height: 50,
  },

  signupWrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },

  signupText: {
    textAlign: 'center',
    color: 'white',
    textDecorationLine: 'underline',
  },

  close: {
    fontWeight: 'bold',
    fontSize: 27,
    color: '#ffffff',
  },

  closeWrapper: {
    marginLeft: -5,
    marginBottom: 10,
  },

  rectangle3079: {
    marginHorizontal: 5,
    alignSelf: 'stretch',
    height: 100,
    borderRadius: 10,
    backgroundColor: '#f7f7f7',
    justifyContent: 'space-around',
  },
});

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      secureTextEntry: true,
      processing: false,
      errorMessage: undefined,
      biometric: undefined,
      popupShowed: false,
      showBiometric: false,
      biometryType: undefined,
      token: '',
      showTokenModal: false,
      deviceAccessLogId: '',
    };
  }

  validateForm = () => {
    let email = this.state.email;
    let password = this.state.password;

    if (!email) {
      return {
        validationStatus: false,
        errorMessage: 'Username cannot be empty',
      };
    } else if (!password) {
      return {
        validationStatus: false,
        errorMessage: 'Password cannot be empty',
      };
    } else {
      return {validationStatus: true, errorMessage: 'Ok'};
    }
  };

  submitForm = async () => {
    try {
      let {email, password} = this.state;

      let {validationStatus, errorMessage} = this.validateForm();

      if (!validationStatus) {
        return Alert.alert('Message', errorMessage);
      }

      return this.signIn(email, password);
    } catch (error) {
      Alert.alert('Error', error.toString());
    }
  };

  signIn = async (email, password) => {
    try {
      this.setState({processing: true});
      let {message, error, user, response} = await Helper.logInApi(
        email,
        password,
      ).then((result) => result);
      // console.log(result)

      this.setState({processing: false});

      if (!error) {
        this.setState({email: '', password: ''});

        console.log(response);
        if (response.passDeviceCheck) {
          if (!response.accessAllowed) {
            this.setState({
              deviceAccessLogId: response.user.id,
              showTokenModal: true,
            });

            Alert.alert(
              'Device Check',
              'Awaiting device check kindly contact support and login again',
            );
          } else {
            return this.loginStatusAction(true);
          }
        } else {
          Alert.alert(
            'Device Check',
            response.passDeviceCheckErrorMessage.toString(),
          );
        }
      } else {
        Alert.alert('Login', message);
      }
    } catch (error) {
      this.setState({processing: false});

      Alert.alert('Error', error.toString());
    }
  };

  loginStatusAction = (status = false) => {
    return store.dispatch({
      type: 'IS_SIGNED_IN',
      payload: status,
    });
  };

  // async componentDidMount() {
  //   try {
  //     AppState.addEventListener('change', this.handleAppStateChange);
  //     let biometricLoginPromise = await Storage.getObjectData('biometricLogin')
  //       .then((res) => res)
  //       .then((results) => results);
  //     if (biometricLoginPromise.data === true) {
  //       this.fingerPrintLogin();
  //     }
  //   } catch (error) {}
  // }

  asyncLogin = async () => {
    try {
      const [usernamePromise, passwordPromise] = await Promise.all([
        Storage.getStringData('username').then((res) => res),
        Storage.getStringData('password').then((res) => res),
      ]);

      if (usernamePromise.data && passwordPromise.data) {
        this.setState({
          email: usernamePromise.data,
          password: passwordPromise.data,
        });
        return this.signIn(usernamePromise.data, passwordPromise.data);
      }
    } catch (error) {}
  };

  // fingerPrintLogin = async () => {
  //   try {
  //     const [usernamePromise, passwordPromise] = await Promise.all([
  //       Storage.getStringData('username').then((res) => res),
  //       Storage.getStringData('password').then((res) => res),
  //     ]);

  //     if (usernamePromise.data && passwordPromise.data) {
  //       FingerprintScanner.isSensorAvailable()
  //         .then((biometryType) => {
  //           this.setState({showBiometric: true, biometryType});
  //         })
  //         .catch((error) => {
  //           this.setState({
  //             errorMessage: error.message,
  //             biometric: error.biometric,
  //           });
  //           Alert.alert('Biometric signIn', error.message);
  //         });
  //     }
  //   } catch (error) {}
  // };

  handleFingerprintShowed = () => {
    this.setState({popupShowed: true});
  };

  handleFingerprintDismissed = () => {
    this.setState({popupShowed: false});
  };

  // componentWillUnmount() {
  //   AppState.removeEventListener('change', this.handleAppStateChange);
  // }

  // detectFingerprintAvailable = () => {
  //   FingerprintScanner.isSensorAvailable().catch((error) =>
  //     this.setState({errorMessage: error.message, biometric: error.biometric}),
  //   );
  // };

  handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState &&
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      // FingerprintScanner.release();
      this.detectFingerprintAvailable();
    }
    this.setState({appState: nextAppState});
  };

  render() {
    const {popupShowed, showBiometric} = this.state;

    return (
      <ImageBackground
        source={logoWatermark}
        style={styles_.container}
        imageStyle={{
          resizeMode: 'contain',
          height: '55%',
          top: undefined,
          // marginRight:'-25%'
        }}>
        {/* <ScrollView> */}

        <View style={{marginBottom: 10}}>
          <Text style={styles_.Log_In}>Pinspay Token Log In</Text>
        </View>

        <InputBox
          keyboardType="email-address"
          onChangeText={(email) => this.setState({email})}
          inputValue={this.state.email}
          inputLabel="Email"
          inputWrapperStyle={styles_.inputWrapper}
          inputLabelStyle={{color: 'white'}}
        />
        <InputBox
          keyboardType="default"
          onChangeText={(password) => this.setState({password})}
          inputValue={this.state.password}
          inputLabel="Password"
          inputWrapperStyle={styles_.inputWrapper}
          secureTextEntry={this.state.secureTextEntry}
          passwordViewToggle={() =>
            this.setState({secureTextEntry: !this.state.secureTextEntry})
          }
          inputLabelStyle={{color: 'white'}}
        />
        {showBiometric && (
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'flex-end',
            }}
            onPress={this.handleFingerprintShowed}
            // disabled={!!errorMessage}
          >
            <Text style={styles_.forgotPassword}>
              {' '}
              {Platform.select({
                ios: ' Touch ID Login',
                android: 'FingerPrint Login',
              })}
              {'   '}
            </Text>
            <Image
              source={require('../components/Fingerprint/assets/finger_print.png')}
              resizeMode="contain"
              style={{width: 30, height: 30}}
            />
          </TouchableOpacity>
        )}

        <View style={styles_.submitButtonWrapper}>
          <GreenButton
            text="Login"
            disabled={this.state.processing}
            processing={this.state.processing}
            onPress={() => this.submitForm()}
          />
        </View>

        {/* {popupShowed && (
          <FingerprintPopup
            style={styles.popup}
            handlePopupDismissed={this.handleFingerprintDismissed}
            afterVerification={this.asyncLogin}
          />
        )} */}

        {/* </ScrollView> */}
      </ImageBackground>
    );
  }
}

export default Login;
