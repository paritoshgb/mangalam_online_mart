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
  Image,
  BackHandler,
  ToastAndroid,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Linking
} from 'react-native';
import {Card, Paragraph, Subheading, List, Button, Avatar} from 'react-native-paper';
import StepIndicator from 'react-native-step-indicator';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useIsFocused,useFocusEffect} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import NetworkError from '../Common/NetworkError';
import NetInfo from '@react-native-community/netinfo';
import {API_BASE_URL} from '../../constants/Url';
import {PRIMARY_COLOR} from '../../constants/Color';

const labels = ['Pending', 'Ready to Ship', 'Delivered'];

const Item = ({
  productImg,
  productName,
  productPrice,
  discount,
  quantity,
  productVariation,
}) => (
  <Card
    style={{
      marginVertical: 5,
      borderWidth: 1,
      borderRadius: 10,
      overflow: 'hidden',
    }}>
    <List.Item
      style={{padding: 0}}
      title={productName}
      titleStyle={{fontWeight: 'bold', paddingRight: 2, fontSize: 12}}
      titleNumberOfLines={1}
      descriptionNumberOfLines={2}
      description={() => (
        <>
          <View>
            <Text allowFontScaling={false}>{productVariation}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1}}>
              <Text allowFontScaling={false}>Quantity: {quantity}</Text>
            </View>
            <View
              style={{
                flex: 1,
                alignSelf: 'flex-end',
                alignContent: 'flex-end',
              }}>
              <Text allowFontScaling={false}>
                <MaterialCommunityIcons
                  name="currency-inr"
                  style={{fontSize: 16}}
                />
                {productPrice}
              </Text>
            </View>
          </View>
        </>
      )}
      left={() => (
        <Image source={{uri: productImg}} style={{width: 70, height: 70}} />
      )}
    />
  </Card>
);

const renderItem = ({item}) => (
  <Item
    productImg={item.productImg}
    productName={item.productName}
    productPrice={item.productPrice}
    discount={item.discount}
    quantity={item.quantity}
    productVariation={item.productVariation}
  />
);

