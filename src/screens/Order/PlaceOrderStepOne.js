import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {
  List,
  Card,
  Button,
  Title,
  Paragraph,
  Headline,
  Subheading,
  TextInput,
  RadioButton,
  Chip,
  Caption,
} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector, useDispatch} from 'react-redux';
import PaymentList from '../../components/PaymentList';

import NetworkError from '../Common/NetworkError';
import NetInfo from '@react-native-community/netinfo';

import * as DeliveryDateTimeAction from '../../store/actions/DeliveryDateTimeAction';
import {API_BASE_URL} from '../../constants/Url';
import {PRIMARY_COLOR} from '../../constants/Color';

const PlaceOrderStepOne = ({navigation}) => {
  const [paymentList, setPaymentList] = useState([]);

  const [timeslot, setTimeslot] = React.useState(null);
  const [deliveryDate, setDeliveryDate] = React.useState(null);
  const [timeslotList, setTimeslotList] = useState([]);
  const [deliveryDateList, setDeliveryDateList] = useState([]);

  const auth_mobile = useSelector(state => state.AuthReducer.mobile);
  const token = useSelector(state => state.AuthReducer.token);

  const [defaultAddress, setDefaultAddress] = useState(false);
  const [addressTitle, setAddressTitle] = useState('');
  const [addressDescription, setAddressDescription] = useState('');
  const [areaStatus, setAreaStatus] = useState(0);

  const [isPaymentMethodeSelect, setIsPaymentMethodeSelect] = useState(false);
  const [isInternetConnected, setIsInternetConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const totalAmount = useSelector(state => state.CartReducer.totalAmount);


  var dateTimeArray = [];

  const dispatch = useDispatch();

  const apiCall = () => {
    var authAPIURL =
    API_BASE_URL+'paymentList.php';
    var header = {
      'Content-Type': 'application/json',
    };
    fetch(authAPIURL, {
      method: 'POST',
      headers: header,
      body: JSON.stringify({
        mobile: auth_mobile,
        token: token,
        total_amount:totalAmount
      }),
    })
      .then(response => response.json())
      .then(response => {
        // console.log('PAYMENT',response)
        setPaymentList(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const apiDefaultAddressCall = () => {
    var apiDefaultAddressURL =
    API_BASE_URL+'fetchDefaultAddress.php';
    var header = {
      'Content-Type': 'application/json',
    };
    fetch(apiDefaultAddressURL, {
      method: 'POST',
      headers: header,
      body: JSON.stringify({
        mobile: auth_mobile,
        token: token,
      }),
    })
      .then(response => response.json())
      .then(response => {
        if (response.address.length == 1) {
          if (response.address[0].area_status == 1) {
            setDefaultAddress(true);
          }

          setAddressTitle(
            response.address[0].addressType +
              ' - ' +
              response.address[0].area,
          );

          setAddressDescription(
            response.address[0].address_name +
              ', ' +
              response.address[0].home_number +
              ', ' +
              response.address[0].landmark,
          );
          
          setAreaStatus(response.address[0].area_status);
        } else {
          setDefaultAddress(false);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const apiTimeslotCall = () => {
    setTimeslotList([]);
    var authAPIURL =
    API_BASE_URL+'fetchTimeslot.php';
    var header = {
      'Content-Type': 'application/json',
    };
    fetch(authAPIURL, {
      method: 'POST',
      headers: header,
      body: JSON.stringify({
        mobile: auth_mobile,
        deliveryDate: deliveryDate,
      }),
    })
      .then(response => response.json())
      .then(response => {
        if (response.result == 'true') {
          setTimeslotList(response.data);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const apiDeliveryDateCall = () => {
    var authAPIURL =
    API_BASE_URL+'fetchDeliveryDates.php';
    var header = {
      'Content-Type': 'application/json',
    };
    fetch(authAPIURL, {
      method: 'POST',
      headers: header,
      body: JSON.stringify({
        mobile: auth_mobile,
      }),
    })
      .then(response => response.json())
      .then(response => {
        if (response.result == 'true') {
          setDeliveryDateList(response.data);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const setDeliveryDateFetchTimeslot = useCallback(ddate => {
    dispatch(DeliveryDateTimeAction.setDeliveryDate(ddate)), setTimeslot(null);
  });

  useEffect(() => {
    if (deliveryDate != null) {
      apiTimeslotCall();
    }
  }, [deliveryDate]);

  const setDeliveryDateAndTimeslot = useCallback(timeslot => {
    setTimeslot(timeslot), dateTimeArray.push(deliveryDate, timeslot);
    dispatch(DeliveryDateTimeAction.setDeliveryDateTime(dateTimeArray));
  });

  useEffect(() => {
    setLoading(true);
    const unsubscribe = NetInfo.addEventListener(internetState => {
      if (internetState.isConnected === true) {
        apiCall();
        apiDefaultAddressCall();
        setLoading(false);
      } else {
        setLoading(false);
        setIsInternetConnected(true);
        ToastAndroid.show('Internet Connection Failed', ToastAndroid.SHORT);
      }
    });
    unsubscribe();
  }, [paymentList, addressTitle]);

  useEffect(() => {
    apiDeliveryDateCall();
  }, []);

  const reloadPage = () => {
    setLoading(true);
    setIsInternetConnected(false);
    const unsubscribe = NetInfo.addEventListener(internetState => {
      if (internetState.isConnected === true) {
        apiCall();
        apiDefaultAddressCall();
        apiDeliveryDateCall();
      } else {
        setIsInternetConnected(true);
        ToastAndroid.show('Internet Connection Failed', ToastAndroid.SHORT);
      }
      setLoading(false);
    });

    unsubscribe();
  };

  const paymentItem = ({item}) => (
    <PaymentList
      id={item.id}
      img={item.img}
      title={item.title}
      description={item.description}
      status={item.status}
      api_key={item.api_key}
      setIsPaymentMethodeSelect={() => setIsPaymentMethodeSelect(true)}
    />
  );

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

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        </View>
      ) : (
        <>
          <View style={{marginHorizontal: 10}}>
            <FlatList
              data={paymentList}
              renderItem={paymentItem}
              key={item => item.id}
              keyExtractor={item => item.id}
              ListHeaderComponent={
                <>
                  <Subheading
                    style={{marginTop: 10, fontSize: 14, letterSpacing: 0}}
                    allowFontScaling={false}>
                    Delivery Date & Timeslot
                  </Subheading>
                  <Card>
                    <View style={{flex: 2, flexDirection: 'row'}}>
                      <View style={{flex: 1, alignSelf: 'flex-start'}}>
                        <FlatList
                          listKey={1}
                          data={deliveryDateList}
                          showsVerticalScrollIndicator={false}
                          renderItem={({item}) => (
                            <View
                              style={{
                                flexDirection: 'row',
                                alignContent: 'center',
                                alignItems: 'center',
                              }}>
                              <Chip
                                selectedcolor={PRIMARY_COLOR}
                                allowFontScaling={false}
                                textStyle={{fontSize: 12}}
                                style={{
                                  marginHorizontal: 10,
                                  marginVertical: 4,
                                }}
                                mode="outlined"
                                selected={
                                  deliveryDate == item.deliveryDate
                                    ? true
                                    : false
                                }
                                onPress={() => {
                                  setDeliveryDate(item.deliveryDate),
                                    setDeliveryDateFetchTimeslot(
                                      item.deliveryDate,
                                    );
                                }}>
                                {item.deliveryDate}
                              </Chip>
                            </View>
                          )}
                          keyExtractor={item => item.deliveryDate}
                          style={{height: 165}}
                        />
                      </View>
                      <View style={{flex: 1, alignSelf: 'flex-end'}}>
                        <FlatList
                          listKey={2}
                          data={timeslotList}
                          showsVerticalScrollIndicator={false}
                          renderItem={({item}) => (
                            <Chip
                              allowFontScaling={false}
                              selectedcolor={PRIMARY_COLOR}
                              textStyle={{fontSize: 12}}
                              style={{
                                marginHorizontal: 10,
                                marginVertical: 4,
                              }}
                              selected={
                                timeslot == `${item.mintime} - ${item.maxtime}`
                                  ? true
                                  : false
                              }
                              mode="outlined"
                              onPress={() => {
                                setDeliveryDateAndTimeslot(
                                  `${item.mintime} - ${item.maxtime}`,
                                );
                              }}>
                              {`${item.mintime} - ${item.maxtime}`}
                            </Chip>
                          )}
                          keyExtractor={item => item.id}
                          style={{height: 140}}
                        />
                      </View>
                    </View>
                  </Card>

                  <Subheading
                    style={{marginTop: 10, fontSize: 14, letterSpacing: 0}}
                    allowFontScaling={false}>
                    Payment Method
                  </Subheading>
                </>
              }
              ListFooterComponent={
                <ScrollView>
                  <View style={{marginHorizontal: 2}}>
                    <Subheading
                      style={{marginTop: 10, fontSize: 14, letterSpacing: 0}}
                      allowFontScaling={false}>
                      Current Address
                    </Subheading>
                    {areaStatus ? (
                      <Card
                        style={{borderRadius: 10, marginBottom: 8}}
                        elevation={5}>
                        <List.Item
                          allowFontScaling={false}
                          title={addressTitle}
                          description={
                            <>
                              <Text
                                style={{
                                  fontSize: 12,
                                  fontWeight: '100',
                                  color: 'gray',
                                }}
                                allowFontScaling={false}>
                                {addressDescription}
                              </Text>
                              {areaStatus == 0 ? (
                                <Text
                                  style={{
                                    fontSize: 11,
                                    fontWeight: '100',
                                    color: 'red',
                                    marginTop: 5,
                                  }}
                                  allowFontScaling={false}>
                                  {'\n'}This is not currently a deliverable
                                  address
                                </Text>
                              ) : null}
                            </>
                          }
                          titleStyle={{fontSize: 14}}
                          descriptionStyle={{fontSize: 12}}
                          titleNumberOfLines={1}
                          descriptionNumberOfLines={5}
                          left={() => (
                            <List.Icon icon="map-marker" color={PRIMARY_COLOR} />
                          )}
                          right={() => (
                            <View style={{alignSelf: 'center'}}>
                              <TouchableOpacity
                                onPress={() => {
                                  navigation.navigate('Address');
                                }}>
                                <Text
                                  style={{color: PRIMARY_COLOR}}
                                  allowFontScaling={false}>
                                  Change
                                </Text>
                              </TouchableOpacity>
                            </View>
                          )}
                        />
                      </Card>
                    ) : (
                      <Card style={{borderRadius: 10}} elevation={5}>
                        <List.Item
                          allowFontScaling={false}
                          style={{marginLeft: 0, paddingLeft: 0}}
                          title="No Address Available"
                          titleStyle={{fontSize: 14}}
                          descriptionStyle={{fontSize: 12}}
                          titleNumberOfLines={1}
                          descriptionNumberOfLines={2}
                          right={() => (
                            <View style={{alignSelf: 'center'}}>
                              <TouchableOpacity
                                onPress={() => {
                                  navigation.navigate('Address');
                                }}>
                                <Text
                                  style={{color: PRIMARY_COLOR, fontSize: 12}}
                                  allowFontScaling={false}>
                                  Add Address
                                </Text>
                              </TouchableOpacity>
                            </View>
                          )}
                        />
                      </Card>
                    )}
                  </View>
                </ScrollView>
              }
            />
          </View>

          <View
            style={{
              flexDirection: 'column',
              height: 50,
              paddingHorizontal: 15,
              backgroundColor: PRIMARY_COLOR,
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: '100%',
            }}>
            <Button
              allowFontScaling={false}
              mode="text"
              theme={{colors: {primary: PRIMARY_COLOR}}}
              style={{
                backgroundColor: 'white',
                alignSelf: 'center',
                marginVertical: 6,
              }}
              labelStyle={{fontSize: 13, letterSpacing: 0}}
              onPress={() => {
                deliveryDate
                  ? timeslot
                    ? defaultAddress
                      ? isPaymentMethodeSelect
                        ? navigation.navigate('PlaceOrder')
                        : ToastAndroid.show(
                            'Choose Payment Method',
                            ToastAndroid.SHORT,
                          )
                      : ToastAndroid.show('Choose Deliverable Address', ToastAndroid.SHORT)
                    : ToastAndroid.show(
                        'Select Delivery Time',
                        ToastAndroid.SHORT,
                      )
                  : ToastAndroid.show(
                      'Select Delivery Date',
                      ToastAndroid.SHORT,
                    );
              }}
              uppercase={false}>
              Place Order
            </Button>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default PlaceOrderStepOne;

const styles = StyleSheet.create({});
