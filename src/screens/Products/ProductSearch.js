import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  // Button,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  ToastAndroid,
  ProgressViewIOSBase,
} from 'react-native';
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
  Searchbar,
  TextInput,
} from 'react-native-paper';
// import Icon from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector, useDispatch} from 'react-redux';
import * as cartAction from '../../store/actions/CartAction';
import * as couponAction from '../../store/actions/CouponAction';

import NetworkError from '../Common/NetworkError';
import NetInfo from '@react-native-community/netinfo';
import { API_BASE_URL } from '../../constants/Url';
import {PRIMARY_COLOR} from '../../constants/Color';

const ProductSearch = ({navigation}) => {
  const auth_mobile = useSelector(state => state.AuthReducer.mobile);
  const token = useSelector(state => state.AuthReducer.token);
  const isLoggedIn = useSelector(state => state.AuthReducer.isLoggedIn);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [productList, setProductList] = useState([]);

  const [isProductAvailable, setIsProductAvailable] = useState(false);
  const [productMsg, setProductMsg] = useState('Search Product appere here');

  const [isInternetConnected, setIsInternetConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  const [togglePreviewScreen, setTogglePreviewScreen] = useState(true);

  const apiCall = () => {
    if (searchKeyword != undefined && searchKeyword.length > 2) {
      var authAPIURL =
        API_BASE_URL+'searchProduct.php';
      var header = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
      fetch(authAPIURL, {
        method: 'POST',
        headers: header,
        body: JSON.stringify({
          mobile: auth_mobile,
          token: token,
          searchKeyword: searchKeyword,
        }),
      })
        .then(response => response.json())
        .then(response => {
          if (response.data.length > 0) {
            setProductList(response.data);
            setIsProductAvailable(true);
          } else {
            setProductMsg(response.msg);
            setIsProductAvailable(false);
          }
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      setIsProductAvailable(false);
      setProductList([]);
    }
  };

  const reloadPage = () => {
    setIsInternetConnected(false);
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
    setIsInternetConnected(false);
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
  }, [searchKeyword]);

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

  const SearchProductList = props => {
    const [productCount, setProductCount] = useState(0);
    const dispatch = useDispatch();
    const productTypePriceId = props.product_type_price_id;

    var cartReadyItems = [];
    cartReadyItems.push(
      props.product_name,
      props.product_img,
      props.discount,
      props.popular,
      productTypePriceId,
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
                  style={{height: '100%', borderRadius: 10}}
                />
              </TouchableOpacity>
            </View>
            <View style={{marginLeft: 5}}>
              <Title style={{fontSize: 14}} allowFontScaling={false}>
                {props.product_name.length < 26
                  ? props.product_name
                  : props.product_name.substring(0, 23) + '...'}
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
                    {props.discount > 0
                      ? Math.ceil(
                          (props.productPrice * (100 - props.discount)) / 100,
                        )
                      : props.productPrice}
                  </Text>

                  {props.discount > 0 ? (
                    <Text
                      style={{fontSize: 11, color: PRIMARY_COLOR}}
                      allowFontScaling={false}>
                      {'   '}Save
                      <MaterialCommunityIcons
                        name="currency-inr"
                        style={{fontSize: 11}}
                      />
                      {props.productPrice -
                        Math.ceil(
                          (props.productPrice * (100 - props.discount)) / 100,
                        )}
                    </Text>
                  ) : null}
                </Subheading>
                {props.discount > 0 ? (
                  <Caption style={{letterSpacing: 0}} allowFontScaling={false}>
                    MRP :
                    <MaterialCommunityIcons
                      name="currency-inr"
                      style={{fontSize: 12}}
                    />
                    <Text>{props.productPrice}</Text>
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
                    paddingVertical: 5,
                    paddingHorizontal: 5,
                    flexDirection: 'row',
                  }}>
                  <Text
                    numberOfLines={1}
                    allowFontScaling={false}
                    style={{fontSize: 12}}>
                    {props.productVariation}
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
                          setProductCount(productCount - 1);
                        }}
                        compact="true"
                        mode="contained"
                        color={PRIMARY_COLOR}
                        style={{width: 30, marginLeft: 5}}
                        disabled={productCount > 0 ? false : true}
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
                        {parseInt(productCount)}
                      </Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                      <Button
                        allowFontScaling={false}
                        compact="true"
                        mode="contained"
                        color={PRIMARY_COLOR}
                        onPress={() => {
                          dispatch(cartAction.addToCart(cartReadyItems));
                          setProductCount(productCount + 1);
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
            </View>
          </View>
        </Card>
      </View>
    );
  };

  const sendEnquiry = () => {
    if (searchKeyword != '') {
      var authAPIURL =
        API_BASE_URL+'productEnquiry.php';
      var header = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
      fetch(authAPIURL, {
        method: 'POST',
        headers: header,
        body: JSON.stringify({
          mobile: auth_mobile,
          token: token,
          searchKeyword: searchKeyword,
        }),
      })
        .then(response => response.json())
        .then(response => {
          setSearchKeyword('');
          ToastAndroid.show(response.msg, ToastAndroid.LONG);
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      ToastAndroid.show('Enter proper Product name', ToastAndroid.LONG);
    }
  };

  const renderItem = ({item}) => (
    <SearchProductList
      product_id={item.product_id}
      product_name={item.product_name}
      product_img={item.product_img}
      discount={item.discount}
      pgms_pprice={item.pgms_pprice}
      popular={item.popular}
      product_type_price_id={item.product_type_price_id}
      productPrice={item.productPrice}
      productVariation={item.productVariation}
      gotoProductDetails={() => {
        navigation.navigate('ProductDetails', {
          screen: 'ProductDetails',
          product_id: item.product_id,
          product_name: item.product_name,
          product_img: item.product_img,
          discount: item.discount,
          pgms_pprice: item.pgms_pprice,
          popular: item.popular,
        });
      }}
    />
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={{marginHorizontal: 15, marginVertical: 5}}>
        <Searchbar
          allowFontScaling={false}
          placeholder="Search Product here..."
          theme={{colors: {primary: PRIMARY_COLOR}}}
          iconcolor={PRIMARY_COLOR}
          onChangeText={text => setSearchKeyword(text)}
          value={searchKeyword}
          onTouchStart={() => {
            setTogglePreviewScreen(false);
          }}
        />
      </View>
      <View style={{marginHorizontal: 10}}>
        {isProductAvailable ? (
          <FlatList
            data={productList}
            renderItem={renderItem}
            keyExtractor={item => item.product_type_price_id}
            key={item => item.product_type_price_id}
          />
        ) : togglePreviewScreen ? (
          <>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: Dimensions.get('window').width + 100,
              }}>
              <Image
                source={require('../../assets/image/product_search.png')}
                style={{width: 100, height: 100}}
              />
              <Subheading
                allowFontScaling={false}
                style={{
                  textAlign: 'center',
                  marginHorizontal: 60,
                  color: '#ccc',
                }}>
                {productMsg}
              </Subheading>
            </View>
          </>
        ) : null}
      </View>
      {isProductAvailable ? null : (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            position: 'absolute',
            bottom: 70,
            width: '100%',
          }}>
          <Subheading
            allowFontScaling={false}
            style={{
              textAlign: 'center',
              marginHorizontal: 60,
              color: '#ccc',
            }}>
            {`Can't find `}
            <Text
              style={{
                color: PRIMARY_COLOR,
              }}>
              {searchKeyword}
            </Text>
          </Subheading>
          <Button
            allowFontScaling={false}
            mode="text"
            theme={{colors: {primary: PRIMARY_COLOR}}}
            style={{backgroundColor: PRIMARY_COLOR}}
            labelStyle={{
              fontSize: 12,
              letterSpacing: 0,
              color: 'white',
            }}
            onPress={() => {
              isLoggedIn
                ? sendEnquiry()
                : ToastAndroid.show(
                    'Please Login to send Enquiry',
                    ToastAndroid.SHORT,
                  );
            }}
            uppercase={false}>
            Send Enquiry
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ProductSearch;