import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Image,
  ActivityIndicator,
  ToastAndroid,
  RefreshControl,
  Alert
} from 'react-native';
import {FAB, List, Subheading, Button, Card, Snackbar} from 'react-native-paper';
// import AddressList from '../../components/AddressList';
import {useSelector, useDispatch} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';

import NetworkError from '../Common/NetworkError';
import NetInfo from '@react-native-community/netinfo';
import {API_BASE_URL} from '../../constants/Url';
import {PRIMARY_COLOR} from '../../constants/Color';

const Address = ({navigation, route}) => {
  const isVisible = useIsFocused();
  const [addressList, setAddressList] = useState([]);
  const [isAddressAvailable, setIsAddressAvailable] = useState(false);
  const [addressMsg, setAddressMsg] = useState('');

  const auth_mobile = useSelector(state => state.AuthReducer.mobile);
  const token = useSelector(state => state.AuthReducer.token);

  const [isInternetConnected, setIsInternetConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = React.useState(false);

  const AddressList = (props) => {
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
      var authAPIURL = API_BASE_URL + 'setDefaultAddress.php';
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
          apiCall();
          ToastAndroid.show(response.msg, ToastAndroid.SHORT);
          navigation.goBack();
          console.log('setDefaultAddress')
        })
        .catch(error => {
          console.log(error);
        });
    };
  
    const deleteAddress = addressId => {
      var authAPIURL = API_BASE_URL + 'deleteAddress.php';
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
          apiCall();
          ToastAndroid.show(response.msg, ToastAndroid.SHORT);
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
              onLongPress={
                () =>
                  ToastAndroid.show(
                    'This is default address',
                    ToastAndroid.SHORT,
                  )
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
          <>
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
          </>
        )}
      </>
    );
  };

  const apiCall = () => {
    var authAPIURL =
    API_BASE_URL+'addressList.php';
    var header = {
      'Content-Type': 'application/json',
    };
    fetch(authAPIURL, {
      method: 'POST',
      headers: header,
      body: JSON.stringify({
        mobile: auth_mobile,
        token: token,
      }),
    })
      .then(response => response.json())
      .then(response => {
        if (response.addresslist.length > 0) {
          setIsAddressAvailable(true);
          setAddressList(response.addresslist);
        } else {
          setAddressMsg(response.msg);
          setIsAddressAvailable(false);
        }
        setLoading(false);
      })
      .catch(error => {
        console.log('error Address',error);
      });
  };

  const reloadPage = () => {
    setLoading(true);
    setIsInternetConnected(false);
    setIsAddressAvailable(false);
    const unsubscribe = NetInfo.addEventListener(internetState => {
      if (internetState.isConnected === true) {
        apiCall();
      } else {
        setLoading(false);
        setIsInternetConnected(true);
        ToastAndroid.show('Internet Connection Failed', ToastAndroid.SHORT);
      }
    });
    unsubscribe();
  };

  useEffect(() => {
    apiCall();
  }, [isVisible])

  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setLoading(false);
    setIsInternetConnected(false);
    const unsubscribe = NetInfo.addEventListener(internetState => {
      if (internetState.isConnected === true) {
        apiCall();
        ToastAndroid.show('Data Refreshed', ToastAndroid.SHORT);
      } else {
        setLoading(false);
        setIsInternetConnected(true);
        ToastAndroid.show('Internet Connection Failed', ToastAndroid.SHORT);
      }
    });
    unsubscribe();
    wait(2000).then(() => setRefreshing(false));
  }, []);


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
  

  const addressItem = ({item}) => (
    <AddressList
      address_id={item.id}
      houseNo={item.home_number}
      area={item.area}
      landMark={item.landmark}
      addressType={item.addressType}
      status={item.status}
      addressName={item.address_name}
      deliveryCharge={item.deliveryCharge}
      areaStatus = {item.area_status}
    />
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        </View>
      ) : null}

      {isAddressAvailable ? (
        <View style={{marginHorizontal: 15}}>
          <FlatList
            data={addressList}
            renderItem={addressItem}
            key={item => item.id}
            keyExtractor={item => item.id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            style={{marginTop:5}}
          />
        </View>
      ) : loading ? null : (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: Dimensions.get('window').width + 100,
          }}>
          <Image
            source={require('../../assets/image/address.png')}
            style={{width: 100, height: 100}}
          />
          <Subheading
            allowFontScaling={false}
            style={{
              textAlign: 'center',
              marginHorizontal: 60,
              color: '#ccc',
            }}>
            {addressMsg}
          </Subheading>
        </View>
      )}

      <FAB
        style={{
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0,
          backgroundColor: PRIMARY_COLOR,
        }}
        color="white"
        label='Add Address'
        uppercase={false}
        theme={{colors: {primary: PRIMARY_COLOR}}}
        icon="map-marker-radius"
        onPress={() => navigation.navigate('AddAddress')}
      />
    </SafeAreaView>
  );
};

export default Address;

const styles = StyleSheet.create({});
