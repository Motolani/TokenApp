import React, {Component} from 'react';

import {Platform} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';

import {createStackNavigator} from '@react-navigation/stack';

import {Provider, useSelector} from 'react-redux';

import {store} from './redux/store';

import Login from './screens/Login.js';
import Home from './screens/Home';

const App = () => {
  return (
    <Provider store={store}>
      <AppContainer />
    </Provider>
  );
};

const Stack = createStackNavigator();

function AppContainer() {
  const {loginStatus} = useSelector(state => state.reducers);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          title: null,
          // headerBackTitle :"Back",
          headerStyle: {
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
            // height:50,
            backgroundColor: '#17375e',
          },
          headerBackTitleVisible: false,
          headerLeft: Platform.select({
            ios: null,
          }),
          headerTitleStyle: {
            color: '#ffffff',
          },
          headerShown: Platform.select({
            ios: true,
            android: false,
          }),
        }}>
        {!loginStatus ? (
          <>
            <Stack.Screen name="Login" component={Login} />
          </>
        ) : (
          <>
            <Stack.Screen name="Home" component={Home} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
