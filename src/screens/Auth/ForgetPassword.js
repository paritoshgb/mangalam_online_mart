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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_BASE_URL} from '../../constants/Url';
import {PRIMARY_COLOR} from '../../constants/Color';

const ForgetPassword = ({navigation}) => {
  const dispatch = useDispatch();

  const [loginLoader, setLoginLoader] = useState(false);
  const [mobile, setMobile] = useState();
  const [mobileError, setmobileError] = useState();
  const [isValidMobilePattern, setIsValidMobilePattern] = useState(false);

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

  const checkValidMobileNoSendForgetPasswordOTP = () => {
    setLoginLoader(true);
    if (isValidMobilePattern == true) {
      var authAPIURL =
        API_BASE_URL + 'checkValidMobileNoSendForgetPasswordOTP.php';
      var header = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
      fetch(authAPIURL, {
        method: 'POST',
        headers: header, 
        body: JSON.stringify({
          mobile: mobile,
        }),
      })
        .then(response => response.json())
        .then(response => {
          ToastAndroid.show(response.msg, ToastAndroid.SHORT);

          if (response.result == 'true') {
            const saveData = async () => {
              await AsyncStorage.setItem('forgetPasswordMobile', mobile);
            };
            saveData();
            navigation.navigate('ForgetPasswordOtp');
          }
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      ToastAndroid.show('Invalid Mobile no.', ToastAndroid.SHORT);
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
            source={require('../../assets/image/forget_password.png')}
            style={{
              alignSelf: 'center',
              marginTop: 20,
              backgroundColor: 'white',
            }}
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
            Forget Password
          </Title>
          <Subheading
            style={{
              alignSelf: 'center',
            }}>
            Did you forget your password?
          </Subheading>

          <TextInput
            label="Register Mobile Number"
            mode="flat"
            placeholder="Enter Register Mobile Number"
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

          <Button
            mode="contained"
            style={{marginTop: 30}}
            theme={{colors: {primary: PRIMARY_COLOR}}}
            loading={loginLoader}
            labelStyle={{color: 'white'}}
            onPress={() => {
              checkValidMobileNoSendForgetPasswordOTP();
            }}>
            Get OTP
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgetPassword;

const styles = StyleSheet.create({});
