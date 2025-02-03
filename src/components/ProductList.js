import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  FlatList,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
  ToastAndroid,
} from 'react-native';
import {Card, Subheading, Title, Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Picker} from '@react-native-picker/picker';
import {useSelector, useDispatch} from 'react-redux';
import * as cartAction from '../store/actions/CartAction';
import * as couponAction from '../store/actions/CouponAction';
// import {useIsFocused} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {PRIMARY_COLOR} from '../constants/Color';
import DeviceInfo from 'react-native-device-info';
import {API_BASE_URL} from '../constants/Url';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';

const ProductList = props => {
  // const cartProducts = useSelector(state => state.CartReducer.cartProducts);
  const [pgms, setPgms] = useState(props.pgms_pprice[0].product_type);
  const [pprice, setPprice] = useState(props.pgms_pprice[0].product_price);
  const [deviceId, setDeviceid] = useState('');
  const isVisible = useIsFocused();

  const [quntityBtn, setQuntityBtn] = useState(false);
  const [productTypePriceId, setProductTypePriceId] = useState(
    props.pgms_pprice[0].product_type_price_id,
  );

  const [productCount, setProductCount] = useState(0);

  const [temQty, setTemQty] = useState(
    parseInt(props.quantity) + parseInt(productCount),
  );
  const dispatch = useDispatch();

  // useEffect(
  //  Temp(productTypePriceId)
  // );

  const getDeviceId = () => {
    var deviceid = DeviceInfo.getAndroidId();
    setDeviceid(deviceid);
  };

  useFocusEffect(
    React.useCallback(() => {
      getDeviceId();
      setProductCount(0);
      setTemQty(parseInt(props.quantity) + parseInt(productCount));
      setProductTypePriceId(props.pgms_pprice[0].product_type_price_id);
      // console.log('qqqqq',props.quantity)

      if (props.quantity > 0) {
        setQuntityBtn(true);
      }
    }, [isVisible, props]),
  );

  //  console.log('pppppp',props.quantity)

  const ProductMaintainApi = item => {
    // setLoading(true);
    var authAPIURL = API_BASE_URL + 'addcartProduct.php';
    var header = {
      'Content-Type': 'application/json',
    };
    var Qty = Number(temQty) + 1;
    // console.log('QTY', Qty);
    fetch(authAPIURL, {
      method: 'POST',
      headers: header,
      body: JSON.stringify({
        productTypePriceId: productTypePriceId,
        product_id: props.product_id,
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
    var Qty = Number(temQty) - 1;
    // console.log('QTY', Qty);

    // if (Qty == 0) {

    //   dispatch(cartAction.deleteItem(item.productTypePriceId));

    // }
    // console.log('ITEM', item);

    fetch(authAPIURL, {
      method: 'POST',
      headers: header,
      body: JSON.stringify({
        productTypePriceId: productTypePriceId,
        product_id: props.product_id,
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
      })
      .catch(error => {
        console.log(error);
      });
  };

  var cartReadyItems = [];
  // console.log(cartProducts)
  const addToCart = useCallback(() => {
    cartReadyItems.push(
      props.product_name,
      props.product_img,
      props.discount,
      props.popular,
      productTypePriceId,
    );
    dispatch(cartAction.addToCart(cartReadyItems));
    setProductCount(parseInt(temQty) + 1);
    setTemQty(parseInt(temQty) + 1);
  }, [productCount, temQty, dispatch]);

  const removeToCart = useCallback(() => {
    cartReadyItems.push(
      props.product_name,
      props.product_img,
      props.discount,
      props.popular,
      productTypePriceId,
      props.combo_amount,
      props.combo,
    );
    dispatch(cartAction.removeToCart(cartReadyItems));
    dispatch(couponAction.emptyCoupon());
    setProductCount(parseInt(temQty) - 1);
    setTemQty(parseInt(temQty) - 1);
  }, [productCount, temQty, dispatch]);

  return (
    <View
      key={productTypePriceId}
      style={{
        marginRight: 10,
        marginLeft: 5,
        marginVertical: 10,
        width: Dimensions.get('window').width / 3.3,
      }}>
      <Card
        style={{
          elevation: 5,
          borderRadius: 10,
        }}>
        {props.discount > 0 ? (
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
            {props.discount}% Off
          </Text>
        ) : null}

        {props.popular == 1 ? (
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

        <TouchableOpacity onPress={() => props.gotoProductDetails()}>
          <Card.Cover
            style={{height: 100, margin: 0, padding: 0, borderRadius: 10}}
            source={{uri: props.product_img}}
          />
        </TouchableOpacity>
        <Card.Content style={{paddingHorizontal: 0}}>
          <Title
            allowFontScaling={false}
            numberOfLines={2}
            style={{
              fontSize: 14,
              marginVertical: 0,
              marginHorizontal: 2,
              textAlign: 'center',
              height: 35,
              textAlignVertical: 'center',
              lineHeight: 16,
            }}>
            {props.product_name.length < 28
              ? props.product_name
              : props.product_name.substring(0, 25) + '...'}
          </Title>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <View style={{flex: 1}}>
              {props.discount > 0 ? (
                <Title
                  numberOfLines={1}
                  allowFontScaling={false}
                  adjustsFontSizeToFit
                  style={{
                    fontSize: 12,
                    alignSelf: 'center',

                    textDecorationLine: 'line-through',
                  }}>
                  <MaterialCommunityIcons
                    name="currency-inr"
                    style={{fontSize: 12}}
                  />
                  {pprice}
                </Title>
              ) : (
                <Title
                  numberOfLines={1}
                  allowFontScaling={false}
                  adjustsFontSizeToFit
                  style={{
                    fontSize: 12,
                    alignSelf: 'center',
                  }}>
                  <MaterialCommunityIcons
                    name="currency-inr"
                    style={{fontSize: 12}}
                  />

                  {pprice}
                </Title>
              )}
            </View>

            {/* <View
              style={{
                flex: 1,
                marginTop: -10,
                alignContent: 'center',
                alignSelf: 'center',
              }}>
              <Picker
                selectedValue={pgms}
                mode="dropdown"
                onValueChange={(itemValue, itemIndex) => {
                  let myArr = itemValue.split('_');
                  var product_id = parseInt(myArr[0]);
                  setPgms(myArr[1]);
                  setPprice(myArr[2]);
                  setProductTypePriceId(itemValue);
                  setProductCount(0);
                }}>
                <Picker.Item label="Selelct Variation" enabled={false} />
                {props.pgms_pprice.map(data => {
                  return (
                    <Picker.Item
                      label={
                        data.product_type + ' -----> Rs. ' + data.product_price
                      }
                      value={data.product_type_price_id}
                      key={data.product_type_price_id}
                    />
                  );
                })}
              </Picker>
            </View> */}

            <View style={{flex: 1}}>
              {props.discount > 0 ? (
                <Title
                  numberOfLines={1}
                  allowFontScaling={false}
                  adjustsFontSizeToFit
                  style={{
                    fontSize: 12,
                    alignSelf: 'center',
                    color: '#118505',
                  }}>
                  <MaterialCommunityIcons
                    name="currency-inr"
                    style={{fontSize: 12, color: '#118505'}}
                  />
                  {(pprice * (100 - props.discount)) / 100}
                </Title>
              ) : (
                <Title
                  numberOfLines={1}
                  allowFontScaling={false}
                  adjustsFontSizeToFit
                  style={{
                    fontSize: 12,
                    alignSelf: 'center',
                  }}>
                  {pgms.length < 8 ? pgms : pgms.substring(0, 8)}
                </Title>
              )}
            </View>
          </View>
        </Card.Content>
        {props.stock == 1 ? (
          <Card.Actions
            style={{
              marginHorizontal: 0,
              paddingHorizontal: 0,
              marginBottom: -8,
            }}>
            {quntityBtn && temQty != 0 ? (
              <View style={{flex: 3, flexDirection: 'row'}}>
                <View style={{flex: 1, alignSelf: 'flex-start'}}>
                  <Button
                    onPress={() => {
                      removeToCart();
                      ProductMaintainApi2(props);
                    }}
                    compact="true"
                    mode="contained"
                    color={PRIMARY_COLOR}
                    style={{width: 30, borderBottomLeftRadius: 10}}
                    disabled={temQty > 0 ? false : true}
                    labelStyle={{
                      color: 'white',
                      marginVertical: 6,
                      fontSize: 12,
                    }}>
                    -
                  </Button>
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    alignSelf: 'center',
                    fontSize: 10,
                  }}
                  allowFontScaling={false}>
                  {/* {props.quantity !=0 ? <Text>{props.quantity}</Text>: <Text>{parseInt(productCount)}</Text>} */}
                  <Text>{temQty}</Text>
                </View>
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                  <Button
                    compact="true"
                    mode="contained"
                    color={PRIMARY_COLOR}
                    onPress={() => {
                      addToCart();
                      ProductMaintainApi(props);
                    }}
                    style={{width: 30, borderBottomRightRadius: 10}}
                    labelStyle={{
                      color: 'white',
                      marginVertical: 6,
                      fontSize: 12,
                    }}>
                    +
                  </Button>
                </View>
              </View>
            ) : (
              <View style={{width: '100%'}}>
                <Button
                  allowFontScaling={false}
                  compact="true"
                  mode="contained"
                  // size={10}
                  color={PRIMARY_COLOR}
                  onPress={() => {
                    addToCart();
                    ProductMaintainApi(props);
                    ToastAndroid.show('Item added', ToastAndroid.SHORT);
                    setQuntityBtn(true);
                  }}
                  style={{
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                  }}
                  uppercase={false}
                  labelStyle={{
                    color: 'white',
                    marginVertical: 6,
                    fontSize: 12,
                  }}>
                  Add{' '}
                  <Icon
                    style={{color: 'white'}}
                    name="cart-outline"
                    size={12}
                  />
                </Button>
              </View>
            )}
          </Card.Actions>
        ) : (
          <Card.Actions
            style={{
              marginHorizontal: 0,
              paddingHorizontal: 0,
              marginBottom: -8,
            }}>
            <View style={{width: '100%'}}>
              <Button
                allowFontScaling={false}
                compact="true"
                mode="contained"
                // size={10}
                color={PRIMARY_COLOR}
                onPress={() => {
                  ToastAndroid.show('Item Out Of Stock', ToastAndroid.SHORT);
                  // setQuntityBtn(true);
                }}
                style={{
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                }}
                uppercase={false}
                labelStyle={{
                  color: 'white',
                  marginVertical: 6,
                  fontSize: 12,
                }}>
                Out Of Stock{' '}
                {/* <Icon style={{color: 'white'}} name="cart-outline" size={12} /> */}
              </Button>
            </View>
          </Card.Actions>
        )}
        {/* <Card.Actions
            style={{
              marginHorizontal: 0,
              paddingHorizontal: 0,
              marginBottom: -8,
            }}>
            {quntityBtn && productCount != 0 ? (
              <View style={{flex: 3, flexDirection: 'row'}}>
                <View style={{flex: 1, alignSelf: 'flex-start'}}>
                  <Button
                    onPress={() => {
                      removeToCart();
                    }}
                    compact="true"
                    mode="contained"
                    color={PRIMARY_COLOR}
                    style={{width: 30, borderBottomLeftRadius: 10}}
                    disabled={productCount > 0 ? false : true}
                    labelStyle={{
                      color: 'white',
                      marginVertical: 6,
                      fontSize: 12,
                    }}>
                    -
                  </Button>
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    alignSelf: 'center',
                    fontSize: 10,
                  }}
                  allowFontScaling={false}>
                  <Text>{parseInt(productCount)}</Text>
                </View>
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                  <Button
                    compact="true"
                    mode="contained"
                    color={PRIMARY_COLOR}
                    onPress={() => {
                      addToCart();
                    }}
                    style={{width: 30, borderBottomRightRadius: 10}}
                    labelStyle={{
                      color: 'white',
                      marginVertical: 6,
                      fontSize: 12,
                    }}>
                    +
                  </Button>
                </View>
              </View>
            ) : (
              <View style={{width: '100%'}}>
                <Button
                  allowFontScaling={false}
                  compact="true"
                  mode="contained"
                  // size={10}
                  color={PRIMARY_COLOR}
                  onPress={() => {
                    addToCart();
                    ToastAndroid.show('Item added', ToastAndroid.SHORT);
                    setQuntityBtn(true);
                  }}
                  style={{
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                  }}
                  uppercase={false}
                  labelStyle={{
                    color: 'white',
                    marginVertical: 6,
                    fontSize: 12,
                  }}>
                  Add{' '}
                  <Icon
                    style={{color: 'white'}}
                    name="cart-outline"
                    size={12}
                  />
                </Button>
              </View>
            )}
          </Card.Actions> */}
      </Card>
    </View>
  );
};

export default ProductList;

const styles = StyleSheet.create({});
