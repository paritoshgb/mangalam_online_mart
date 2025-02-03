import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ToastAndroid,
  Alert,
} from 'react-native';
import {Card, List} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
import { API_BASE_URL } from '../constants/Url';
import {PRIMARY_COLOR} from '../constants/Color';

const AddressList = props => {
  // console.log(props)
  const auth_mobile = useSelector(state => state.AuthReducer.mobile);
  const token = useSelector(state => state.AuthReducer.token);

  const deleteAddressPrompt = addressId => {
    Alert.alert('Do you want to delete?', '', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => deleteAddress(addressId),
      },
    ]);
  };

  const setDefaultAddressPrompt = addressId => {
    Alert.alert('Set Default Address?', 'Set this address as default', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => setDefaultAddress(addressId),
      },
    ]);
  };

  const setDefaultAddress = addressId => {
    var authAPIURL =
      API_BASE_URL+'setDefaultAddress.php';
    var header = {
      'Content-Type': 'application/json',
    };
    fetch(authAPIURL, {
      method: 'POST',
      headers: header,
      body: JSON.stringify({
        mobile: auth_mobile,
        token: token,
        addressId: addressId,
      }),
    })
      .then(response => response.json())
      .then(response => {
        ToastAndroid.show(response.msg, ToastAndroid.SHORT);
        // setAddressList(response.ResultData);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const deleteAddress = addressId => {
    var authAPIURL =
      API_BASE_URL+'deleteAddress.php';
    var header = {
      'Content-Type': 'application/json',
    };
    fetch(authAPIURL, {
      method: 'POST',
      headers: header,
      body: JSON.stringify({
        mobile: auth_mobile,
        token: token,
        addressId: addressId,
      }),
    })
      .then(response => response.json())
      .then(response => {
        ToastAndroid.show(response.msg, ToastAndroid.SHORT);
        // setAddressList(response.ResultData);
      })
      .catch(error => {
        console.log(error);
      });
  };
  return (
    <>
      {props.status == 1 ? (
        <Card style={{borderRadius: 15, marginVertical: 3}}>
          <TouchableOpacity
            onLongPress={() =>
              ToastAndroid.show('This is default address', ToastAndroid.SHORT)
            }>
            <List.Item
              title={props.addressType + ' - ' + props.area}
              allowFontScaling={false}
              description={
                <>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '100',
                      color: 'gray',
                    }}
                    allowFontScaling={false}>
                    {`${props.addressName}, ${props.houseNo}, ${props.landMark}`}
                  </Text>
                  {props.areaStatus == 0 ? (
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: '100',
                        color: 'red',
                        marginTop: 5,
                      }}
                      allowFontScaling={false}>
                      {'\n'}This is not currently a deliverable address
                    </Text>
                  ) : null}
                </>
              }
              left={() => <List.Icon icon="map-marker" color="green" />}
              right={() => (
                <List.Icon icon="menu-right-outline" color="green" />
              )}
              style={{borderColor: 'green', borderWidth: 1, borderRadius: 15}}
              titleStyle={{fontSize: 14}}
              descriptionStyle={{fontSize: 12}}
              descriptionNumberOfLines={5}
              titleNumberOfLines={1}
            />
          </TouchableOpacity>
        </Card>
      ) : (
        <Card style={{borderRadius: 15, marginVertical: 3}}>
          <TouchableOpacity
            onLongPress={() => deleteAddressPrompt(props.address_id)}
            onPress={() => setDefaultAddressPrompt(props.address_id)}>
            <List.Item
              title={props.addressType + ' - ' + props.area}
              description={
                <>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '100',
                      color: 'gray',
                    }}
                    allowFontScaling={false}>
                    {`${props.addressName}, ${props.houseNo}, ${props.landMark}`}
                  </Text>
                  
                  {props.areaStatus == 0 ? (
                    <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '100',
                      color: 'red',
                      marginTop: 5,
                    }}
                    allowFontScaling={false}>
                    {'\n'}This is not currently a deliverable address
                  </Text>
                  ) : null}
                </>
              }
              titleStyle={{fontSize: 14}}
              descriptionStyle={{fontSize: 12}}
              descriptionNumberOfLines={5}
              titleNumberOfLines={1}
              left={() => <List.Icon icon="map-marker" />}
              right={() => <List.Icon icon="menu-right-outline" />}
            />
          </TouchableOpacity>
        </Card>
      )}
    </>
  );
};

export default AddressList;

const styles = StyleSheet.create({});
