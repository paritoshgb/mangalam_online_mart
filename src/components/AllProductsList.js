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
} from 'react-native';
import {Card, Subheading, Title, Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Picker} from '@react-native-picker/picker';
import {useSelector, useDispatch} from 'react-redux';
import * as cartAction from '../store/actions/CartAction';
import * as couponAction from '../store/actions/CouponAction';
// import {useIsFocused} from '@react-navigation/native';
import {PRIMARY_COLOR} from '../constants/Color';

const AllProductsList = props => {
  // const cartProducts = useSelector(state => state.CartReducer.cartProducts);
  const [pgms, setPgms] = useState(props.pgms_pprice[0].product_type);
  const [pprice, setPprice] = useState(props.pgms_pprice[0].product_price);

  const [quntityBtn, setQuntityBtn] = useState(false);
  const [productTypePriceId, setProductTypePriceId] = useState(
    props.pgms_pprice[0].product_type_price_id,
  );

  const [productCount, setProductCount] = useState(0);
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
    );
    dispatch(cartAction.addToCart(cartReadyItems));
    setProductCount(parseInt(productCount) + 1);

  }, [productCount, dispatch]);

  const removeToCart = useCallback(() => {
    cartReadyItems.push(
      props.product_name,
      props.product_img,
      props.discount,
      props.popular,
      productTypePriceId,
    );
    dispatch(cartAction.removeToCart(cartReadyItems));
    dispatch(couponAction.emptyCoupon());
    setProductCount(parseInt(productCount) - 1);
  }, [productCount, dispatch]);

  return (
    <View
      key={productTypePriceId}
      style={{
        marginHorizontal:4,
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
              fontSize:12
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
            </View>
          </View>
        </Card.Content>
        <Card.Actions
          style={{marginHorizontal: 0, paddingHorizontal: 0, marginBottom: -8}}>
          {quntityBtn ? (
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
                <Icon style={{color: 'white'}} name="cart-outline" size={12} />
              </Button>
            </View>
          )}
        </Card.Actions>
      </Card>
    </View>
  );
};

export default AllProductsList;

const styles = StyleSheet.create({});
