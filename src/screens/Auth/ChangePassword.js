import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  Dimensions,
  ToastAndroid,
  TouchableOpacity
} from 'react-native';
// import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  Avatar,
  Subheading,
  Title,
  TextInput,
  Button,
  Headline,
  Caption,
} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authActions from '../../store/actions/AuthAction';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/messaging';
import {PRIMARY_COLOR} from '../../constants/Color';

const ChangePassword = ({navigation}) => {

  const dispatch = useDispatch();

  const [mobile, setMobile] = useState();
  const [password, setPassword] = useState('');
  const [passwordError, setpasswordError] = useState();
  const [isValidPasswordPattern, setIsValidPasswordPattern] = useState(false);
  const [loginLoader, setLoginLoader] = useState(false);

  const [hidePass, setHidePass] = useState(true);
  const [fcmToken, setFcmToken] = useState(null);

  React.useEffect(() => {
    setTimeout(async () => {
      firebase.messaging().subscribeToTopic('rishabh');
      getToken = await firebase.messaging().getToken();
      setFcmToken(getToken);
    });
  }, []);

  const _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('forgetPasswordMobile');
      if (value !== null) {
        setMobile(value);
      }
    } catch (error) {}
  };

  useEffect(() => {
    _retrieveData();
  }, []);

  const onChangePassword = password => {
    if (password.length < 6) {
      setPassword(password);
      setpasswordError('Enter more than 6 Character');
      setIsValidPasswordPattern(false);
    }
    if (password.length >= 6) {
      setpasswordError('');
      setPassword(password);
      setIsValidPasswordPattern(true);
    }
  };

  const changePassword = async () => {
    setLoginLoader(true);
    if (isValidPasswordPattern == true) {
      try {
        await dispatch(authActions.changePassword(mobile, password, fcmToken));
        navigation.navigate('Home');
      } catch (err) {
        // console.log();
        ToastAndroid.show(err.message, ToastAndroid.SHORT);
      }
    } else {
      ToastAndroid.show('Invalid Mobile no. or Password', ToastAndroid.SHORT);
    }
    setLoginLoader(false);
  };

  return (
    <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <ScrollView>
        <View style={{marginHorizontal: 15}}>
          <Avatar.Image
            size={200}
            source={require('../../assets/image/reset_password.png')}
            style={{alignSelf: 'center', marginTop: 20, backgroundColor:'white'}}
          />
          <Title
            style={{
              alignSelf: 'center',
              marginTop: 5,
              fontSize: 22,
              color: PRIMARY_COLOR,
              textShadowColor: 'rgba(233, 97, 37, 0.5)',
              textShadowOffset: {width: 0.5, height: 0.5},
              textShadowRadius: 5,
            }}>
            Change Password
          </Title>
          <Subheading
            style={{
              alignSelf: 'center',
            }}>
            Hello, Welcome back to our account
          </Subheading>

          <TextInput
            label="Enter Password"
            mode="flat"
            placeholder="Enter Password"
            underlinecolor={PRIMARY_COLOR}
            // error={true}
            onChangeText={user_password => onChangePassword(user_password)}
            value={password}
            outlinecolor={PRIMARY_COLOR}
            style={{
              color: PRIMARY_COLOR,
              marginVertical: 5,
              backgroundColor: 'white',
            }}
            theme={{colors: {primary: PRIMARY_COLOR}}}
            // keyboardType='default'
            secureTextEntry={hidePass ? true : false}
            right={
              <TextInput.Icon
                name="eye-off"
                onPress={() => setHidePass(!hidePass)}
              />
            }
            left={<TextInput.Icon name="lock" size={24} />}
          />
          {passwordError ? (
            <Text style={{color: 'red', fontSize: 12}}>{passwordError}</Text>
          ) : null}

          <Button
            mode="contained"
            style={{marginTop: 30}}
            theme={{colors: {primary: PRIMARY_COLOR}}}
            onPress={() => {
              changePassword();
            }}
            loading={loginLoader}
            labelStyle={{color: 'white'}}>
            Change Password
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({});
