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
import * as authActions from '../../store/actions/AuthAction';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/messaging';
import {PRIMARY_COLOR} from '../../constants/Color';

const Otp = ({navigation}) => {
  const name = useSelector(state => state.AuthReducer.name);
  const mobile = useSelector(state => state.AuthReducer.mobile);
  const password = useSelector(state => state.AuthReducer.password);
  const ref_code = useSelector(state => state.AuthReducer.ref_code);
  //console.log(ref_code)
  const [otpLoader, setOtpLoader] = useState(false);
 const dispatch = useDispatch();
 const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState();
  const [isValidOtpPattern, setIsValidOtpPattern] = useState(false);
  const [counter, setCounter] = React.useState(59);
  const [resendOTPBtn, setResendOTPBtn] = useState(true);
  const [fcmToken, setFcmToken] = useState(null);

  React.useEffect(() => {
    setTimeout(async () => {
      firebase.messaging().subscribeToTopic('rishabh');
      getToken = await firebase.messaging().getToken();
      setFcmToken(getToken);
      //console.log("fcm token",fcmToken);
    });
  }, []);

  const resendOTP = () =>{
    setCounter(59)
    dispatch(authActions.signup(name, mobile, password, ref_code));
    setResendOTPBtn(true)
  }

  React.useEffect(() => {
    if (counter > 0) {
      setTimeout(() => setCounter(counter - 1), 1000);
    } else {
      setResendOTPBtn(false)
    }
  }, [counter]);

  const validateOtp = entered_otp => {
    entered_otp = entered_otp.replace(
      /[`~a-zA-Z !@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,
      '',
    );

    if (entered_otp.length < 6) {
      setOtp(entered_otp);
      setOtpError('Enter 6 Digit');
      setIsValidOtpPattern(false);
    }
    if (entered_otp.length == 6) {
      setOtpError(''); 
      setOtp(entered_otp);
      setIsValidOtpPattern(true);
    }
  };

  const verifyOtp = async () => {
    setOtpLoader(true);
    if (isValidOtpPattern == true) {
      try {
        // console.log('verifyotp');
        await dispatch(authActions.verifyotp(name, mobile, password, otp, fcmToken, ref_code));
        navigation.navigate('Home');
      } catch (err) {
        ToastAndroid.show(err.message, ToastAndroid.SHORT);
      }
    } else {
      ToastAndroid.show('Enter 6 Digit', ToastAndroid.SHORT);
    }
    setOtpLoader(false);
  };



  return (
    <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <ScrollView>
        <View style={{marginHorizontal: 15}}>
          <Avatar.Image
            size={200}
            source={require('../../assets/image/otp_verify.png')}
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
            OTP Verification
          </Title>
          <Subheading
            style={{
              alignSelf: 'center',
            }}>
            OTP is sent to Register Mobile Number
          </Subheading>
          <Text
            style={{
              alignSelf: 'center',
            }}>
            +91 {mobile}
          </Text>

          <TextInput
            label="Enter OTP"
            mode="flat"
            placeholder="Enter 6 digit OTP"
            underlinecolor={PRIMARY_COLOR}
            // error={true}
            value={otp}
            onChangeText={entered_otp => validateOtp(entered_otp)}
            outlinecolor={PRIMARY_COLOR}
            style={{
              color: PRIMARY_COLOR,
              marginVertical: 5,
              backgroundColor: 'white',
            }}
            theme={{colors: {primary: PRIMARY_COLOR}}}
            keyboardType="numeric"
            left={<TextInput.Icon name="lock-open" size={24} />}
          />
          {otpError ? (
            <Text style={{color: 'red', fontSize: 12}}>{otpError}</Text>
          ) : null}

          <Button
            mode="contained"
            style={{marginTop: 30}}
            theme={{colors: {primary: PRIMARY_COLOR}}}
            onPress={() => {
              verifyOtp();
            }}
            loading={otpLoader}
            labelStyle={{color: 'white'}}>
            Verify OTP
          </Button>

          <View style={{flex: 1, flexDirection: 'column', marginTop: 50}}>
            <Text style={{textAlign: 'center'}}>
              Resend OTP in{' '}
              <Text style={{color: 'green', fontWeight: 'bold'}}>
                {counter}
              </Text>{' '}
              Sec
            </Text>
            <Button
              mode="text"
              disabled={resendOTPBtn}
              theme={{colors: {primary: PRIMARY_COLOR}}}
              uppercase={false}
              style={{marginHorizontal:100}}
              onPress={()=>resendOTP()}
              >
              Resend OTP
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Otp;

const styles = StyleSheet.create({});