const TrackOrder = ({navigation}) => {
  var today = new Date();

  const isVisible = useIsFocused();

  const auth_mobile = useSelector(state => state.AuthReducer.mobile);
  const token = useSelector(state => state.AuthReducer.token);
  const orderDetailsId = useSelector(
    state => state.OrderReducer.orderDetailsId,
  );

  const [orderItem, setOrderItem] = useState([]);

  const [date, setDate] = useState();
  const [qty, setQty] = useState();
  const [mode, setMode] = useState();
  const [status, setStatus] = useState();
  const [deliveryCharge, setDeliveryCharge] = useState();
  const [tax, setTax] = useState();
  const [total, setTotal] = useState();
  const [address, setAddress] = useState();
  const [coupon, setCoupon] = useState();
  const [totalDiscountAmt, setTotalDiscountAmt] = useState();

  const [usedWalletAmount, setUsedWalletAmount] = useState(0);

  const [serviceTaxAmt, setServiceTaxAmt] = useState();
  const [deliveryDate, setDeliveryDate] = useState('');
  const [timeslot, setTimeslot] = useState('');
  const [cancelOrderMsg, setCancelOrderMsg] = useState();

  const [isInternetConnected, setIsInternetConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isTrackOrderListAvailable, setIsTrackOrderListAvailable] =
    useState(false);

  const [isOrderCancelled, setIsOrderCancelled] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [transactionId, setTransactionId] = useState('');

  const [deliveryBoyName, setDeliveryBoyName] = useState();
  const [deliveryBoyImg, setDeliveryBoyImg] = useState();
  const [deliveryBoyMobile, setDeliveryBoyMobile] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('Home')
        return true;
      };
       BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
       BackHandler.removeEventListener('hardwareBackPress', onBackPress);
   }, []),
  );

  const apiCall = () => {
    var authAPIURL = API_BASE_URL + 'trackOrder.php';
    var header = {
      'Content-Type': 'application/json',
    };
    fetch(authAPIURL, {
      method: 'POST',
      headers: header,
      body: JSON.stringify({
        mobile: auth_mobile,
        token: token,
        orderId: orderDetailsId,
      }),
    })
      .then(response => response.json())
      .then(response => {
        setOrderItem(response.orderItem);
        setDate(response.orderDate);
        setQty(response.quantity);
        setMode(response.paymentMethod);
        setTransactionId(response.transactionId)
        setStatus(parseInt(response.status));
        setDeliveryCharge(response.deliveryCharge);
        setTax(response.tax);
        setTotal(response.total);
        setAddress(response.address);
        setCoupon(response.couponAmt);
        setTotalDiscountAmt(response.totalDiscountAmt);
        setServiceTaxAmt(response.serviceTaxAmt);
        setDeliveryDate(response.deliveryDate);
        setTimeslot(response.timeslot);
        setCancelOrderMsg(response.cancelOrderMsg);

        setDeliveryBoyName(response.delivery_boy_name);
        setDeliveryBoyImg(response.delivery_boy_img);
        setDeliveryBoyMobile(response.delivery_boy_mobile);

        setUsedWalletAmount(response.usedWalletAmount)

        setLoading(false);
        setIsTrackOrderListAvailable(true);
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    setIsTrackOrderListAvailable(false);
    setLoading(true);
    setIsOrderCancelled(false);
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
  }, [orderDetailsId, isOrderCancelled, isVisible]);

  const cancelOrder = () => {
    var authAPIURL = API_BASE_URL + 'cancelOrder.php';
    var header = {
      'Content-Type': 'application/json',
    };
    fetch(authAPIURL, {
      method: 'POST',
      headers: header,
      body: JSON.stringify({
        mobile: auth_mobile,
        token: token,
        orderId: orderDetailsId,
      }),
    })
      .then(response => response.json())
      .then(response => {
        ToastAndroid.show(response.msg, ToastAndroid.LONG);
        if (response.result == 'true') {
          setIsOrderCancelled(true);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const reloadPage = () => {
    setLoading(true);
    setIsInternetConnected(false);
    setIsOrderCancelled(false);
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

  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setLoading(false);
    setIsInternetConnected(false);
    setIsOrderCancelled(false);
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

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        </View>
      ) : null}

      {isTrackOrderListAvailable ? (
        <View style={{marginHorizontal: 10}}>
          <FlatList
            data={orderItem}
            renderItem={renderItem}
            keyExtractor={item => item.productId}
            key={item => item.productId}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListHeaderComponent={
              <>
                <Card style={{marginTop: 10}}>
                  <Card.Content>
                    <View style={{flex: 3, flexDirection: 'row'}}>
                      <View style={{flex: 3}}>
                        <Subheading
                          style={{marginBottom: 15, fontSize: 14}}
                          allowFontScaling={false}>
                          Order ID:{' '}
                          <Text style={{fontWeight: 'bold'}}>
                            {orderDetailsId}
                          </Text>
                        </Subheading>
                      </View>
                      <View style={{alignSelf: 'center', marginTop: -15}}>
                        {status <= 2 ? (
                          <TouchableOpacity
                            onPress={() =>
                              Alert.alert(
                                'Cancel Order',
                                'Really want to cancel order',
                                [
                                  {
                                    text: 'Cancel',
                                    onPress: () => {},
                                    style: 'cancel',
                                  },
                                  {text: 'OK', onPress: () => cancelOrder()},
                                ],
                              )
                            }>
                            <Text
                              style={{color: PRIMARY_COLOR}}
                              allowFontScaling={false}>
                              Cancel
                            </Text>
                          </TouchableOpacity>
                        ) : null}
                      </View>
                    </View>
                    <View style={{flex: 3, flexDirection: 'row'}}>
                      <View style={{flex: 1.5}}>
                        <Subheading
                          style={{fontSize: 14}}
                          allowFontScaling={false}>
                          Date: <Text style={{fontWeight: 'bold'}}>{date}</Text>
                        </Subheading>
                        <Subheading
                          style={{fontSize: 14}}
                          allowFontScaling={false}>
                          Quantity:{' '}
                          <Text style={{fontWeight: 'bold'}}>{qty}</Text>
                        </Subheading>
                        <Subheading
                          style={{fontSize: 14}}
                          allowFontScaling={false}>
                          Status:{' '}
                          <Text
                            style={{fontWeight: 'bold', color: PRIMARY_COLOR}}>
                            {status == 1 ? 'Pending' : null}
                            {status == 2 ? 'Processing' : null}
                            {status == 3 ? 'Completed' : null}
                            {status == 4 ? 'Cancelled' : null}
                          </Text>
                        </Subheading>
                        <Subheading
                          style={{fontSize: 14}}
                          allowFontScaling={false}>
                          Mode: <Text style={{fontWeight: 'bold'}}>{mode}</Text>
                        </Subheading>
                        <Subheading
                          style={{fontSize: 14}}
                          allowFontScaling={false}>
                          Txn Id: <Text style={{fontWeight: 'bold'}}>{transactionId}</Text>
                        </Subheading>
                        
                      </View>
                      <View
                        style={{
                          flex: 1,
                          borderStyle: 'dotted',
                          borderColor: '#fe7013',
                          borderLeftWidth: 1,
                          paddingHorizontal: 5,
                        }}>
                        <Subheading
                          style={{fontSize: 14}}
                          allowFontScaling={false}>
                          Subtotal:
                          <Text style={{fontWeight: 'bold'}}>
                            <MaterialCommunityIcons
                              name="currency-inr"
                              style={{fontSize: 14}}
                            />
                            {totalDiscountAmt}
                          </Text>
                        </Subheading>
                        <Subheading
                          style={{fontSize: 14}}
                          allowFontScaling={false}>
                          Delivery:
                          <MaterialCommunityIcons
                            name="currency-inr"
                            style={{fontSize: 14}}
                          />
                          <Text style={{fontWeight: 'bold'}}>
                            {deliveryCharge > 0 ? deliveryCharge : 0}
                          </Text>
                        </Subheading>
                        <Subheading
                          style={{fontSize: 14}}
                          allowFontScaling={false}>
                          Tax <Text style={{fontSize: 12}}>{`(${tax}%)`} </Text>{' '}
                          :
                          <Text style={{fontWeight: 'bold'}}>
                            <MaterialCommunityIcons
                              name="currency-inr"
                              style={{fontSize: 14}}
                            />
                            {serviceTaxAmt}
                          </Text>
                        </Subheading>
                        <Subheading
                          style={{fontSize: 14}}
                          allowFontScaling={false}>
                          Coupon:
                          <Text style={{fontWeight: 'bold'}}>
                            <MaterialCommunityIcons
                              name="currency-inr"
                              style={{fontSize: 14}}
                            />
                            {coupon > 0 ? coupon : 0}
                          </Text>
                        </Subheading>
                        <Subheading
                          style={{fontSize: 14}}
                          allowFontScaling={false}>
                          Wallet Amt:
                          <Text style={{fontWeight: 'bold'}}>
                            <MaterialCommunityIcons
                              name="currency-inr"
                              style={{fontSize: 14}}
                            />
                            {usedWalletAmount}
                          </Text>
                        </Subheading>
                        <Subheading
                          style={{fontSize: 14}}
                          allowFontScaling={false}>
                          Total:
                          <MaterialCommunityIcons
                            name="currency-inr"
                            style={{fontSize: 14}}
                          />
                          <Text style={{fontWeight: 'bold'}}>{total}</Text>
                        </Subheading>
                      </View>
                    </View>
                    <Subheading
                      style={{marginVertical: 15, fontSize: 14}}
                      allowFontScaling={false}>
                      Address:{' '}
                      <Text style={{fontWeight: 'bold'}}>{address}</Text>
                    </Subheading>
                    {status == 3 || status == 4 ? null : (
                      <View style={{flexDirection: 'column'}}>
                        <Subheading
                          style={{fontSize: 14}}
                          allowFontScaling={false}>
                          Delivery Date:{' '}
                          <Text style={{fontWeight: 'bold'}}>
                            {deliveryDate}
                          </Text>
                        </Subheading>
                        <Subheading
                          style={{fontSize: 14}}
                          allowFontScaling={false}>
                          Expected Time:{' '}
                          <Text style={{fontWeight: 'bold'}}>{timeslot}</Text>
                        </Subheading>
                      </View>
                    )}
                  </Card.Content>
                </Card>
                {status < 3 && deliveryBoyMobile > 0 ? (
                  <Card style={{marginTop: 10}}>
                    <Card.Content>
                      <Subheading
                        style={{fontSize: 14}}
                        allowFontScaling={false}>
                        Delivery Boy Details:
                      </Subheading>
                      <View style={{flex: 2, flexDirection: 'row'}}>
                        <View style={{flex: 0.5}}>
                          <Avatar.Image
                            size={64}
                            source={{
                              uri: deliveryBoyImg,
                            }}
                            theme={{colors: {primary: '#fff'}}}
                          />
                        </View>
                        <View style={{flex: 1.5, alignSelf: 'center'}}>
                          <Text style={{fontWeight: 'bold'}}>
                            {deliveryBoyName}
                          </Text>
                          <Text
                            style={{fontWeight: 'bold', lineHeight: 25}}
                            onPress={() => {
                              Linking.openURL(`tel:+91${deliveryBoyMobile}`);
                            }}>
                            {deliveryBoyMobile}
                          </Text>
                        </View>
                      </View>
                    </Card.Content>
                  </Card>
                ) : null}
                {status < 4 ? (
                  <View style={{margin: 15}}>
                    <StepIndicator
                      allowFontScaling={false}
                      customStyles={{
                        stepIndicatorSize: 25,
                        currentStepIndicatorSize: 30,
                        separatorStrokeWidth: 3,
                        currentStepStrokeWidth: 3,
                        stepStrokeCurrentColor: '#fe7013',
                        stepStrokeWidth: 3,
                        stepStrokeFinishedColor: '#fe7013',
                        stepStrokeUnFinishedColor: '#aaaaaa',
                        separatorFinishedColor: '#fe7013',
                        separatorUnFinishedColor: '#aaaaaa',
                        stepIndicatorFinishedColor: '#fe7013',
                        stepIndicatorUnFinishedColor: '#ffffff',
                        stepIndicatorCurrentColor: '#ffffff',
                        stepIndicatorLabelFontSize: 13,
                        currentStepIndicatorLabelFontSize: 13,
                        stepIndicatorLabelCurrentColor: '#fe7013',
                        stepIndicatorLabelFinishedColor: '#ffffff',
                        stepIndicatorLabelUnFinishedColor: '#aaaaaa',
                        labelColor: '#999999',
                        labelSize: 13,
                        currentStepLabelColor: '#fe7013',
                      }}
                      stepCount={3}
                      currentPosition={status - 1}
                      labels={labels}
                    />
                  </View>
                ) : null}
                {cancelOrderMsg == 1 ? (
                  <View>
                    <Subheading
                      style={{marginVertical: 15, fontSize: 14}}
                      allowFontScaling={false}>
                      Note:{' '}
                      <Text
                        allowFontScaling={false}
                        style={{fontWeight: 'bold'}}>
                        Order Cancelled Succesfully. If you already paid,
                        Payment will be refunded in 5 - 7 working days. Ignore if already refund 🙏
                      </Text>
                    </Subheading>
                  </View>
                ) : null}
              </>
            }
          />
        </View>
      ) : null}
    </SafeAreaView>
  );
};

export default TrackOrder;

const styles = StyleSheet.create({});
