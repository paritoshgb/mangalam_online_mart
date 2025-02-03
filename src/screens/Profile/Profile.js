import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Image,
  ToastAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Button, Avatar, TextInput, Divider} from 'react-native-paper';
import RNFetchBlob from 'rn-fetch-blob';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import ImagePicker from 'react-native-image-crop-picker';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useSelector, useDispatch} from 'react-redux';
import * as authActions from '../../store/actions/AuthAction';

import NetworkError from '../Common/NetworkError';
import NetInfo from '@react-native-community/netinfo';
import { API_BASE_URL } from '../../constants/Url';
import {PRIMARY_COLOR} from '../../constants/Color';

const Profile = ({navigation}) => {
  const auth_mobile = useSelector(state => state.AuthReducer.mobile);

  const sheetRef = React.useRef(null);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState(auth_mobile);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePass, setHidePass] = useState(true);
  const [profileImg, updateProfileImg] = useState(null);

  const [nameError, setErrorName] = useState();
  const [passwordError, setpasswordError] = useState();
  const [isValidNamePattern, setIsValidNamePattern] = useState(true);
  const [isValidPasswordPattern, setIsValidPasswordPattern] = useState(true);

  const [isInternetConnected, setIsInternetConnected] = useState(false);

  const [refCode, setRefCode] = useState()

  const dispatch = useDispatch();

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

  const uploadProfilePic = myProfileImg => {
    if (profileImg != null) {
      ToastAndroid.show('Please wait while data uploading', ToastAndroid.SHORT);
      RNFetchBlob.fetch(
        'POST',
        API_BASE_URL+'uploadProfilePic.php',
        {
          'Content-Type': 'multipart/form-data',
        },
        [
          {
            name: 'image',
            filename: 'profile.png',
            data: RNFetchBlob.wrap(myProfileImg),
          },
          {name: 'mobile', data: String(mobile)},
        ],
      )
        .then(resp => {
          var jsonData = JSON.parse(resp.data);
          ToastAndroid.show(jsonData[0].message, ToastAndroid.LONG);
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  const updateProfileData = async () => {
    if (isValidNamePattern == true && isValidPasswordPattern == true) {
      try {
        await dispatch(authActions.updateProfileData(name, mobile, password, email)); 
        ToastAndroid.show('Profile Updated', ToastAndroid.SHORT);
      } catch (err) {
        ToastAndroid.show(err.message, ToastAndroid.SHORT);
      }
    } else {
      ToastAndroid.show('Invalid Name or Password', ToastAndroid.SHORT);
    }
  };

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      cropping: true,
      width: 500,
      height: 500,
      compressImageQuality: 1,
    })
      .then(image => {
        updateProfileImg(image.path);
        uploadProfilePic(image.path);
        sheetRef.current.snapTo(1);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      cropping: true,
      width: 500,
      height: 500,
      compressImageQuality: 1,
    })
      .then(image => {
        // console.log(image)
        updateProfileImg(image.path);
        uploadProfilePic(image.path);
        sheetRef.current.snapTo(1);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const apiCall = () => {
    var authAPIURL =
      API_BASE_URL+'fetchProfileDetails.php';
    var header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    var authData = {
      mobile: auth_mobile,
    };

    fetch(authAPIURL, {
      method: 'POST',
      headers: header,
      body: JSON.stringify(authData),
    })
      .then(response => response.json())
      .then(response => {
        console.log(response)
        if (response.result == 'true') {
          setPassword(response.data[0].password);
          setName(response.data[0].name);
          setEmail(response.data[0].email);
          updateProfileImg(response.data[0].profilePicturePath);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const fetchWalletAmountAPI = () => {
    var fetchProductAPIURL = API_BASE_URL + `fetchRefCodeByMobileNo.php`;
    var header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    var authData = {
      mobile: auth_mobile,
    };

    fetch(fetchProductAPIURL, {
      method: 'POST',
      headers: header,
      body: JSON.stringify(authData),
    })
      .then(response => response.json())
      .then(response => {
        setRefCode(response.ref_code);
      });
  };

  const reloadPage = () => {
    setIsInternetConnected(false);
    const unsubscribe = NetInfo.addEventListener(internetState => {
      if (internetState.isConnected === true) {
        apiCall();
      } else {
        setIsInternetConnected(true);
        ToastAndroid.show('Internet Connection Failed', ToastAndroid.SHORT);
      }
    });
    unsubscribe();
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(internetState => {
      if (internetState.isConnected === true) {
        apiCall();
        fetchWalletAmountAPI()
      } else {
        setIsInternetConnected(true);
        ToastAndroid.show('Internet Connection Failed', ToastAndroid.SHORT);
      }
    });
    unsubscribe();
  }, [auth_mobile]);

  if (isInternetConnected) {
    return (
      <>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
          }}>
          <NetworkError />
          <Button
            mode="text"
            color={PRIMARY_COLOR}
            uppercase={false}
            onPress={() => reloadPage()}>
            Reload
          </Button>
        </View>
      </>
    );
  }

  const renderContent = () => (
    <View style={styles.panel}>
      <View style={{alignItems: 'center'}}>
        <Text style={styles.panelTitle}>Upload Profile</Text>
      </View>
      <View style={{}}></View>
      <View style={{marginVertical: 5}}>
        <Button
          icon="camera"
          mode="contained"
          color="#231F20"
          onPress={takePhotoFromCamera}>
          Open camera
        </Button>
      </View>
      <View style={{marginVertical: 5}}>
        <Button
          icon="image"
          mode="contained"
          color="#231F20"
          onPress={choosePhotoFromLibrary}>
          Choose Image
        </Button>
      </View>
      <View style={{marginVertical: 5}}>
        <Button
          mode="flat"
          color="#231F20"
          onPress={() => sheetRef.current.snapTo(2)}>
          Cancel
        </Button>
      </View>
    </View>
  );

  return (
    <>
      <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <ScrollView>
          <View
            style={{
              alignSelf: 'center',
              alignItems: 'center',
              alignContent: 'center',
              marginTop: 15,
              borderColor: PRIMARY_COLOR,
              borderWidth: 1,
              borderRadius: 85,
            }}>
            <Avatar.Image
              size={170}
              source={{uri: profileImg}}
              style={{backgroundColor: 'white'}}
            />
          </View>
          <View
            style={{
              backgroundColor: PRIMARY_COLOR,
              borderRadius: 40,
              width: 40,
              height: 40,
              top: -50,
              left: 100,
            }}>
            <TouchableOpacity
              onPress={() => sheetRef.current.snapTo(0)}
              style={{padding: 10}}>
              <Icon
                name="camera"
                size={20}
                style={{
                  color: 'white',
                  position: 'relative',
                }}
              />
            </TouchableOpacity>
          </View>

          <View style={{marginHorizontal: 15}}>
          <TextInput
            allowFontScaling={false}
              label="Referrel Code"
              mode="flat"
              value={refCode}
              underlinecolor={PRIMARY_COLOR}
              disabled={true}
              outlinecolor={PRIMARY_COLOR}
              style={{
                color: PRIMARY_COLOR,
                marginVertical: 5,
                backgroundColor: 'white',
              }}
              theme={{colors: {primary: PRIMARY_COLOR}}}
              left={<TextInput.Icon name="diamond-stone" size={24} />}
            />
            <Divider />

            <TextInput
            allowFontScaling={false}
              label="Mobile Number"
              mode="flat"
              value={mobile}
              underlinecolor={PRIMARY_COLOR}
              disabled={true}
              outlinecolor={PRIMARY_COLOR}
              style={{
                color: PRIMARY_COLOR,
                marginVertical: 5,
                backgroundColor: 'white',
              }}
              theme={{colors: {primary: PRIMARY_COLOR}}}
              left={<TextInput.Icon name="phone" size={24} />}
            />
            <Divider />

            <TextInput
            allowFontScaling={false}
              label="Name"
              mode="flat"
              placeholder="Enter Name"
              underlinecolor={PRIMARY_COLOR}
              value={name}
              onChangeText={name => onChangeUsername(name)}
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
            allowFontScaling={false}
              label="Email"
              mode="flat"
              placeholder="Enter Email"
              underlinecolor={PRIMARY_COLOR}
              // error={true}
              value={email}
              onChangeText={email => setEmail(email)}
              outlinecolor={PRIMARY_COLOR}
              style={{
                color: PRIMARY_COLOR,
                marginVertical: 5,
                backgroundColor: 'white',
              }}
              theme={{colors: {primary: PRIMARY_COLOR}}}
              keyboardType="email-address"
              left={<TextInput.Icon name="email" size={24} />}
            />

            <TextInput
            allowFontScaling={false}
              label="Password"
              mode="flat"
              placeholder="Enter Password"
              underlinecolor={PRIMARY_COLOR}
              onChangeText={user_password => onChangePassword(user_password)}
              value={password}
              outlinecolor={PRIMARY_COLOR}
              style={{
                color: PRIMARY_COLOR,
                marginVertical: 5,
                backgroundColor: 'white',
                display:'none',
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
              mode="text"
              onPress={() => updateProfileData()}
              style={{marginVertical: 20}}
              theme={{colors: {primary: PRIMARY_COLOR}}}>
              Save
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
      <BottomSheet
        ref={sheetRef}
        snapPoints={[280, 50, 0]}
        borderRadius={10}
        renderContent={renderContent}
        initialSnap={1}
        enabledGestureInteraction={true}
      />
    </>
  );
};

export default Profile;
const styles = StyleSheet.create({
  panel: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 60,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 5,
    shadowOpacity: 0.4,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  panelTitle: {
    fontSize: 18,
    height: 35,
    marginBottom: 15,
  },
});
