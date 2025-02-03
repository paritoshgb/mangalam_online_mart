import React, {useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen';
import {Provider} from 'react-redux';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {NavigationContainer} from '@react-navigation/native';

import ProductReducer from './src/store/reducers/ProductReducer';
import CartReducer from './src/store/reducers/CartReducer';
import CouponReducer from './src/store/reducers/CouponReducer';
import AuthReducer from './src/store/reducers/AuthReducer';
import PaymentReducer from './src/store/reducers/PaymentReducer';
import OrderReducer from './src/store/reducers/OrderReducer';
import OnBoardingReducer from './src/store/reducers/OnBoardingReducer';
import DeliveryDateTimeReducer from './src/store/reducers/DeliveryDateTimeReducer';
import OrderSettingReducer from './src/store/reducers/OrderSettingReducer';
import ReduxThunk from 'redux-thunk';
import {persistStore, persistReducer} from 'redux-persist';
import {PersistGate} from 'redux-persist/integration/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import RootStack from './src/navigation/RootStack';
import {check, PERMISSIONS, RESULTS, requestNotifications, checkNotifications, openSettings} from 'react-native-permissions';
import {LogBox,AppState} from 'react-native'; 
const rootReducer = combineReducers({
  ProductReducer: ProductReducer,
  CartReducer: CartReducer,
  CouponReducer: CouponReducer,
  AuthReducer: AuthReducer,
  PaymentReducer: PaymentReducer,
  OrderReducer: OrderReducer,
  OnBoardingReducer: OnBoardingReducer,
  DeliveryDateTimeReducer: DeliveryDateTimeReducer,
  OrderSettingReducer: OrderSettingReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['CartReducer', 'AuthReducer', 'OnBoardingReducer'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer, applyMiddleware(ReduxThunk));

const persistor = persistStore(store);

const App = () => {
  LogBox.ignoreAllLogs(true);
  useEffect(() => {
    // check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS)
    //   .then(result => {
    //     switch (result) {
    //       case RESULTS.UNAVAILABLE:
    //         console.log(
    //           'This feature is not available (on this device / in this context)',
    //         );
    //         break;
    //       case RESULTS.DENIED:
    //         console.log(
    //           'The permission has not been requested / is denied but requestable',
    //         );
    //         break;
    //       case RESULTS.LIMITED:
    //         console.log('The permission is limited: some actions are possible');
    //         break;
    //       case RESULTS.GRANTED:
    //         console.log('The permission is granted');
    //         break;
    //       case RESULTS.BLOCKED:
    //         console.log('The permission is denied and not requestable anymore');
    //         break;
    //     }
    //   })
    //   .catch(error => {
    //     // …
    //   });

    checkNotifications().then(({status, settings}) => {
      console.log('check', status)
      if(status != 'granted'){
        requestNotifications(['alert', 'sound']).then(({status, settings}) => {
          console.log('request', status)
          openSettings().catch(() => console.warn('cannot open settings'));
        });
      }
    });

    

    checkPermission();
    setTimeout(() => {
      SplashScreen.hide();
    }, 500);
  }, []);

  const checkPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      // console.log('Authorization status:', authStatus);
    }
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default App;
