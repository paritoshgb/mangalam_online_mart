import React, { useState, useEffect, useCallback } from 'react';
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
    Image,
    ToastAndroid
} from 'react-native';
import { Card, Subheading, Title, Button,Caption } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';
import { useSelector, useDispatch } from 'react-redux';
import * as cartAction from '../store/actions/CartAction';
import * as couponAction from '../store/actions/CouponAction';
// import {useIsFocused} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { PRIMARY_COLOR } from '../constants/Color';

const ComboOfferDeal = props => {

   // const cartProducts = useSelector(state => state.CartReducer.cartProducts);
 
  const [pgms, setPgms] = useState(props.pgms_pprice[0].product_type);
  const [pprice, setPprice] = useState(props.pgms_pprice[0].product_price);
  
  const [quntityBtn, setQuntityBtn] = useState(false);
  const [productTypePriceId, setProductTypePriceId] = useState(
    props.pgms_pprice[0].product_type_price_id,
  );

  const [productCount, setProductCount] = useState(1);
  const dispatch = useDispatch();

  var cartReadyItems = [];
  // console.log(cartProducts)
  const addToCart = useCallback(() => {
    cartReadyItems.push(
      props.product_name,
      props.product_img,
      props.discount,
      props.popular,
      productTypePriceId,
      props.combo_amount,
      props.combo
      
    );
    setProductCount(1);
    ToastAndroid.show('Item added', ToastAndroid.SHORT);
    dispatch(cartAction.addToCart(cartReadyItems));
  }, [productCount, dispatch]);
  

  const removeToCart = useCallback(() => {
    cartReadyItems.push(
      props.product_name,
      props.product_img,
      props.discount,
      props.popular,
      productTypePriceId,
      props.combo_amount,
      props.combo
 );
    dispatch(cartAction.removeToCart(cartReadyItems));
    dispatch(couponAction.emptyCoupon());
    setProductCount(parseInt(productCount) - 1);
  }, [productCount, dispatch]);

    return (
        <View style={{ marginBottom: 10, marginHorizontal: 5 }}>
            <Card
                style={{
                    height: Dimensions.get('window').height / 6.2,
                    elevation: 5,
                    borderRadius: 10,
                }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View
                        style={{
                            width: 100,
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
                            <Image
                                source={{
                                    uri: props.product_img,
                                }}
                                style={{ height: '100%', borderRadius: 10 }}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginLeft: 5 }}>
                        <Title style={{ fontSize: 14 }} allowFontScaling={false}>
                            {props.product_name.length < 26
                                ? props.product_name
                                : props.product_name.substring(0, 30) + '...'}
                        </Title>
                        <View
                            style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Subheading
                                style={{ fontSize: 14, letterSpacing: 0 }}
                                allowFontScaling={false}>
                                <MaterialCommunityIcons
                                    name="currency-inr"
                                    style={{ fontSize: 14 }}
                                    allowFontScaling={false}
                                />
                                <Text allowFontScaling={false}>
                                  {props.combo_amount}

                                    {/* {props.discount > 0
                                        ? Math.ceil(
                                            (pprice * (100 - props.discount)) / 100,
                                        )
                                        : pprice} */}
                                </Text>

                                {props.discount > 0 ? (
                                    <Text
                                        style={{ fontSize: 11, color: PRIMARY_COLOR }}
                                        allowFontScaling={false}>
                                        {'   '}Save
                                        <MaterialCommunityIcons
                                            name="currency-inr"
                                            style={{ fontSize: 11 }}
                                        />
                                        {pprice -
                                            Math.ceil(
                                                (pprice * (100 - props.discount)) / 100,
                                            )}
                                    </Text>
                                ) : null}
                            </Subheading>
                            {props.discount > 0 ? (
                                <Caption style={{ letterSpacing: 0 }} allowFontScaling={false}>
                                    MRP :
                                    <MaterialCommunityIcons
                                        name="currency-inr"
                                        style={{ fontSize: 12 }}
                                    />
                                    <Text>{pprice}
                                    
                                    </Text>
                                </Caption>
                            ) : null}
                        </View>

                        <View
                            style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
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
                                    style={{ fontSize: 12 }}>
                                    {pgms}
                                </Text>
                               
                                {/* <TouchableOpacity>
                  <Text>
                    <Icon name="ios-caret-forward-outline" />
                  </Text>
                </TouchableOpacity> */}
                            </View>
                            <View style={{ width: 100 }}>
                            {quntityBtn && productCount!=0 ? (
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
                     addToCart()
                   
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
                <Icon style={{color: 'white'}} name="cart-outline" size={12} />
              </Button>
            </View>
          )}
                            </View>
                        </View>
                    </View>
                </View>
            </Card>
        </View>
    );
};

export default ComboOfferDeal;

const styles = StyleSheet.create({});
