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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as authActions from '../../store/actions/AuthAction';
import {useSelector, useDispatch} from 'react-redux';
import {PRIMARY_COLOR} from '../../constants/Color';

const Signup = ({navigation}) => {
  const dispatch = useDispatch();

  const [name, setName] = useState();
  const [mobile, setMobile] = useState();
  const [password, setPassword] = useState('');
  const [ref_code, setref_code] = useState(null);

  const [nameError, setErrorName] = useState();
  const [mobileError, setmobileError] = useState();
  const [passwordError, setpasswordError] = useState();
  const [ref_codeError, setref_codeError] = useState();

  const [isValidNamePattern, setIsValidNamePattern] = useState(false);
  const [isValidMobilePattern, setIsValidMobilePattern] = useState(false);
  const [isValidPasswordPattern, setIsValidPasswordPattern] = useState(false);
  const [isValidref_codePattern, setIsValidref_codePattern] = useState(false);

  const [hidePass, setHidePass] = useState(true);

  const [signupLoader, setSignupLoader] = useState(false);

  const onChangeUsername = user_name => {
    user_name = user_name.replace(
      /[`~0-9!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,
      '',
    );
    if (user_name.length < 6) {
      setName(user_name);
      setErrorName('Enter more than 6 Character');
      setIsValidNamePattern(false);
    }
    if (user_name.length >= 6) {
      setName(user_name);
      setErrorName('');
      setIsValidNamePattern(true);
    }
  };
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
  const onChangeref_code = ref_code => {
    if (ref_code.length < 6) {
      setref_code(ref_code);
      setref_codeError('Enter more than 6 Character');
      setIsValidref_codePattern(false);
    }
    if (ref_code.length >= 6) {
      setref_codeError('');
      setref_code(ref_code);
      setIsValidref_codePattern(true);
    }
  };

  const signUp = async () => {
    setSignupLoader(true);

    if (
      isValidNamePattern == true &&
      isValidMobilePattern == true &&
      isValidPasswordPattern == true
    ) {
      try {
        await dispatch(authActions.signup(name, mobile, password, ref_code));
        navigation.navigate('Otp');
      } catch (err) {
        ToastAndroid.show(err.message, ToastAndroid.SHORT);
      }
    } else {
      ToastAndroid.show(
        'Invalid Name, Mobile no. or Password',
        ToastAndroid.SHORT,
      );
    }

    setSignupLoader(false);
  };

  return (
    <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <ScrollView>
        <View style={{marginHorizontal: 15}}>
          <Avatar.Image
            size={200}
            source={require('../../assets/image/signup.png')}
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
            Create Account
          </Title>
          <Subheading
            style={{
              alignSelf: 'center',
            }}>
            Create new Account to Order Us
          </Subheading>

          <TextInput
            label="Name"
            mode="flat"
            placeholder="Enter Name"
            underlinecolor={PRIMARY_COLOR}
            value={name}
            // error={true}
            onChangeText={user_name => onChangeUsername(user_name)}
            outlinecolor={PRIMARY_COLOR}
            style={{
              color: PRIMARY_COLOR,
              marginVertical: 5,
              backgroundColor: 'white',
            }}
            theme={{colors: {primary: PRIMARY_COLOR}}}
            left={<TextInput.Icon name="account" size={24} />}
          />
          {nameError ? (
            <Text style={{color: 'red', fontSize: 12}}>{nameError}</Text>
          ) : null}

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
            onChangeText={user_password => onChangePassword(user_password)}
            // error={true}
            value={password}
            outlinecolor={PRIMARY_COLOR}
            style={{
              color: PRIMARY_COLOR,
              marginVertical: 5,
              backgroundColor: 'white',
              flex: 1,
            }}
            theme={{colors: {primary: PRIMARY_COLOR}}}
            // keyboardType='default'
            secureTextEntry={hidePass ? true : false}
            left={<TextInput.Icon name="lock" size={24} />}
            right={
              <TextInput.Icon
                name="eye-off"
                onPress={() => setHidePass(!hidePass)}
              />
            }
          />
          {passwordError ? (
            <Text style={{color: 'red', fontSize: 12}}>{passwordError}</Text>
          ) : null}

          <TextInput
            label="Referral Code (Optional)"
            mode="flat"
            placeholder="Enter Referral Code (Optional)"
            underlinecolor={PRIMARY_COLOR}
            value={ref_code}
            // error={true}
            onChangeText={ref_code => onChangeref_code(ref_code)}
            outlinecolor={PRIMARY_COLOR}
            style={{
              color: PRIMARY_COLOR,
              marginVertical: 5,
              backgroundColor: 'white',
            }}
            theme={{colors: {primary: PRIMARY_COLOR}}}
            left={<TextInput.Icon name="tag-heart" size={24} />}
          />
          {ref_codeError ? (
            <Text style={{color: 'red', fontSize: 12}}>{ref_codeError}</Text>
          ) : null}

          <Button
            mode="contained"
            style={{marginTop: 30}}
            theme={{colors: {primary: PRIMARY_COLOR}}}
            onPress={() => {
              signUp();
            }}
            loading={signupLoader}
            labelStyle={{color: 'white'}}>
            Sign Up
          </Button>
        </View>
        <View
          style={{marginHorizontal: 15, alignSelf: 'center', marginTop: 50}}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text>
              If you have account{' '}
              <Text style={{color: PRIMARY_COLOR}}>Login here</Text>{' '}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signup;

const styles = StyleSheet.create({});
