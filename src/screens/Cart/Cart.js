import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  BackHandler,
  ToastAndroid,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  Searchbar,
  List,
  Card,
  Button,
  Subheading,
  FAB,
  Title,
  Caption,
} from 'react-native-paper';
import DeviceInfo from 'react-native-device-info';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Ionicons';
// import {Picker} from '@react-native-community/picker';
import {useSelector, useDispatch} from 'react-redux';
import CartList from '../../components/CartList';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';

import NetworkError from '../Common/NetworkError';
import NetInfo from '@react-native-community/netinfo';

import * as cartAction from '../../store/actions/CartAction';
import * as couponAction from '../../store/actions/CouponAction';
import * as OrderSettingAction from '../../store/actions/OrderSettingAction';
import {API_BASE_URL} from '../../constants/Url';
import {PRIMARY_COLOR} from '../../constants/Color';
import {useNavigation} from '@react-navigation/native';

const Cart = ({navigation}) => {
  const navigate = useNavigation();
  const dispatch = useDispatch();
  const cartProducts = useSelector(state => state.CartReducer.cartProducts);
  const totalAmount = useSelector(state => state.CartReducer.totalAmount);
  // console.log('cart products', cartProducts);
  const {name, mobile, isLoggedIn, token} = useSelector(
    state => state.AuthReducer,
  );

  const minOrderAmt = useSelector(
    state => state.OrderSettingReducer.minOrderAmt,
  );
  const isVisible = useIsFocused();
  const [refresh, setRefresh] = useState(false);

  const [statePlaceOrderBtn, setStatePlaceOrderBtn] = useState(false);
  const [minOrderMsg, setMinOrderMsg] = useState('');
  const [Amount, setAmount] = useState('');
  const [discountprice, SetDiscountPrice] = useState('');
  const [deviceId, setDeviceid] = useState('');
  const [cartProductsJson, setCartProductsJson] = useState([]);
  const [itemCount, setItemCount] = useState(cartProductsJson.length);
  const [Count, setCount] = useState(0);

  const [isInternetConnected, setIsInternetConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  const getDeviceId = () => {
    var deviceid = DeviceInfo.getAndroidId();
    setDeviceid(deviceid);
  };

  useFocusEffect(
    React.useCallback(() => {
      getDeviceId();
    }, [isVisible]),
  );

  var result = [];
  var totalDiscounPrice = 0;

  function handleBackButtonClick() {
    setCartProductsJson([]);
    // setRefresh(!refresh)
    setItemCount();
    navigation.goBack();
    return true;
  }

  // const fetchComboDealOfferApi = () => {
  //   var fetchProductAPIURL = API_BASE_URL + `fetchComboProductList.php?currentPage=${currentPage}`;
  //   fetch(fetchProductAPIURL, {
  //     method: 'POST',
  //   })
  //     .then(response => response.json())
  //     .then(response => {
  //       setSpecialCombo(response.data);
  //       //console.log("specialoffer",response.data)
  //     });
  //  }

  const cartProductAPI = () => {
    setLoading(true);
    var authAPIURL = API_BASE_URL + `cartProducts.php?device_id=${deviceId._j}`;
    var header = {
      'Content-Type': 'application/json',
    };
    fetch(authAPIURL, {
      method: 'POST',
      headers: header,
      body: JSON.stringify({
        cartProducts: cartProducts,
      }),
    })
      .then(response => response.json())
      .then(response => {
        setRefresh(!refresh);
        // console.log('CARTLIS', response);
        setAmount(response.total_amount);
        SetDiscountPrice(response.total_discount_amount);
        //ToastAndroid.show(response, ToastAndroid.SHORT);
        for (var i = 0; i < response.data.length; ++i) {
          if (response.data[i].is_ok == true) {
            setCartProductsJson(response.data);
            // ProductMaintainApi2(response.data)
            result.push([
              response.data[i].productTypePriceId,
              cartProducts[response.data[i].productTypePriceId],
            ]);
          } else {
            dispatch(
              cartAction.deleteItem(response.data[i].productTypePriceId),
            );
            ToastAndroid.show('Some Item may be removed', ToastAndroid.LONG);
          }
        }

        setLoading(false);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const DeleteCartItem = () => {
    dispatch(cartAction.emptyCart()),
      (result = []),
      setCartProductsJson([]),
      setItemCount(0),
      setAmount('');
    SetDiscountPrice('');
    // ToastAndroid.show('Cart has been cleared', ToastAndroid.SHORT);

    var authAPIURL = API_BASE_URL + 'Clearcart.php';

    var header = {
      'Content-Type': 'application/json',
    };

    fetch(authAPIURL, {
      method: 'POST',
      headers: header,
      body: JSON.stringify({
        device_id: deviceId._j,
      }),
    })
      .then(response => response.json())
      .then(response => {
        // console.log('RESPONSE', response);
        if (response.result == 'false') {
          ToastAndroid.show(response.msg, ToastAndroid.SHORT);
        } else {
          ToastAndroid.show('Cart has been cleared', ToastAndroid.SHORT);
        }
      })
      .catch(error => {
        console.log(error);
      });
    navigation.navigate('Home');
  };

  const ProductMaintainApi = item => {
    // setLoading(true);
    var authAPIURL = API_BASE_URL + 'addcartProduct.php';
    var header = {
      'Content-Type': 'application/json',
    };
    var Qty = Number(item.quantity) + 1;
    // console.log('QTY', Qty);
    fetch(authAPIURL, {
      method: 'POST',
      headers: header,
      body: JSON.stringify({
        productTypePriceId: item.productTypePriceId,
        product_name: item.product_name,
        productPrice: item.productPrice,
        combo: item.combo,
        combo_amount: item.combo_amount,
        discount: item.discount,
        popular: item.popular,
        productVariation: item.productVariation,
        product_img: item.product_img,
        quantity: Qty,
        device_id: deviceId._j,
      }),
    })
      .then(response => response.json())
      .then(response => {
        // setRefresh(!refresh)
        // console.log('RESPONSE',response)
        cartProductAPI();
        if (response.result == 'false') {
          ToastAndroid.show(response.msg, ToastAndroid.SHORT);
        } else {
          ToastAndroid.show('Item Added', ToastAndroid.SHORT);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const ProductMaintainApi2 = item => {
    var authAPIURL = API_BASE_URL + 'addcartProduct.php';
    var header = {
      'Content-Type': 'application/json',
    };
    var Qty = Number(item.quantity) - 1;
    // console.log('QTY', Qty);

    // if (Qty == 0) {
    //   dispatch(cartAction.deleteItem(item.productTypePriceId));
    // }
    // console.log('ITEM', item);

    fetch(authAPIURL, {
      method: 'POST',
      headers: header,
      body: JSON.stringify({
        productTypePriceId: item.productTypePriceId,
        product_name: item.product_name,
        productPrice: item.productPrice,
        combo: item.combo,
        combo_amount: item.combo_amount,
        discount: item.discount,
        popular: item.popular,
        productVariation: item.productVariation,
        product_img: item.product_img,
        quantity: Qty,
        device_id: deviceId._j,
      }),
    })
      .then(response => response.json())
      .then(response => {
        // setRefresh(!refresh);
        // console.log('RESPONSE',response);
        cartProductAPI();
      })
      .catch(error => {
        console.log(error);
      });
  };

  for (var i in cartProducts) {
    totalDiscounPrice =
      totalDiscounPrice +
      Math.ceil(
        (parseInt(cartProducts[i].quantity) *
          parseInt(cartProducts[i].productPrice) *
          (100 - parseInt(cartProducts[i].discount))) /
          100,
      );
  }

  const apiCall = () => {
    var authAPIURL = API_BASE_URL + 'setting.php';
    var header = {
      'Content-Type': 'application/json',
    };
    fetch(authAPIURL, {
      method: 'POST',
      headers: header,
    })
      .then(response => response.json())
      .then(response => {
        var min_order_amt = parseInt(response.data[0].minimum_order_value);
        dispatch(OrderSettingAction.setMinOrderAmt(min_order_amt));
        setMinOrderMsg('Minimum Order Amount ' + min_order_amt);
        if (parseInt(totalAmount) >= min_order_amt) {
          setStatePlaceOrderBtn(false);
        } else {
          setStatePlaceOrderBtn(true);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    setIsInternetConnected(false);
    setStatePlaceOrderBtn(true);
    const unsubscribe = NetInfo.addEventListener(internetState => {
      if (internetState.isConnected === true) {
        setLoading(true);
        result = [];
        cartProductAPI();
        // setRefresh(!refresh)
        setCartProductsJson(result);
      } else {
        setLoading(false);
        setIsInternetConnected(true);
        ToastAndroid.show('Internet Connection Failed', ToastAndroid.SHORT);
      }
    });
    unsubscribe();
  }, [isVisible]);

  useEffect(() => {
    setItemCount(cartProductsJson.length);
  }, [result]);

  useEffect(() => {
    setTimeout(() => {
      apiCall();
      BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    });
  }, [isVisible]);

  const reloadPage = () => {
    setLoading(true);
    setStatePlaceOrderBtn(false);
    setIsInternetConnected(false);
    const unsubscribe = NetInfo.addEventListener(internetState => {
      if (internetState.isConnected === true) {
        cartProductAPI();
        setItemCount();
        setCartProductsJson([]);
        setCartProductsJson(result);
        setItemCount(result.length);

        BackHandler.addEventListener(
          'hardwareBackPress',
          handleBackButtonClick,
        );

        apiCall();
      } else {
        setLoading(false);
        setIsInternetConnected(true);
        ToastAndroid.show('Internet Connection Failed', ToastAndroid.SHORT);
      }
    });
    unsubscribe();
  };

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

  // const [productCount, setProductCount] = useState(itemCount);
  //  console.log("CCCCc",Count)

  const renderItem = ({item}) => {
    var cartReadyItems = [];
    //setCount(item.quantity)

    cartReadyItems.push(
      item.product_name,
      item.product_img,
      item.discount,
      item.popular,
      item.productTypePriceId,
      item.combo_amount,
      item.combo,
    );

    return (
      <View style={{marginBottom: 10, marginHorizontal: 5}}>
        <Card
          style={{
            height: Dimensions.get('window').height / 6.2,
            elevation: 5,
            borderRadius: 10,
          }}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View
              style={{
                width: 100,
              }}>
              {item.discount > 0 ? (
                <Text
                  allowFontScaling={false}
                  style={{
                    backgroundColor: 'green',
                    color: 'white',
                    width: 65,
                    borderRadius: 50,
                    paddingLeft: 8,
                    position: 'absolute',
                    top: 3,
                    left: 5,
                    zIndex: 999,
                    fontSize: 12,
                  }}>
                  {item.discount}% Off
                </Text>
              ) : null}

              {item.popular == 1 ? (
                <Text
                  style={{
                    color: PRIMARY_COLOR,
                    paddingLeft: 8,
                    position: 'absolute',
                    top: 3,
                    right: 5,
                    zIndex: 999,
                  }}>
                  <MaterialCommunityIcons name="heart" />
                </Text>
              ) : null}
              <Image
                source={{
                  uri: item.product_img,
                }}
                style={{height: '100%', borderRadius: 10}}
              />
            </View>
            <View style={{marginLeft: 5}}>
              <Title
                style={{fontSize: 16}}
                allowFontScaling={false}
                numberOfLines={2}>
                {item.product_name.length < 28
                  ? item.product_name
                  : item.product_name.substring(0, 25) + '...'}
              </Title>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Subheading
                  style={{fontSize: 14, letterSpacing: 0}}
                  allowFontScaling={false}>
                  <MaterialCommunityIcons
                    name="currency-inr"
                    style={{fontSize: 14}}
                    allowFontScaling={false}
                  />
                  <Text allowFontScaling={false}>
                    {item.discount > 0
                      ? Math.ceil(
                          (item.productPrice * (100 - item.discount)) / 100,
                        )
                      : item.productPrice}
                  </Text>

                  {item.discount > 0 ? (
                    <Text
                      style={{fontSize: 11, color: PRIMARY_COLOR}}
                      allowFontScaling={false}>
                      {'   '}Save
                      <MaterialCommunityIcons
                        name="currency-inr"
                        style={{fontSize: 11}}
                      />
                      {item.productPrice -
                        Math.ceil(
                          (item.productPrice * (100 - item.discount)) / 100,
                        )}
                    </Text>
                  ) : null}
                </Subheading>
                {item.discount > 0 ? (
                  <Caption style={{letterSpacing: 0}} allowFontScaling={false}>
                    MRP :
                    <MaterialCommunityIcons
                      name="currency-inr"
                      style={{fontSize: 12}}
                    />
                    <Text>{item.productPrice}</Text>
                  </Caption>
                ) : null}
              </View>

              <View style={{flexDirection: 'row'}}>
                <View
                  style={{
                    borderRadius: 5,
                    borderWidth: 1,
                    width: 100,
                    marginRight: 5,
                    borderColor: 'gray',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingVertical: 5,
                    paddingHorizontal: 5,
                    flexDirection: 'row',
                  }}>
                  <Text
                    numberOfLines={1}
                    allowFontScaling={false}
                    style={{fontSize: 12}}>
                    {item.productVariation}
                  </Text>
                  {/* <TouchableOpacity>
                    <Text>
                      <Icon name="ios-caret-forward-outline" />
                    </Text>
                  </TouchableOpacity> */}
                </View>
                <View style={{width: 100}}>
                  <View style={{flex: 3, flexDirection: 'row'}}>
                    <View style={{flex: 1, alignSelf: 'flex-start'}}>
                      <Button
                        allowFontScaling={false}
                        onPress={() => {
                          dispatch(cartAction.removeToCart(cartReadyItems));
                          dispatch(couponAction.emptyCoupon());

                          ProductMaintainApi2(item);
                          // console.log(Count)
                          // dispatch(cartAction.addToCart(cartReadyItems));
                          // setCount(parseInt(Count - 1));
                          // cartProductAPI()
                          // cartProductAPI()
                        }}
                        compact="true"
                        mode="contained"
                        color={PRIMARY_COLOR}
                        style={{width: 30, marginLeft: 5}}
                        disabled={item.quantity > 0 ? false : true}
                        labelStyle={{
                          color: 'white',
                          marginVertical: 6,
                          fontSize: 12,
                          textAlign: 'center',
                        }}>
                        -
                      </Button>
                    </View>
                    <View
                      style={{
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{marginVertical: 5}}
                        allowFontScaling={false}>
                        {item.quantity === 0 ? Count : item.quantity}
                      </Text>
                    </View>

                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                      <Button
                        allowFontScaling={false}
                        compact="true"
                        mode="contained"
                        color={PRIMARY_COLOR}
                        onPress={() => {
                          ProductMaintainApi(item);
                          // console.log(Count)
                          dispatch(cartAction.addToCart(cartReadyItems));
                          // setCount(parseInt(Count + 1));
                          //  cartProductAPI()
                        }}
                        style={{width: 30, marginRight: 5}}
                        labelStyle={{
                          color: 'white',
                          marginVertical: 6,
                          fontSize: 12,
                        }}>
                        +
                      </Button>
                    </View>
                  </View>
                </View>
              </View>
              {/* {item.stock_qty > 1 ? (
                <Text style={{color: 'green'}} allowFontScaling={false}>
                  In Stock:{item.stock_qty}
                </Text>
              ) : (
                <Text style={{color: 'red'}} allowFontScaling={false}>
                  In Stock:{item.stock_qty}
                </Text>
              )} */}
            </View>
          </View>
        </Card>
      </View>
    );

    // <CartList
    //   // product_type_price_id={item[0]}
    //   // productPrice={item[1].productPrice}
    //   // productVariation={item[1].productVariation}
    //   // productQuantity={item[1].quantity}
    //   // product_name={item[1].product_name}
    //   // product_img={item[1].product_img}
    //   // discount={item[1].discount}
    //   // popular={item[1].popular}
    //   // combo={item[1].combo}
    //   // combo_amount={item[1].combo_amount}
    //   // totalAmount={totalAmount}
    //   // product_type_price_id={item.productTypePriceId}
    //   // productPrice={item.productPrice}
    //   // productVariation={item.productVariation}
    //   // productQuantity={item.quantity}
    //   // product_name={item.product_name}
    //   // product_img={item.product_img}
    //   // discount={item.discount}
    //   // popular={item.popular}
    //   //  totalAmount={Amount}
    //   //  cartProductAPI={cartProductAPI}
    // />
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        </View>
      ) : (
        <View style={{marginHorizontal: 5, marginTop: 5}}>
          <FlatList
            data={cartProductsJson}
            renderItem={renderItem}
            keyExtractor={item => item[0]}
            showsVerticalScrollIndicator={false}
            style={{marginBottom: 50}}
            ListEmptyComponent={
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: Dimensions.get('window').width + 100,
                }}>
                <Image
                  source={require('../../assets/image/empty_cart.png')}
                  style={{width: 100, height: 100}}
                />
                <Subheading
                  allowFontScaling={false}
                  style={{
                    textAlign: 'center',
                    marginHorizontal: 60,
                    color: '#ccc',
                  }}>
                  No item in Cart
                </Subheading>
              </View>
            }
          />
        </View>
      )}

      <FAB
        color="white"
        small
        style={{
          position: 'absolute',
          margin: 20,
          left: 0,
          bottom: 40,
          backgroundColor: PRIMARY_COLOR,
        }}
        icon="trash-can-outline"
        onPress={() => {
          Alert.alert('Clear Cart', 'Do you really want to clear cart?', [
            {
              text: 'Cancel',
              onPress: () => {},
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                DeleteCartItem();
                // dispatch(cartAction.emptyCart()),
                //   (result = []),
                //   setCartProductsJson([]),
                //   setItemCount(0),
                //   setAmount('')
                //   SetDiscountPrice('')
                //   ToastAndroid.show(
                //     'Cart has been cleared',
                //     ToastAndroid.SHORT,
                //   );
              },
            },
          ]);
        }}
      />

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
        <View
          style={{
            flex: 2,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              // marginVertical: 13,
              alignItems: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingRight: 5,
              }}>
              <Icon
                style={{color: 'white', marginRight: 10}}
                name="cart-outline"
                size={15}
              />
              <Text
                style={{color: 'white', fontSize: 14}}
                allowFontScaling={false}>
                {itemCount} Item
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                borderStartWidth: 1,
                borderStartColor: 'white',
                paddingLeft: 5,
              }}>
              <Text
                style={{color: 'white', fontSize: 12, fontWeight: 'bold'}}
                allowFontScaling={false}>
                <MaterialCommunityIcons
                  name="currency-inr"
                  style={{fontSize: 12}}
                />
                {/* {discountprice} */}
                {Amount}
              </Text>
              {Amount < discountprice ? (
                <Text
                  allowFontScaling={false}
                  style={{
                    color: 'white',
                    fontSize: 11,
                    textDecorationLine: 'line-through',
                  }}>
                  <MaterialCommunityIcons
                    name="currency-inr"
                    style={{fontSize: 11}}
                  />
                  {discountprice}
                </Text>
              ) : null}
            </View>
          </View>
          <View style={{flex: 1, marginVertical: 6, alignItems: 'center'}}>
            <Button
              allowFontScaling={false}
              mode="text"
              theme={{colors: {primary: PRIMARY_COLOR}}}
              style={{backgroundColor: 'white', alignSelf: 'flex-end'}}
              labelStyle={{
                fontSize: 12,
                letterSpacing: 0,
              }}
              onPress={() => {
                isLoggedIn
                  ? Amount >= minOrderAmt
                    ? navigation.navigate('PlaceOrderStepOne')
                    : ToastAndroid.show(minOrderMsg, ToastAndroid.SHORT)
                  : navigation.navigate('Login');
              }}
              uppercase={false}>
              Continue To Checkout
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Cart;

const styles = StyleSheet.create({});
