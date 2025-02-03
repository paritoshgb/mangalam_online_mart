import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Ionicons';
import {TextInput, Button} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';

import NetInfo from '@react-native-community/netinfo';
import {API_BASE_URL} from '../../constants/Url';
import {PRIMARY_COLOR} from '../../constants/Color';

const AddAddress = ({navigation}) => {
  const auth_name = useSelector(state => state.AuthReducer.name);
  const auth_mobile = useSelector(state => state.AuthReducer.mobile);
  const token = useSelector(state => state.AuthReducer.token);
  const [area, setArea] = useState([]); //set fetch from api

  const [name, setName] = useState(auth_name);
  const [addressType, setAddressType] = useState('');
  const [houseNo, setHouseNo] = useState('');
  const [selectedArea, setSelectedArea] = useState(null);
  const [landMark, setLandMark] = useState('');
  const [city, setCity] = useState('Gwalior');
  const [pincode, setPincode] = useState('');

  const [nameError, setErrorName] = useState();
  const [addressTypeError, setAddressTypeError] = useState('');
  const [houseNoError, setHouseNoError] = useState('');
  const [landMarkError, setLandMarkError] = useState('');

  const [isValidNamePattern, setIsValidNamePattern] = useState(true);
  const [isValidAddressTypePattern, setIsValidAddressTypePattern] = useState(false);
  const [isValidHouseNoPattern, setIsValidHouseNoPattern] = useState(false);
  const [isValidLandMarkPattern, setIsValidLandMarkPattern] = useState(false);

  const onChangeName = name => {
    name = name.replace(/[`~0-9!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
    if (name.length < 6) {
      setName(name);
      setErrorName('Enter more than 6 Character');
      setIsValidNamePattern(false);
    }
    if (name.length >= 6) {
      setName(name);
      setErrorName('');
      setIsValidNamePattern(true);
    }
  };

  const onChangeAddressType = addressType => {
    if (addressType.length >= 1) {
      setAddressType(addressType);
      setAddressTypeError('');
      setIsValidAddressTypePattern(true);
    }
    if (addressType.length < 1) {
      setAddressType(addressType);
      setAddressTypeError('Required');
      setIsValidAddressTypePattern(false);
    }
  };

  const onChangeHouseNo = houseNo => {
    if (houseNo.length >= 1) {
      setHouseNo(houseNo);
      setHouseNoError('');
      setIsValidHouseNoPattern(true);
    }
    if (houseNo.length < 1) {
      setHouseNo(houseNo);
      setHouseNoError('Required');
      setIsValidHouseNoPattern(false);
    }
  };

  const onChangeLandMark = landMark => {
    // setLandMark(landMark)
    if (landMark.length >= 1) {
      setLandMark(landMark);
      setLandMarkError('');
      setIsValidLandMarkPattern(true);
    }
    if (landMark.length < 1) {
      setLandMark(landMark);
      setLandMarkError('Required');
      setIsValidLandMarkPattern(false);
    }
  };

  // const onChangeCity = city => {
  //   setCity(city);
  // };

  const onChangePincode = pincode => {
    pincode = pincode.replace(/[` ~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
    setPincode(pincode);
  };

  const apiCall = () => {
    var authAPIURL = API_BASE_URL + 'fetchAddressArea.php';
    var header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    fetch(authAPIURL, {
      method: 'POST',
      headers: header,
    })
      .then(response => response.json())
      .then(response => {
        if(response.area.length){
          setArea(response.area);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(internetState => {
      if (internetState.isConnected === true) {
        apiCall();
      } else {
        ToastAndroid.show('Internet Connection Failed', ToastAndroid.SHORT);
      }
    });
    unsubscribe();
  }, []);

  const addAddressApi = () => {
    var authAPIURL = API_BASE_URL + 'addAddress.php';
    var header = {
      'Content-Type': 'application/json',
    };
    fetch(authAPIURL, {
      method: 'POST',
      headers: header,
      body: JSON.stringify({
        name: name,
        addressType: addressType,
        houseNo: houseNo,
        selectedArea: selectedArea,
        landMark: landMark,
        auth_mobile: auth_mobile,
        token: token,
        city: city,
        pincode: pincode
      }),
    })
      .then(response => response.json())
      .then(response => {
        ToastAndroid.show(response.msg, ToastAndroid.SHORT);
        setAddressType('');
        setHouseNo('');
        setLandMark('');
        setAddressTypeError('');
        setHouseNoError('');
        setLandMarkError('');
        setCity('');
        setPincode('');
        setIsValidAddressTypePattern(false);
        setIsValidHouseNoPattern(false);
        setIsValidLandMarkPattern(false);
        navigation.navigate('Address');
      })
      .catch(error => {
        console.log(error);
      });
  };

  const addAddress = () => {
    const unsubscribe = NetInfo.addEventListener(internetState => {
      if (internetState.isConnected === true) {
        if (
          isValidNamePattern == true &&
          isValidAddressTypePattern == true &&
          isValidHouseNoPattern == true &&
          isValidLandMarkPattern == true
        ) {
          if (selectedArea != null) {
            addAddressApi();
          } else {
            ToastAndroid.show('Select Area', ToastAndroid.SHORT);
          }
        } else {
          ToastAndroid.show('All Fields are required', ToastAndroid.SHORT);
        }
      } else {
        ToastAndroid.show('Internet Connection Failed', ToastAndroid.SHORT);
      }
    });
    unsubscribe();
  };

  return (
    <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <ScrollView>
        <View style={{marginHorizontal: 15}}>
          <TextInput
            allowFontScaling={false}
            label="Name"
            mode="flat"
            placeholder="Enter Your Name"
            underlinecolor={PRIMARY_COLOR}
            // error={true}
            value={name}
            onChangeText={name => onChangeName(name)}
            outlinecolor={PRIMARY_COLOR}
            style={{
              color: PRIMARY_COLOR,
              backgroundColor: 'white',
            }}
            theme={{colors: {primary: PRIMARY_COLOR}}}
          />
          {nameError ? (
            <Text style={{color: 'red', fontSize: 12}}>{nameError}</Text>
          ) : null}

          <TextInput
            allowFontScaling={false}
            label="Address Type"
            mode="flat"
            placeholder="Enter Address Type (Eg. Home1)"
            underlinecolor={PRIMARY_COLOR}
            // error={true}
            value={addressType}
            onChangeText={addressType => onChangeAddressType(addressType)}
            outlinecolor={PRIMARY_COLOR}
            style={{
              color: PRIMARY_COLOR,
              backgroundColor: 'white',
            }}
            theme={{colors: {primary: PRIMARY_COLOR}}}
          />
          {addressTypeError ? (
            <Text style={{color: 'red', fontSize: 12}}>{addressTypeError}</Text>
          ) : null}

          <TextInput
            allowFontScaling={false}
            label="House Number"
            mode="flat"
            placeholder="Enter House Number"
            underlinecolor={PRIMARY_COLOR}
            // error={true}
            value={houseNo}
            onChangeText={houseNo => onChangeHouseNo(houseNo)}
            outlinecolor={PRIMARY_COLOR}
            style={{
              color: PRIMARY_COLOR,

              backgroundColor: 'white',
            }}
            theme={{colors: {primary: PRIMARY_COLOR}}}
          />
          {houseNoError ? (
            <Text style={{color: 'red', fontSize: 12}}>{houseNoError}</Text>
          ) : null}

          <TextInput
            allowFontScaling={false}
            label="Land Mark"
            mode="flat"
            placeholder="Enter Land Mark"
            underlinecolor={PRIMARY_COLOR}
            // error={true}
            value={landMark}
            onChangeText={landMark => onChangeLandMark(landMark)}
            outlinecolor={PRIMARY_COLOR}
            style={{
              color: PRIMARY_COLOR,
              backgroundColor: 'white',
            }}
            theme={{colors: {primary: PRIMARY_COLOR}}}
          />
          {landMarkError ? (
            <Text style={{color: 'red', fontSize: 12}}>{landMarkError}</Text>
          ) : null}

          <View style={{flex:2,flexDirection: 'row'}}>
            <TextInput
              allowFontScaling={false}
              label="City"
              mode="flat"
              //placeholder="Enter City"
              underlinecolor={PRIMARY_COLOR}
              value={city}
              //onChangeText={city => onChangeCity(city)}
              outlinecolor={PRIMARY_COLOR}
              style={{
                color: PRIMARY_COLOR,
                backgroundColor: 'white',
                flex:1
              }}
              theme={{colors: {primary: PRIMARY_COLOR}}}
            />

            <TextInput
              allowFontScaling={false}
              label="Pincode"
              mode="flat"
              placeholder="Enter Pincode"
              underlinecolor={PRIMARY_COLOR}
              value={pincode}
              onChangeText={pincode => onChangePincode(pincode)}
              outlinecolor={PRIMARY_COLOR}
              style={{
                color: PRIMARY_COLOR,
                backgroundColor: 'white',
                flex:1
              }}
              theme={{colors: {primary: PRIMARY_COLOR}}}
              keyboardType='numeric'
            />
          </View>

          <Picker
            allowFontScaling={false}
            selectedValue={selectedArea}
            style={{
              color: 'gray',
              marginTop: 5,
              backgroundColor: 'white',
            }}
            mode="dropdown"
            onValueChange={(itemValue, itemIndex) => {
              setSelectedArea(itemValue);
            }}>
            <Picker.Item label="Select Area" value="null" key="null_key" />
            {area.map((data, index) => {
              return (
                <Picker.Item
                  label={data.name}
                  value={data.name}
                  key={data.id}
                />
              );
            })}
          </Picker>
          <Button
            mode="outlined"
            onPress={() => addAddress()}
            style={{marginVertical: 20, borderColor: PRIMARY_COLOR}}
            theme={{colors: {primary: PRIMARY_COLOR}}}>
            Save Address
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddAddress;

const styles = StyleSheet.create({});
