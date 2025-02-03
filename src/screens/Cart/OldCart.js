import React, {useEffect, useState} from 'react';
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
} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Ionicons';
// import {Picker} from '@react-native-community/picker';
import {useSelector, useDispatch} from 'react-redux';
import CartList from '../../components/CartList';
import {useIsFocused} from '@react-navigation/native';

import NetworkError from '../Common/NetworkError';
import NetInfo from '@react-native-community/netinfo';

import * as cartAction from '../../store/actions/CartAction';
import * as OrderSettingAction from '../../store/actions/OrderSettingAction';
import {API_BASE_URL} from '../../constants/Url';
import {PRIMARY_COLOR} from '../../constants/Color';

const Cart = ({navigation}) => {
  const dispatch = useDispatch();
  const cartProducts = useSelector(state => state.CartReducer.cartProducts);
  const totalAmount = useSelector(state => state.CartReducer.totalAmount);
  const {name, mobile, isLoggedIn, token} = useSelector(
    state => state.AuthReducer,
  );
  const minOrderAmt = useSelector(
    state => state.OrderSettingReducer.minOrderAmt,
  );

  const [statePlaceOrderBtn, setStatePlaceOrderBtn] = useState(false);
  const [minOrderMsg, setMinOrderMsg] = useState('');
  const isVisible = useIsFocused();
  var result = [];
  const [cartProductsJson, setCartProductsJson] = useState([]);
  const [itemCount, setItemCount] = useState(cartProductsJson.length);

  const [isInternetConnected, setIsInternetConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  var totalDiscounPrice = 0;
  for (var i in cartProducts) {
    totalDiscounPrice =
    totalDiscounPrice +
    Math.ceil(
      (parseInt(cartProducts[i].quantity) *
        parseInt(cartProducts[i].productPrice) *
        (100 - parseInt(cartProducts[i].discount))) /
        100,
    );
    result.push([i, cartProducts[i]]);
    // var authAPIURL = API_BASE_URL + 'checkCartProductInStock.php';
    // var header = {
    //   'Content-Type': 'application/json',
    // };
    // fetch(authAPIURL, {
    //   method: 'POST',
    //   headers: header,
    //   body: JSON.stringify({
    //     productTypePriceId:cartProducts[i].productTypePriceId
    //   }),
    // })
    //   .then(response => response.json())
    //   .then(response => {
    //     if (response.result == 'true'){
    //       totalDiscounPrice =
    //         totalDiscounPrice +
    //         Math.ceil(
    //           (parseInt(cartProducts[i].quantity) *
    //             parseInt(cartProducts[i].productPrice) *
    //             (100 - parseInt(cartProducts[i].discount))) /
    //             100,
    //         );
    //       result.push([i, cartProducts[i]]);
    //     }else{

    //     }
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
  }

  function handleBackButtonClick() {
    // console.log('back button');
    setCartProductsJson([]);
    setItemCount();
    navigation.goBack();
    return true;
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
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
      });
  };

  React.useEffect(() => {
    setTimeout(() => {
      setItemCount();
      setCartProductsJson([]);
      setCartProductsJson(result);
      setItemCount(result.length);
      BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    });
  }, [isVisible, totalAmount]);

  useEffect(() => {
    setIsInternetConnected(false);
    setStatePlaceOrderBtn(true);
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
  }, [isVisible, totalAmount]);

  const reloadPage = () => {
    setLoading(true);
    setStatePlaceOrderBtn(false);
    setIsInternetConnected(false);
    const unsubscribe = NetInfo.addEventListener(internetState => {
      if (internetState.isConnected === true) {
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

  const renderItem = ({item}) => (
    <CartList
      product_type_price_id={item[0]}
      productPrice={item[1].productPrice}
      productVariation={item[1].productVariation}
      productQuantity={item[1].quantity}
      product_name={item[1].product_name}
      product_img={item[1].product_img}
      discount={item[1].discount}
      popular={item[1].popular}
    />
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        </View>
      ) : (
        <View style={{marginHorizontal: 5, marginTop: 5}}>
          {cartProductsJson.length ? (
            <FlatList
              data={cartProductsJson}
              renderItem={renderItem}
              keyExtractor={item => item[0]}
              showsVerticalScrollIndicator={false}
              style={{marginBottom: 50}}
            />
          ) : loading ? null : (
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
          )}
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
                dispatch(cartAction.emptyCart()),
                  ToastAndroid.show(
                    'Cart has been cleared',
                    ToastAndroid.SHORT,
                  );
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
                {totalDiscounPrice}
              </Text>
              {totalAmount > totalDiscounPrice ? (
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
                  {totalAmount}
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
                  ? totalAmount >= minOrderAmt
                    ? navigation.navigate('PlaceOrderStepOne')
                    : ToastAndroid.show(minOrderMsg, ToastAndroid.SHORT)
                  : navigation.navigate('Login');
              }}
              uppercase={false}>
              Looks Good, Keep Going
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Cart;

const styles = StyleSheet.create({});
