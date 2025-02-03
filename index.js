/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

PushNotification.createChannel(
  {
    channelId: "grocerycustomerapp", // (required)
    channelName: "grocerycustomerapp", // (required)
  },
  (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
);

messaging().onMessage(async remoteMessage => {
   console.log('Message handled in Foreground', remoteMessage); 
  alert(remoteMessage.notification.title);
  
  PushNotification.localNotification({
    channelId: 'grocerycustomerapp',
    message: remoteMessage.notification.body, 
    title: remoteMessage.notification.title,
    bigPictureUrl: remoteMessage.notification.android.imageUrl,
    smallIcon: remoteMessage.notification.android.imageUrl,
  });

});

messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });

AppRegistry.registerComponent(appName, () => App);