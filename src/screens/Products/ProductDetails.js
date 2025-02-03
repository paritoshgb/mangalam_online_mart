import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  // Text,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler,
  FlatList,
  ToastAndroid,
} from 'react-native';
import { SliderBox } from 'react-native-image-slider-box';
import {
  Card,
  Title,
  Paragraph,
  Caption,
  Subheading,
  Text,
  Button,
  Chip,
  Divider,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import NetInfo from '@react-native-community/netinfo';
import { useIsFocused,useFocusEffect } from '@react-navigation/native';

import { Picker } from '@react-native-picker/picker';
import { useSelector, useDispatch } from 'react-redux';
import * as cartAction from '../../store/actions/CartAction';

import BottomSheet from 'reanimated-bottom-sheet';
import { API_BASE_URL } from '../../constants/Url';
import { PRIMARY_COLOR } from '../../constants/Color';

import NetworkError from '../Common/NetworkError';

const ProductDetails = ({ route, navigation }) => {
  const sheetRef = React.useRef(null);

  const isVisible = useIsFocused();
  const auth_mobile = useSelector(state => state.AuthReducer.mobile);
  const token = useSelector(state => state.AuthReducer.token);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
     navigation.goBack()
        return true;
      };
       BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
       BackHandler.removeEventListener('hardwareBackPress', onBackPress);
   }, []),
  );

  const dispatch = useDispatch();
  const {
    product_id,
    product_name,
    product_img,
    discount,
    pgms_pprice,
    popular,
  } = route.params;

  const [pgms, setPgms] = useState(pgms_pprice[0].product_type);
  const [pprice, setPprice] = useState(pgms_pprice[0].product_price);
  const [productTypePriceId, setProductTypePriceId] = useState(
    pgms_pprice[0].product_type_price_id,
  );
   const[stock,setStock]=useState('')
  const [productCount, setProductCount] = useState(1);
  const [productVariation, setProductVariation] = useState([]);
  const [bannerImage, setBannerImage] = useState([product_img]);
  const [category, setCategory] = useState('');
  const [subcategory, setSubCategory] = useState('');
  const [product_description, setProductDescription] = useState('');
  const [brand_name, setBrandName] = useState('');
  const [isInternetConnected, setIsInternetConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  var cartReadyItems = [];

  cartReadyItems.push(
    product_name,
    product_img,
    discount,
    popular,
    productTypePriceId,
    productCount,
  );

  // function handleBackButtonClick() {
  //   navigation.reset({
  //     index: 0,
  //     routes: [{name: 'Home'}],
  //     params: {product_id: null},
  //   });
  //   return true;
  // }

  const apiCall = () => {
    setLoading(true);
    var authAPIURL = API_BASE_URL + 'fetchPrductDetails.php';
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
        product_id: product_id,
      }),
    })
      .then(response => response.json())
      .then(response => {
        setProductVariation(response.pgms_pprice);
       console.log("productDeatails",response)
        setBannerImage(prevArray => [
          ...prevArray,
          response.banner_img[0].banner_img_1,
        ]);
        setBannerImage(prevArray => [
          ...prevArray,
          response.banner_img[1].banner_img_2,
        ]);
        setBannerImage(prevArray => [
          ...prevArray,
          response.banner_img[2].banner_img_3,
        ]);

        setCategory(response.category);
        setSubCategory(response.subcategory);
        setStock(response.stock)
        setProductDescription(response.product_description);
        setBrandName(response.brand_name);

        setLoading(false);
      })
      .catch(error => {
        console.log(error);
      });
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
  }, [route.params.product_name]);

  useEffect(() => {
    setTimeout(() => {
      setProductCount(1);
      // BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    });
  }, [isVisible]);

  const renderContent = () => (
    <>
      <View style={styles.panel}>
        <View style={styles.header}>
          <View style={styles.panelHeader}>
            <View style={styles.panelHandle} />
          </View>
        </View>
       
        <View
          style={{
            marginVertical: 5,
            flexDirection: 'row',
            justifyContent: 'space-between',
            
            
          }}>
          <Chip
            style={{
              flex: 2,
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 15,
            }}
            onPress={() => {
              setProductCount(1), sheetRef.current.snapTo(2);
            }}>
            1
          </Chip>
          <Chip
            style={{
              flex: 2,
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 15,
            }}
            onPress={() => {
              setProductCount(2), sheetRef.current.snapTo(2);
            }}>
            2
          </Chip>
          <Chip
            style={{
              flex: 2,
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 15,
            }}
            onPress={() => {
              setProductCount(3), sheetRef.current.snapTo(2);
            }}>
            3
          </Chip>
          <Chip
            style={{
              flex: 2,
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 15,
            }}
            onPress={() => {
              setProductCount(4), sheetRef.current.snapTo(2);
            }}>
            4
          </Chip>
          <Chip
            style={{
              flex: 2,
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 15,
            }}
            onPress={() => {
              setProductCount(5), sheetRef.current.snapTo(2);
            }}>
            5
          </Chip>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Chip
            onPress={() => {
              setProductCount(6), sheetRef.current.snapTo(2);
            }}
            style={{
              flex: 2,
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 15,
            }}>
            6
          </Chip>
          <Chip
            onPress={() => {
              setProductCount(7), sheetRef.current.snapTo(2);
            }}
            style={{
              flex: 2,
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 15,
            }}>
            7
          </Chip>
          <Chip
            onPress={() => {
              setProductCount(8), sheetRef.current.snapTo(2);
            }}
            style={{
              flex: 2,
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 15,
            }}>
            8
          </Chip>
          <Chip
            onPress={() => {
              setProductCount(9), sheetRef.current.snapTo(2);
            }}
            style={{
              flex: 2,
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 15,
            }}>
            9
          </Chip>
          <Chip
            onPress={() => {
              setProductCount(10), sheetRef.current.snapTo(2);
            }}
            style={{
              flex: 2,
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 15,
            }}>
            10
          </Chip>
        </View>
        <View style={{ marginVertical: 5 }}>
          <Button
            mode="flat"
            color="#231F20"
            onPress={() => sheetRef.current.snapTo(2)}>
            Cancel
          </Button>
        </View>
        </View>
    
    </>
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
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        </View>
      ) : (
        <>
          <ScrollView>
            <View style={{ flexDirection: 'row' }}>
              <SliderBox
                images={bannerImage}
                sliderBoxHeight={300}
                // onCurrentImagePressed={index =>
                // console.warn(`image ${index} pressed`)
                // }
                disableOnPress={true}
                autoplay={true}
                dotcolor={PRIMARY_COLOR}
                inactiveDotColor="#90A4AE"
                resizeMethod={'resize'}
                resizeMode={'contain'}
                imageLoadingcolor={PRIMARY_COLOR}
              />
            </View>
            {discount > 0 ? (
              <Text
                allowFontScaling={false}
                style={{
                  backgroundColor: 'green',
                  color: 'white',
                  width: 65,
                  borderRadius: 50,
                  paddingLeft: 8,
                  position: 'absolute',
                  top: 5,
                  left: 10,
                  zIndex: 999,
                }}>
                {discount}% Off
              </Text>
            ) : null}

            <View>
              <Card style={{ borderColor: '#fff' }}>
                <Card.Content>
                  <View >
                    <Title  allowFontScaling={false}>{product_name}</Title>
                  </View>
                  <Caption style={{color:'#b23820'}} allowFontScaling={false}>
                    {category} <Icon name="caret-forward" /> {subcategory}
                  </Caption>

                  <View style={{ flex: 2, flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                      <Subheading
                        style={{ marginTop: 15, lineHeight: 25 }}
                        allowFontScaling={false}>
                        Product Price :{' '}
                        {discount > 0 ? (
                          <>
                            <MaterialCommunityIcons
                              name="currency-inr"
                              style={{ fontSize: 14 }}
                              allowFontScaling={false}
                            />
                            <Text
                              style={{ textDecorationLine: 'line-through' }}
                              allowFontScaling={false}>
                              {pprice}
                            </Text>
                          </>
                        ) : (
                          <Text allowFontScaling={false}>
                            <MaterialCommunityIcons
                              allowFontScaling={false}
                              name="currency-inr"
                              style={{ fontSize: 14 }}
                            />
                            {pprice}
                          </Text>
                        )}
                      </Subheading>
                      {discount > 0 ? (
                        <Subheading
                          style={{ marginTop: 15, lineHeight: 15 }}
                          allowFontScaling={false}>
                          Selling Price :{' '}
                          <MaterialCommunityIcons
                            name="currency-inr"
                            style={{ fontSize: 14, color: '#44bd32' }}
                          />
                          <Text allowFontScaling={false} style={{ fontSize: 15, color: '#44bd32' }}>
                            {(pprice * (100 - discount)) / 100}
                          </Text>
                        </Subheading>
                      ) : null}
                      <Caption
                        style={{ marginBottom: 10 }}
                        allowFontScaling={false}>
                        (Inclisive of all taxes)
                      </Caption>
                    </View>
                    </View>

                  <Divider style={{ marginTop: 5 }} />
                  <Subheading style={{ marginTop: 15 }} allowFontScaling={false}>
                    Units 
                  </Subheading>
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      marginBottom: 10,
                    }}>
                    {productVariation.map((item, ids) => {
                      return (
                        <Chip
                          allowFontScaling={false}
                          textStyle={{ fontSize: 12,color:pgms == item.product_type ?'#fff':'#000' }}
                          key={ids}
                          style={{ marginRight: 10,borderColor:pgms == item.product_type ?'green':'#b23820',borderWidth:1,backgroundColor:pgms == item.product_type ?'green':'#fff' }}
                          mode="outlined"
                          onPress={() => {
                            setPprice(item.product_price), setProductCount(1);
                            setProductTypePriceId(item.product_type_price_id);
                            setPgms(item.product_type);
                          }}
                          selected={pgms == item.product_type ? true : false}
                          selectedcolor={PRIMARY_COLOR}>
                          {item.product_type}
                        </Chip>
                      );
                    })}
                  </View>
                  <Divider />
                  <Subheading style={{ marginTop: 15 }} allowFontScaling={false}>
                    Description
                  </Subheading>
                  <Caption
                    style={{ textAlign: 'justify', fontSize: 14,marginBottom:'auto' }}
                    allowFontScaling={false}>
                    {product_description}
                  </Caption>
                </Card.Content>
              </Card>

            </View>
          </ScrollView>

          <BottomSheet
            ref={sheetRef}
            //initialPosition={'100%'} 
            snapPoints={[250, 50, 0]}
            borderRadius={10}
            renderContent={renderContent}
            initialSnap={2}
            enabledGestureInteraction={true}
          />
        </>
      )}
      {stock > 0 ?(<View
        style={{
          flex: 0.5,
          flexDirection: 'row',
          bottom:3,
          justifyContent:'center',
          alignItems:'center',
           position: 'absolute',
          zIndex: 999,
         // backgroundColor:'#4cd137',
          alignSelf:'center'
}}>


        <View style={{ paddingBottom: 10,alignItems:'center',justifyContent:'center'}}>

          <TouchableOpacity
           onPress={() => sheetRef.current.snapTo(0)}
            >
              <Button
              compact="true"
              mode="contained"
              size={10}
              color={'#fff'}
              uppercase={false}
              style={{width:170,marginTop:15 }}
              labelStyle={{
                color: 'black',
                marginVertical: 6,
                fontSize: 20,
               
              }}
              >Quantity :{productCount}</Button>
            {/* <Text  style={{color:'#000',fontWeight:'bold',fontSize:20}}
              allowFontScaling={
                false
              }>{`Choose Qty :  ${productCount} `}</Text> */}
          </TouchableOpacity>
        </View>
        {productCount ? (
          <Button
            compact="true"
            mode="contained"
            size={15}
            color={PRIMARY_COLOR}
            uppercase={false}
            onPress={() => {
              dispatch(cartAction.addToCart(cartReadyItems));
              setProductCount(productCount);
              ToastAndroid.show('Item added', ToastAndroid.SHORT);
            }}
            style={{width:170,marginTop:5,marginLeft:5 }}
            labelStyle={{
              color: 'white',
              marginVertical: 6,
              fontSize: 20,
            }}>
            Add{' '}
            <Icon
              style={{ color: 'white', marginHorizontal: 10 }}
              onPress={() => navigation.navigate('Cart')}
              name="cart-outline"
              size={20}
            />
          </Button>
        ) : null}
      </View>):!stock == 0?(<Button
              compact="true"
              mode="contained"
              size={10}
              color={'#c0392b'}
              uppercase={false}
              style={{width:320,height:50,marginHorizontal:5,alignSelf:'center' }}
              labelStyle={{
                color: 'white',
                marginVertical: 6,
                fontSize: 20,
               
              }}
              >Out of stock</Button>):(<></>)}

     
    </SafeAreaView>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  panel: {
    padding: 15,
    backgroundColor: '#fff',
    marginTop: 0,
    bottom: 0,
    position: 'relative',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    shadowOpacity: 4,
    borderColor: '#ccc',
    borderWidth: 1,
    
  
  },
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#333333',
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    // elevation: 5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
   // paddingBottom: 1,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 100,
    height: 1,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 1,
  },
});


