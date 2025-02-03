import React, {useState} from 'react';
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
import {Avatar, Subheading, Title, TextInput, Button} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
import * as authActions from '../../store/actions/AuthAction';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/messaging';
import {PRIMARY_COLOR} from '../../constants/Color';

const Login = ({navigation}) => {
  const dispatch = useDispatch();

  const [mobile, setMobile] = useState();
  const [password, setPassword] = useState('');

  const [mobileError, setmobileError] = useState();
  const [passwordError, setpasswordError] = useState();

  const [isValidMobilePattern, setIsValidMobilePattern] = useState(false);
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

  const onChangeMobile = mobile => {
    mobile = mobile.replace(
      /[`~a-zA-Z !@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,
      '',
    );
    if (mobile.length < 10) {
      setMobile(mobile);
      setmobileError('Enter 10 Digit Mobile Number');
      setIsValidMobilePattern(false);
    }
    if (mobile.length == 10) {
      setMobile(mobile);
      setmobileError('');
      setIsValidMobilePattern(true);
    }
  };
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

  const login = async () => {
    setLoginLoader(true);
    if (isValidMobilePattern == true && isValidPasswordPattern == true) {
      try {
        await dispatch(authActions.login(mobile, password, fcmToken));
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
            source={require('../../assets/image/logo.png')}
            style={{alignSelf: 'center', marginTop: 20}}
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
            Login Account
          </Title>
          <Subheading
            style={{
              alignSelf: 'center',
            }}>
            Hello, Welcome back to our account
          </Subheading>

          <TextInput
            label="Mobile Number"
            mode="flat"
            placeholder="Enter Mobile Number"
            underlinecolor={PRIMARY_COLOR}
            // error={true}
            value={mobile}
            onChangeText={user_mobile => onChangeMobile(user_mobile)}
            outlinecolor={PRIMARY_COLOR}
            style={{
              color: PRIMARY_COLOR,
              marginVertical: 5,
              backgroundColor: 'white',
            }}
            theme={{colors: {primary: PRIMARY_COLOR}}}
            keyboardType="numeric"
            left={<TextInput.Icon name="phone" size={24} />}
          />
          {mobileError ? (
            <Text style={{color: 'red', fontSize: 12}}>{mobileError}</Text>
          ) : null}

          <TextInput
            label="Password"
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

          {/* <Button
            theme={{colors: {primary: PRIMARY_COLOR}}}
            onPress={() => navigation.navigate('ForgetPassword')}
            style={{
              flex: 1,
              alignSelf: 'flex-end',
              alignContent: 'flex-end',
              alignItems: 'flex-end',
            }}>
            Forget Password
          </Button> */}
          <Button
            mode="contained"
            style={{marginTop: 30}}
            theme={{colors: {primary: PRIMARY_COLOR}}}
            loading={loginLoader}
            labelStyle={{color: 'white'}}
            onPress={() => {
              login();
            }}>
            Login
          </Button>
        </View>
        <View
          style={{marginHorizontal: 15, alignSelf: 'center', marginTop: 50}}>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text>
              Not register yet?{' '}
              <Text style={{color: PRIMARY_COLOR}}>Create an Account</Text>
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgetPassword')}
            style={{marginTop: 10}}>
            <Text style={{color: PRIMARY_COLOR, textAlign:'center'}}>Forget Password ?</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({});
