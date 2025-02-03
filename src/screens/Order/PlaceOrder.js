import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Image,
  BackHandler,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import {
  List,
  Card,
  Button,
  Title,
  Paragraph,
  Headline,
  Subheading,
  TextInput,
} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector, useDispatch} from 'react-redux';
import {useIsFocused,useFocusEffect} from '@react-navigation/native';
import * as couponAction from '../../store/actions/CouponAction';
import * as cartAction from '../../store/actions/CartAction';

import NetworkError from '../Common/NetworkError';
import NetInfo from '@react-native-community/netinfo';

import RazorpayCheckout from 'react-native-razorpay';
import {API_BASE_URL, BASE_URL} from '../../constants/Url';
import {PRIMARY_COLOR} from '../../constants/Color';

import * as paymentAction from '../../store/actions/PaymentAction';

const PlaceOrder = ({navigation}) => {
  const cartProducts = useSelector(state => state.CartReducer.cartProducts);
 // console.log("cartProducts",useSelector(state => state.CartReducer.cartProducts))
  const totalAmount = useSelector(state => state.CartReducer.totalAmount);
  console.log("cartProducts",cartProducts)
  console.log("totalAmount",totalAmount)
 
  const {name, mobile, isLoggedIn, token} = useSelector(
    state => state.AuthReducer,
  );
  const deliveryDate = useSelector(
    state => state.DeliveryDateTimeReducer.deliveryDate,
  );
  const timeslot = useSelector(
    state => state.DeliveryDateTimeReducer.deliveryTime,
  );
  const appliedCoupon = useSelector(state => state.CouponReducer.appliedCoupon);
  const {
    paymentMethodeId,
    paymentMethodeTitle,
    paymentMethodeImg,
    api_key,
    description,
  } = useSelector(state => state.PaymentReducer);

  const [cartProductsJson, setCartProductsJson] = useState([]);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [addressId, setAddressId] = useState('');
  const [serviceTax, setServiceTax] = useState(0);
  const [placeOrderBtn, setplaceOrderBtn] = useState(true);
  const [isInternetConnected, setIsInternetConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [specialCombo,setSpecialCombo]=useState([]);
  const [title, setTitle] = useState();
  const [logo, setLogo] = useState();
  const [currency, setCurrency] = useState();
  const [currentPage,setCurrentPage]=useState(1);
  const [walletAmount, setWalletAmount] = useState(0);
  const [balanceWalletAmount, setBalanceWalletAmount] = useState(0);
  const [isWalletAmountApplied, setIsWalletAmountApplied] = useState(false);
  const [applayWalletIcon, setApplayWalletIcon] = useState('minus-circle');
  const[type,setType]=useState(1);
  const [Amount,setAmount]=useState('')
  const [discountprice,SetDiscountPrice]=useState('')
  const [actualPaymentAmount, setActualPaymentAmount] = useState();
  const [refresh,setRefresh]=useState(false)
   const[products,setProducts]=useState([]);
   const[temp,setTemp]=useState(false);
  const dispatch = useDispatch();

  const finalAmount = totalAmount + deliveryCharge + serviceTax*totalAmount/100;
  console.log("finalAmount",finalAmount);

  const isVisible = useIsFocused();
  var result = [];
  var totalDiscountPrice = 0;
  var combo=0;
  var combo_amount=0;
  for (var i in products) {
    // console.log("combodeallllll",combo_amount);
    // combo_amount=parseInt(cartProducts[i].combo_amount)
    // combo=parseInt(cartProducts[i].combo)

    // if(totalDiscountPrice>800 && (combo==1)){
    //   console.log("price>800",totalDiscountPrice)
    //   totalDiscountPrice =
    //   totalDiscountPrice +
    //   Math.ceil(
    //     (parseInt(cartProducts[i].quantity) *
    //       parseInt(cartProducts[i].combo_amount) *
    //       (100 - parseInt(cartProducts[i].discount))) /
    //       100,
    //   );
    // }
    // else{ console.log("price withount combo",totalDiscountPrice)
    //   totalDiscountPrice =
    //   totalDiscountPrice +
    //   Math.ceil(
    //     (parseInt(cartProducts[i].quantity) *
    //       parseInt(cartProducts[i].productPrice) *
    //       (100 - parseInt(cartProducts[i].discount))) /
    //       100,
    //   );}
    totalDiscountPrice =
      totalDiscountPrice +
      Math.ceil(
        (parseInt(products[i].quantity) *
          parseInt(products[i].productPrice) *
          (100 - parseInt(products[i].discount))) /
          100,
      ) 
   
    result.push([i, products[i]]); 
  }

  function handleBackButtonClick() {
   // setCartProductsJson([]);
    navigation.goBack();
    return true;
  }

  const apiDefaultAddressCall = () => {
    var apiDefaultAddressURL = API_BASE_URL + 'fetchDefaultAddress.php';
    var header = {
      'Content-Type': 'application/json',
    };
    fetch(apiDefaultAddressURL, {
      method: 'POST',
      headers: header,
      body: JSON.stringify({
        mobile: mobile,
        token: token,
      }),
    })
      .then(response => response.json())
      .then(response => {
        if (response.result == 'true') {
          setDeliveryCharge(parseInt(response.address[0].deliveryCharge));
          setAddressId(response.address[0].id);
          setLoading(false);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const apiSettingCall = () => {
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
        setServiceTax(parseInt(response.data[0].tax));
        setTitle(response.data[0].title);
        setLogo(response.data[0].app_logo);
        setCurrency(response.data[0].currency);
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const fetchWalletAmountAPI = () => {
    var fetchProductAPIURL = API_BASE_URL + `fetchWalletAmountByMobileNo.php`;
    var header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    var authData = {
      mobile: mobile,
      type:type,
      total_amount:Amount + deliveryCharge + serviceTax*totalAmount/100 
    };

    fetch(fetchProductAPIURL, { 
      method: 'POST',
      headers: header,
      body: JSON.stringify(authData),
    })
      .then(response => response.json()) 
      .then(response => {
        console.log('PLCODR',response)
        setWalletAmount(response.walletamount);
        setBalanceWalletAmount(response.walletamount); 
        setTemp(true) 
      });
  };

  console.log('ghgc',totalAmount)

  // useEffect(() => {
  //   reloadPage()
  //   setTemp(false); 
  // }, [temp]);

  useFocusEffect(
    React.useCallback(() => {
  setCartProductsJson([]);
  setCartProductsJson(result);
  setRefresh(!refresh)
  fetchWalletAmountAPI()
    }, [products,deliveryCharge,serviceTax])  
  ); 

  const cartProductAPI = () => {
    setLoading(true);
    var authAPIURL = API_BASE_URL + 'cartProducts.php'; 
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
        console.log('RRR',response) 
      
        setRefresh(!refresh) 
        setAmount(response.total_amount)
        SetDiscountPrice(response.total_discount_amount)
        for (var i = 0; i < response.data.length; ++i) {
          if (response.data[i].is_ok == true) {
            setProducts(response.data)
            setRefresh(!refresh)  
          } else {
            
            ToastAndroid.show('Some Item may be removed', ToastAndroid.LONG);
          }
        }
         setLoading(false);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const applyWalletAmount = () => {
    // console.log(isWalletAmountApplied)
    if (isWalletAmountApplied) {
      setActualPaymentAmount(
        appliedCoupon.length
          ? appliedCoupon.map(item => {
              return ( 
                Amount +
                deliveryCharge +
                Math.round((Amount * serviceTax) / 100) -
                parseInt(item.coupon_value)
              );
            })
          : Amount +
              deliveryCharge +
              Math.round((Amount * serviceTax) / 100) -
              0,
      );
      setBalanceWalletAmount(walletAmount);
      setApplayWalletIcon('minus-circle');
      setIsWalletAmountApplied(false);
    } else {
      if (
        walletAmount >=
        (Amount +
          deliveryCharge +
          Math.round((Amount * serviceTax) / 100) -
          0)
      ) {
        setBalanceWalletAmount(
          walletAmount -
            (Amount +
            deliveryCharge +
            Math.round((Amount * serviceTax) / 100) -
            0),
        );
        setActualPaymentAmount(0);
      } else {
        setBalanceWalletAmount(0);

        setActualPaymentAmount(
          appliedCoupon.length
            ? appliedCoupon.map(item => {
                return (
                  (Amount +
                  deliveryCharge +
                  Math.round((Amount * serviceTax) / 100) -
                  parseInt(item.coupon_value)) -
                  walletAmount
                );
              })
            : (Amount +
                deliveryCharge +
                Math.round((Amount * serviceTax) / 100) -
                0) -
                walletAmount,
        );
      }
      setApplayWalletIcon('check-circle');
      setIsWalletAmountApplied(true);
    }
  };

  useEffect(() => {
    setLoading(true);
    setIsInternetConnected(false);
    const unsubscribe = NetInfo.addEventListener(internetState => {
      if (internetState.isConnected === true) {
        setCartProductsJson([]);
        setCartProductsJson(result);
        fetchWalletAmountAPI();
        cartProductAPI();
        apiDefaultAddressCall();
       // fetchComboDealOfferApi();
        apiSettingCall();
        setplaceOrderBtn(false);
        BackHandler.addEventListener(
          'hardwareBackPress',
          handleBackButtonClick,
        );
      } else {
        setLoading(false);
        setIsInternetConnected(true);
        ToastAndroid.show('Internet Connection Failed', ToastAndroid.SHORT);
      }
    });
    unsubscribe();
  }, [isVisible]);

  const reloadPage = () => {
    setLoading(true);
    setIsInternetConnected(false);
    const unsubscribe = NetInfo.addEventListener(internetState => {
      if (internetState.isConnected === true) {
        setCartProductsJson([]);
        setCartProductsJson(result);
        apiDefaultAddressCall();
        cartProductAPI();
        apiSettingCall();
        setplaceOrderBtn(false); // enable btn
        BackHandler.addEventListener(
          'hardwareBackPress',
          handleBackButtonClick,
        );
      } else {
        setLoading(false);
        setIsInternetConnected(true);
        ToastAndroid.show('Internet Connection Failed', ToastAndroid.SHORT);
      }
    });
    unsubscribe();
  };

  useEffect(() => {
    console.log("totalDiscountPrice",totalDiscountPrice);
    setActualPaymentAmount(
      
      Amount +
        deliveryCharge +
        Math.round((Amount * serviceTax) / 100) -
        0,
    );
  }, [Amount, deliveryCharge, serviceTax]);

  useEffect(() => {
    // console.log('isWalletAmountApplied ', isWalletAmountApplied);
    if (isWalletAmountApplied) {
      if (
        walletAmount >=
        (Amount +
          deliveryCharge +
          Math.round((Amount * serviceTax) / 100) -
          0)
      ) {
        setBalanceWalletAmount(
          walletAmount -
            (Amount +
            deliveryCharge +
            Math.round((Amount * serviceTax) / 100) -
            0),
        );
        setActualPaymentAmount(0);
      } else {
        setBalanceWalletAmount(0);

        setActualPaymentAmount(
          appliedCoupon.length
            ? appliedCoupon.map(item => {
                return (
                  (Amount +
                  deliveryCharge +
                  Math.round((Amount * serviceTax) / 100) -
                  parseInt(item.coupon_value)) -
                  walletAmount
                );
              })
            : (Amount +
                deliveryCharge +
                Math.round((Amount * serviceTax) / 100) -
                0) -
                walletAmount,
        );
      }
      setApplayWalletIcon('check-circle');
      setIsWalletAmountApplied(false);
    } else {
      setActualPaymentAmount(
        appliedCoupon.length
          ? appliedCoupon.map(item => {
              return (
                Amount +
                deliveryCharge +
                Math.round((Amount * serviceTax) / 100) -
                parseInt(item.coupon_value)
              );
            })
          : Amount +
              deliveryCharge +
              Math.round((Amount * serviceTax) / 100) -
              0,
      );
    }
  }, [appliedCoupon]);

  const placeOrder = () => {
    // console.log(' balanceWalletAmount ', balanceWalletAmount)
    // console.log('walletAmount ', walletAmount)
    const unsubscribe = NetInfo.addEventListener(internetState => {
      setplaceOrderBtn(true);
      if (internetState.isConnected === true) {
        var serviceTaxAmt = Math.round((Amount * serviceTax) / 100);

        var authAPIURL = API_BASE_URL + 'placeOrder.php';
        var header = {
          'Content-Type': 'application/json',
        };

        if (
          isWalletAmountApplied &&
          actualPaymentAmount == 0 &&
          balanceWalletAmount > 0
        ) {
          // for COD
          fetch(authAPIURL, {
            method: 'POST',
            headers: header,
            body: JSON.stringify({
              mobile: mobile,
              token: token,
              serviceTax: serviceTax,
              addressId: addressId,
              paymentMethodeId: 1,
              appliedCoupon: appliedCoupon,
              cartProductsJson: cartProductsJson,
              totalAmount: totalAmount,
              deliveryCharge: deliveryCharge,
              serviceTaxAmt: serviceTaxAmt,
              deliveryDate: deliveryDate,
              timeslot: timeslot,
              transactionId: null,

              walletAmount: walletAmount,
              balanceWalletAmount: balanceWalletAmount,
              isWalletAmountApplied: isWalletAmountApplied,
            }),
          })
            .then(response => response.json())
            .then(response => {
              ToastAndroid.show(response.msg + ' 🙏', ToastAndroid.SHORT);
              if (response.result == 'true') {
                dispatch(cartAction.emptyCart());
                dispatch(couponAction.emptyCoupon());
                navigation.navigate('ThankYou', {
                  screen: 'ThankYou',
                  params: {orderId: response.orderId},
                });
              }
              setplaceOrderBtn(false);
            })
            .catch(error => {
              setplaceOrderBtn(false);
              console.log(error);
            });
        } else {
          if (api_key != null) {
            var options = {
              description: title,
              image: BASE_URL + logo,
              currency: currency,
              key: api_key,
              amount: actualPaymentAmount * 100,
              name: name,
              prefill: {
                contact: mobile,
                name: name,
              },
              theme: {color: PRIMARY_COLOR},
            };
            RazorpayCheckout.open(options)
              .then(data => {
                fetch(authAPIURL, {
                  method: 'POST',
                  headers: header,
                  body: JSON.stringify({
                    mobile: mobile,
                    token: token,
                    serviceTax: serviceTax,
                    addressId: addressId,
                    paymentMethodeId: paymentMethodeId,
                    appliedCoupon: appliedCoupon,
                    cartProductsJson: cartProductsJson,
                    totalAmount: totalAmount,
                    deliveryCharge: deliveryCharge,
                    serviceTaxAmt: serviceTaxAmt,
                    deliveryDate: deliveryDate,
                    timeslot: timeslot,
                    transactionId: data.razorpay_payment_id,

                    walletAmount: walletAmount,
                    balanceWalletAmount: balanceWalletAmount,
                    isWalletAmountApplied: isWalletAmountApplied,
                  }),
                })
                  .then(response => response.json())
                  .then(response => {
                    ToastAndroid.show(response.msg, ToastAndroid.SHORT);
                    if (response.result == 'true') {
                      dispatch(cartAction.emptyCart());
                      dispatch(couponAction.emptyCoupon());
                      navigation.navigate('ThankYou', {
                        screen: 'ThankYou',
                        params: {orderId: response.orderId},
                      });
                    }
                    setplaceOrderBtn(false);
                  })
                  .catch(error => {
                    console.log(error);
                  });
              })
              .catch(err => {
                // handle failure
                setplaceOrderBtn(false);
                ToastAndroid.show(err.error.description, ToastAndroid.LONG);
              });
          } else {
            // for COD
            fetch(authAPIURL, {
              method: 'POST',
              headers: header,
              body: JSON.stringify({
                mobile: mobile,
                token: token,
                serviceTax: serviceTax,
                addressId: addressId,
                paymentMethodeId: paymentMethodeId,
                appliedCoupon: appliedCoupon,
                cartProductsJson: cartProductsJson,
                totalAmount: totalAmount,
                deliveryCharge: deliveryCharge,
                serviceTaxAmt: serviceTaxAmt,
                deliveryDate: deliveryDate,
                timeslot: timeslot,
                transactionId: null,

                walletAmount: walletAmount,
                balanceWalletAmount: balanceWalletAmount,
                isWalletAmountApplied: isWalletAmountApplied,
              }),
            })
              .then(response => response.json())
              .then(response => {
                ToastAndroid.show(response.msg + ' 🙏', ToastAndroid.SHORT);
                if (response.result == 'true') {
                  dispatch(cartAction.emptyCart());
                  dispatch(couponAction.emptyCoupon());
                  navigation.navigate('ThankYou', {
                    screen: 'ThankYou',
                    params: {orderId: response.orderId},
                  });
                }
                setplaceOrderBtn(false);
              })
              .catch(error => {
                setplaceOrderBtn(false);
                console.log(error);
              });
          }
        }
      } else {
        setplaceOrderBtn(false);
        ToastAndroid.show('Internet Connection Failed', ToastAndroid.SHORT);
      }
    });
    unsubscribe();
  };

  const Item = props => (
    <Card
      elevation={5}
      style={{
        marginVertical: 4,
        borderWidth: 1,
        overflow: 'hidden',
        shadowColor: PRIMARY_COLOR,
        shadowRadius: 10,
        shadowOpacity: 1,
        marginHorizontal: 5,
      }}>
      <List.Item
        key={props.product_type_price_id}
        keyExtractor={props.product_type_price_id}
        style={{padding: 0}}
        title={props.product_name}
        titleStyle={{fontSize: 12, fontWeight: 'bold'}}
        titleNumberOfLines={1}
        descriptionNumberOfLines={2}
        description={() => (
          <View style={{marginVertical: 8}}>
            <Text style={{fontSize: 13}} allowFontScaling={false}>
              <MaterialCommunityIcons
                name="currency-inr"
                style={{fontSize: 13}}
              />
              {props.productPrice} * {props.productQuantity} Item (
              {props.productVariation})
            </Text>
          </View>
        )}
        left={() => (
          <>
            {parseInt(props.discount) > 0 ? (
              <Text
                allowFontScaling={false}
                style={{
                  backgroundColor: 'green',
                  color: 'white',
                  width: 55,
                  borderBottomRightRadius: 50,
                  paddingLeft: 8,
                  fontSize: 10,
                  height: 15,
                  position: 'absolute',
                  // top: 3,
                  // left: 5,
                  zIndex: 999,
                }}>
                {props.discount}% Off
              </Text>
            ) : null}

            <Image
              source={{uri: props.product_img}}
              style={{width: 70, height: 70}}
            />
          </>
        )}
        right={() => (
          <View
            style={{
              justifyContent: 'center',
              alignSelf: 'center',
              marginRight: 10,
            }}>
            <Text style={{color: PRIMARY_COLOR}} allowFontScaling={false}>
              <MaterialCommunityIcons
                name="currency-inr"
                style={{fontSize: 16}}
              />
              {Math.ceil(
                (props.productPrice *
                  props.productQuantity *
                  (100 - props.discount)) /
                  100,
              )}
            </Text>
          </View>
        )}
      />
    </Card>
    
  ); 

  const renderItem = ({item}) =>(
    <Item
      product_type_price_id={item[0]}
      productPrice={item[1].productPrice}
      productVariation={item[1].productVariation}
      productQuantity={item[1].quantity}
      product_name={item[1].product_name} 
      brand_name={item[1].brand_name}
      product_img={item[1].product_img}
      discount={item[1].discount}
      popular={item[1].popular}
      category={item[1].category}
      subcategory={item[1].subcategory}
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
          <View style={{marginHorizontal: 10, marginVertical: 4}}>
            <FlatList
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
              data={cartProductsJson}
              renderItem={renderItem}
              keyExtractor={item => item[0]}
              key={item => item[0]}
              style={{marginBottom: 45}}
              ListHeaderComponent={
                <>
                  <View style={{marginHorizontal: 5}}>
                    <Subheading
                      style={{marginTop: 10, fontSize: 14, letterSpacing: 0}}
                      allowFontScaling={false}>
                      <MaterialCommunityIcons
                        name="clipboard-text"
                        style={{fontSize: 16}}
                      />{' '}
                      Billing Summery
                    </Subheading>
                    <Card elevation={5}>
                      <Card.Content>
                        <View style={{flex: 2, flexDirection: 'row'}}>
                          <View style={{flex: 1}}>
                            <Subheading
                              style={{fontSize: 14, letterSpacing: 0}}
                              allowFontScaling={false}>
                              Subtotal:
                            </Subheading>
                            <Subheading
                              style={{fontSize: 14, letterSpacing: 0}}
                              allowFontScaling={false}>
                              Delivery:
                            </Subheading>
                            <Subheading
                              style={{fontSize: 14, letterSpacing: 0}}
                              allowFontScaling={false}>
                              Service Tax: ({serviceTax} %)
                            </Subheading>
                            <Subheading
                              style={{fontSize: 14, letterSpacing: 0}}
                              allowFontScaling={false}>
                              Discount:
                            </Subheading>
                            <Subheading
                              style={{
                                color: PRIMARY_COLOR,
                                fontSize: 14,
                                letterSpacing: 0,
                              }}
                              allowFontScaling={false}>
                              Total:
                            </Subheading>
                          </View>
                          <View
                            style={{
                              flex: 1,
                              alignSelf: 'flex-end',
                              alignContent: 'flex-end',
                              alignItems: 'flex-end',
                            }}>
                            <Subheading
                              style={{fontSize: 14, letterSpacing: 0}}
                              allowFontScaling={false}>
                              <MaterialCommunityIcons
                                name="currency-inr"
                                style={{fontSize: 14, letterSpacing: 0}}
                              />
                              
                              {Amount}
                            </Subheading>
                            <Subheading
                              style={{fontSize: 14, letterSpacing: 0}}
                              allowFontScaling={false}>
                              <MaterialCommunityIcons
                                name="currency-inr"
                                style={{fontSize: 14, letterSpacing: 0}}
                              />
                              {deliveryCharge}
                            </Subheading>
                            <Subheading
                              style={{fontSize: 14, letterSpacing: 0}}
                              allowFontScaling={false}>
                              <MaterialCommunityIcons
                                name="currency-inr"
                                style={{fontSize: 14, letterSpacing: 0}}
                              />
                              {Math.round(
                                (Amount * serviceTax) / 100,
                              )}
                            </Subheading>
                            <Subheading
                              style={{fontSize: 14, letterSpacing: 0}}
                              allowFontScaling={false}>
                              {' '}
                              <MaterialCommunityIcons
                                name="currency-inr"
                                style={{fontSize: 14, letterSpacing: 0}}
                              />
                              {appliedCoupon.length
                                ? appliedCoupon.map(item => {
                                    return item.coupon_value;
                                  })
                                : 0}
                            </Subheading>
                            <Subheading
                              style={{
                                color: PRIMARY_COLOR,
                                fontSize: 14,
                                letterSpacing: 0,
                              }}
                              allowFontScaling={false}>
                              <MaterialCommunityIcons
                                name="currency-inr"
                                style={{
                                  fontSize: 14,
                                  letterSpacing: 0,
                                  color: PRIMARY_COLOR,
                                }}
                              />
                              {actualPaymentAmount}
                            </Subheading>
                          </View>
                        </View>
                      </Card.Content>
                    </Card>
                  </View>

                  <View
                    style={{
                      marginHorizontal: 5,
                      marginTop: 15,
                      flex: 2,
                      flexDirection: 'row',
                    }}>
                    <Subheading
                      style={{fontSize: 14, letterSpacing: 0}}
                      allowFontScaling={false}>
                      <MaterialCommunityIcons
                        name="sale"
                        style={{fontSize: 16}}
                      />{' '}
                      Apply Coupon
                    </Subheading>
                    <TouchableOpacity
                      style={{flex: 1, alignItems: 'flex-end'}}
                      onPress={() => {
                        navigation.navigate('Coupons');
                      }}>
                      <Text
                        style={{color: PRIMARY_COLOR}}
                        allowFontScaling={false}>
                        Click here
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View
                    style={{
                      marginHorizontal: 5,
                    }}>
                    {appliedCoupon.map(item => {
                      if (item.coupon_id) {
                        return (
                          <Card
                            elevation={5}
                            key={item.coupon_id}
                            keyExtractor={item.coupon_id}>
                            <Card.Content>
                              <View style={{flex: 7.5, flexDirection: 'row'}}>
                                <Text
                                  allowFontScaling={false}
                                  style={{
                                    color: 'green',
                                    flex: 7,
                                    alignContent: 'flex-start',
                                  }}>
                                  <Text style={{fontWeight: 'bold'}}>
                                    {item.coupon_code} applied
                                  </Text>
                                </Text>
                                <TouchableOpacity
                                  style={{
                                    flex: 0.5,
                                    alignItems: 'flex-end',
                                    alignContent: 'flex-end',
                                  }}
                                  onPress={() => {
                                    dispatch(
                                      couponAction.removeCoupon(item.coupon_id),
                                    );
                                  }}>
                                  <MaterialCommunityIcons
                                    allowFontScaling={false}
                                    name="do-not-disturb"
                                    style={{fontSize: 16, color: PRIMARY_COLOR}}
                                  />
                                </TouchableOpacity>
                              </View>
                            </Card.Content>
                          </Card>
                        );
                      }
                    })}
                  </View>

                  <View
                    style={{
                      marginHorizontal: 5,
                      marginTop: 15,
                      flex: 2,
                      flexDirection: 'row',
                    }}>
                    <Subheading
                      style={{fontSize: 14, letterSpacing: 0}}
                      allowFontScaling={false}>
                      <MaterialCommunityIcons
                        name="wallet"
                        style={{fontSize: 16}}
                      />{' '}
                      Wallet (Balance Amount : {balanceWalletAmount})
                    </Subheading>
                  </View>

                  <View
                    style={{
                      marginHorizontal: 5,
                    }}>
                    <Card elevation={5}>
                      <Card.Content>
                        <View style={{flex: 7.5, flexDirection: 'row'}}>
                          <Text
                            allowFontScaling={false}
                            style={{
                              color: 'green',
                              flex: 7,
                              alignContent: 'flex-start',
                            }}>
                            <Text style={{fontWeight: 'bold'}}>
                            Apply Wallet Amount
                              {/* <MaterialCommunityIcons
                                name="currency-inr"
                                style={{fontSize: 16}}
                              />{' '} */}
                             
                               {/* {walletAmount}{' '} */}
                              {/* {!isWalletAmountApplied ? 'applied' : null} */}
                            </Text>
                          </Text>
                          <TouchableOpacity
                            style={{
                              flex: 0.5,
                              alignItems: 'flex-end',
                              alignContent: 'flex-end',
                            }}
                            onPress={() => {
                              walletAmount == 0 ? ToastAndroid.show('Not Valid Wallet Amount', ToastAndroid.SHORT) : applyWalletAmount()
                              
                            }}>
                            <MaterialCommunityIcons
                              allowFontScaling={false}
                              name={applayWalletIcon}
                              style={{fontSize: 22, color: PRIMARY_COLOR}}
                            />
                          </TouchableOpacity>
                        </View>
                      </Card.Content>
                    </Card>
                  </View>

                  <View style={{marginHorizontal: 4, marginTop: 15}}>
                    <Subheading
                      style={{fontSize: 14, letterSpacing: 0}}
                      allowFontScaling={false}>
                      <MaterialCommunityIcons
                        name="currency-inr"
                        style={{fontSize: 16}}
                      />{' '}
                      Selected Payment Method
                    </Subheading>
                    <Card elevation={5}>
                      <List.Item
                        key={paymentMethodeId}
                        keyExtractor={paymentMethodeId}
                        title={paymentMethodeTitle}
                        titleNumberOfLines={1}
                        description={description}
                        descriptionNumberOfLines={2}
                        titleStyle={{fontSize: 14}}
                        allowFontScaling={false}
                        left={() => (
                          <Image
                            source={{
                              uri: paymentMethodeImg,
                            }}
                            style={{
                              width: 60,
                              height: 60,
                              resizeMode: 'contain',
                            }}
                          />
                        )}
                      />
                    </Card>
                  </View>

                  <Subheading
                    style={{
                      fontSize: 14,
                      letterSpacing: 0,
                      marginTop: 15,
                      marginHorizontal: 5,
                    }}
                    allowFontScaling={false}>
                    <MaterialCommunityIcons
                      name="cart"
                      style={{fontSize: 16}}
                    />{' '}
                    Items in cart
                  </Subheading>
                </>
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
              disabled={placeOrderBtn}
              onPress={() => {
                
                 isLoggedIn ? placeOrder() : navigation.navigate('Login');
              }}
              uppercase={false}>
              Place Order{' '}
              <MaterialCommunityIcons
                name="currency-inr"
                style={{fontSize: 16}}
              />
              {actualPaymentAmount}
            </Button>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default PlaceOrder;

const styles = StyleSheet.create({});
