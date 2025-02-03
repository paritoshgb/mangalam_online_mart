import React, {useState, useCallback, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  Card,
  Title,
  Paragraph,
  List,
  Subheading,
  TouchableRipple,
  Button,
  Headline,
  Caption,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector, useDispatch} from 'react-redux';
import * as cartAction from '../store/actions/CartAction';
import * as couponAction from '../store/actions/CouponAction';
import {PRIMARY_COLOR} from '../constants/Color';

const DummyProductList = props => {
  const [productCount, setProductCount] = useState(0);
  const [quntityBtn, setQuntityBtn] = useState(false);
  const dispatch = useDispatch();
  let cartReadyItems = [];

  useEffect(() => {
    setProductCount(0);
    setQuntityBtn(false);
  }, [props]);

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
            {props.discount > 0 ? (
              <Text
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
                style={{height: '100%', borderRadius: 10}}
              />
            </TouchableOpacity>
          </View>
          <View style={{marginLeft: 5}}>
            <Title style={{fontSize: 16}}>
              {props.product_name.length < 28
                ? props.product_name
                : props.product_name.substring(0, 25) + '...'}
            </Title>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Subheading style={{fontSize: 14, letterSpacing: 0}}>
                <MaterialCommunityIcons
                  name="currency-inr"
                  style={{fontSize: 14}}
                />
                <Text>
                  {props.discount > 0
                    ? Math.ceil(
                        (props.pgms_pprice[0].product_price *
                          (100 - props.discount)) /
                          100,
                      )
                    : props.pgms_pprice[0].product_price}
                </Text>

                {props.discount > 0 ? (
                  <Text style={{fontSize: 11, color:PRIMARY_COLOR}}>
                    {'   '}Save
                    <MaterialCommunityIcons
                      name="currency-inr"
                      style={{fontSize: 11}}
                    />
                    {props.pgms_pprice[0].product_price - Math.ceil(
                        (props.pgms_pprice[0].product_price *
                          (100 - props.discount)) /
                          100,
                      )}
                  </Text>
                ) : null}
              </Subheading>
              {props.discount > 0 ? (
                <Caption style={{letterSpacing: 0}}>
                  MRP :
                  <MaterialCommunityIcons
                    name="currency-inr"
                    style={{fontSize: 12}}
                  />
                  <Text>{props.pgms_pprice[0].product_price}</Text>
                </Caption>
              ) : null}
            </View>

            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View
                style={{
                  borderRadius: 5,
                  borderWidth: 1,
                  width: 100,
                  marginRight: 5,
                  borderColor: 'gray',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 5,
                  flexDirection: 'row',
                }}>
                <Text>{props.pgms_pprice[0].product_type}</Text>
                {/* <TouchableOpacity>
                  <Text>
                    <Icon name="ios-caret-forward-outline" />
                  </Text>
                </TouchableOpacity> */}
              </View>
              <View style={{width: 100}}>
                {quntityBtn ? (
                  <View
                    style={{flex: 3, flexDirection: 'row', marginBottom: -10}}>
                    <View style={{flex: 1, alignSelf: 'flex-start'}}>
                      <Button
                        onPress={() => {
                          // removeToCart();
                          cartReadyItems.push(
                            props.product_name,
                            props.product_img,
                            props.discount,
                            props.popular,
                            props.pgms_pprice[0].product_type_price_id,
                          );
                          dispatch(cartAction.removeToCart(cartReadyItems));
                          dispatch(couponAction.emptyCoupon());
                          setProductCount(parseInt(productCount) - 1);
                        }}
                        compact="true"
                        mode="contained"
                        size={20}
                        color={PRIMARY_COLOR}
                        style={{width: 30, marginLeft: 5}}
                        disabled={productCount > 0 ? false : true}
                        labelStyle={{
                          color: 'white',
                          marginVertical: 6,
                          fontSize: 14,
                        }}>
                        -
                      </Button>
                    </View>
                    <View
                      style={{
                        alignItems: 'center',
                      }}>
                      <Text style={{marginVertical: 5}}>
                        {parseInt(productCount)}
                      </Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                      <Button
                        compact="true"
                        mode="contained"
                        size={20}
                        color={PRIMARY_COLOR}
                        onPress={() => {
                          cartReadyItems.push(
                            props.product_name,
                            props.product_img,
                            props.discount,
                            props.popular,
                            props.pgms_pprice[0].product_type_price_id,
                          );
                          dispatch(cartAction.addToCart(cartReadyItems));
                          setProductCount(parseInt(productCount) + 1);
                        }}
                        style={{width: 30, marginRight: 5}}
                        labelStyle={{
                          color: 'white',
                          marginVertical: 6,
                          fontSize: 14,
                        }}>
                        +
                      </Button>
                    </View>
                  </View>
                ) : (
                  <Button
                    compact="true"
                    mode="contained"
                    size={10}
                    color={PRIMARY_COLOR}
                    uppercase={false}
                    // style={{marginHorizontal: 90}}
                    onPress={() => {
                      cartReadyItems.push(
                        props.product_name,
                        props.product_img,
                        props.discount,
                        props.popular,
                        props.pgms_pprice[0].product_type_price_id,
                      );
                      dispatch(cartAction.addToCart(cartReadyItems));
                      setProductCount(parseInt(productCount) + 1);

                      setQuntityBtn(true);
                    }}
                    labelStyle={{
                      color: 'white',
                      marginVertical: 6,
                      fontSize: 14,
                    }}>
                    <Icon
                      style={{color: 'white', marginHorizontal: 10}}
                      name="cart-outline"
                      size={15}
                    />
                    Add
                  </Button>
                )}
              </View>
            </View>
          </View>
        </View>
      </Card>
    </View>
  );
};

export default DummyProductList;

const styles = StyleSheet.create({});
