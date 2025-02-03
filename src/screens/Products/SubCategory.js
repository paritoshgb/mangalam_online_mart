import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  FlatList,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Image,
  SectionList,
  ActivityIndicator,
  ToastAndroid,
  StyleSheet,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Caption,
  Subheading,
  Divider,
  Headline,
  Avatar,
  Button,
  Searchbar,
  List,
  IconButton,
  Menu,
} from 'react-native-paper';
import DynamicTabView from 'react-native-dynamic-tab-view-test';
import OfferProductList from '../../components/OfferProductList';
import NetInfo from '@react-native-community/netinfo';
import NetworkError from '../Common/NetworkError';
import NoProduct from '../Common/NoProduct';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import OptionsMenu from 'react-native-option-menu';
import {SliderBox} from 'react-native-image-slider-box';
import { API_BASE_URL } from '../../constants/Url';
import {PRIMARY_COLOR} from '../../constants/Color';

const SubCategory = ({route, navigation}) => {
  const [productData, setProductData] = useState([]);
  const [categoryBanner, setCategoryBanner] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInternetConnected, setIsInternetConnected] = useState(false);
  const [noProduct, setNoProduct] = useState(false);

  const [highToLowPrice, setHighToLowPrice] = useState(false);
  const [lowToHighPrice, setLowToHighPrice] = useState(false);
  const [highToLowDiscount, setHighToLowDiscount] = useState(false);
  const [filterMsg, setFilterMsg] = useState('Random');

  const fetchProductApi = () => {
    var fetchProductAPIURL = API_BASE_URL+`fetchSubCategoryAndProductListByCategory.php`;
    var header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    fetch(fetchProductAPIURL, {
      method: 'POST',
      headers: header,
      body: JSON.stringify({
        category_id: route.params.category_id,
      }),
    })
      .then(response => response.json())
      .then(response => {
        if (response.home_section.length) {
          setProductData(response.home_section);
        } else {
          setNoProduct(true);
        }
        setLoading(false);
      });
  };

  const fetchCategoryBanner = () => {
    var fetchProductAPIURL = API_BASE_URL+`fetchCategoryBanner.php`;
    var header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    fetch(fetchProductAPIURL, {
      method: 'POST',
      headers: header,
      body: JSON.stringify({
        category_id: route.params.category_id,
      }),
    })
      .then(response => response.json())
      .then(response => {
        setCategoryBanner(response.data);
      });
  }; 

  const reloadPage = () => {
    setLoading(true);
    setIsInternetConnected(false);
    const unsubscribe = NetInfo.addEventListener(internetState => {
      if (internetState.isConnected === true) {
        fetchProductApi();
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
        fetchProductApi();
        fetchCategoryBanner();
      } else {
        setLoading(false);
        setIsInternetConnected(true);
      }
    });
    unsubscribe();
  }, [route.params.category_id]);



  const ProductItem = ({item}) => (
    <OfferProductList
      product_id={item.product_id}
      product_name={item.product_name}
      product_img={item.product_img}
      discount={item.discount}
      pgms_pprice={item.pgms_pprice}
      popular={item.popular}
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

  useEffect(() => {
    setHighToLowPrice(false);
    setLowToHighPrice(true);
    setHighToLowDiscount(false);
    setFilterMsg('Price Low to High');
  }, []);

  const highToLowPriceFiter = () => {
    setHighToLowPrice(true);
    setLowToHighPrice(false);
    setHighToLowDiscount(false);
    setFilterMsg('Price High to Low');
  };

  const lowToHighPriceFiter = () => {
    setHighToLowPrice(false);
    setLowToHighPrice(true);
    setHighToLowDiscount(false);
    setFilterMsg('Price Low to High');
  };

  const highToLowDiscountFilter = () => {
    setHighToLowPrice(false);
    setLowToHighPrice(false);
    setHighToLowDiscount(true);
    setFilterMsg('Discount High to Low');
  };

  const renderTab = (item, index) => {
    return (
      <>
        <List.Item
          title={filterMsg}
          titleNumberOfLines={1}
          allowFontScaling={false}
          titleStyle={{fontSize: 14}}
          right={props => (
            <OptionsMenu
              allowFontScaling={false}
              customButton={
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <MaterialCommunityIcons name="filter-outline" size={18} />
                  <Caption>Filter</Caption>
                </View>
              }
              destructiveIndex={1}
              options={[
                'Price High to Low',
                'Price Low to High',
                'Discount High to Low',
                'Cancel',
              ]}
              actions={[
                highToLowPriceFiter,
                lowToHighPriceFiter,
                highToLowDiscountFilter,
              ]}
            />
          )}
        />

        <View style={{marginHorizontal: 10, marginTop: 5}}>
          <FlatList
            data={
              highToLowPrice
                ? [...item.product].sort((a, b) => {
                    return (
                      (b.pgms_pprice[0].product_price * (100 - b.discount)) /
                        100 -
                      (a.pgms_pprice[0].product_price * (100 - a.discount)) /
                        100
                    );
                  })
                : lowToHighPrice
                ? [...item.product].sort((a, b) => {
                    return (
                      (a.pgms_pprice[0].product_price * (100 - a.discount)) /
                        100 -
                      (b.pgms_pprice[0].product_price * (100 - b.discount)) /
                        100
                    );
                  })
                : highToLowDiscount
                ? [...item.product].sort((a, b) => {
                    return b.discount - a.discount;
                  })
                : item.product
            }
            key={item => item.product}
            keyExtractor={(item, index) => String(index)}
            renderItem={ProductItem}
            showsVerticalScrollIndicator={false}
            // style={{flex: 1}}
            // numColumns={3}
          />
        </View>
      </>
    );
  };

  const onChangeTab = (item, index) => {};

  if (noProduct) {
    return (
      <>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
          }}>
          <NoProduct />
        </View>
      </>
    );
  }

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
          <FlatList
            renderItem={item => <></>}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              categoryBanner.length > 0 ? (
                <View style={{backgroundColor: 'white', marginBottom: -30,}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      width:'100%',
                     // backgroundColor:'#0984e3'
                    }}>
                    <ScrollView
                      ref={ref => (this.scrollView = ref)}
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}>
                      {categoryBanner.map(banner => (
                        <Image
                          source={{uri: banner}}
                          style={{
                            width: Dimensions.get('window').width - 50,
                            height: 150,
                            marginHorizontal: 10,
                            borderRadius: 5,
                          marginLeft:25
                          }}
                          PlaceholderContent={<ActivityIndicator />}
                        />
                      ))}
                    </ScrollView>
                  </View>
                  <Avatar.Image
                    source={{uri: route.params.category_img}}
                    size={100}
                    style={{
                      alignSelf: 'center',
                      position: 'relative',
                      top: -50,
                      elevation: 5,
                    }}
                  />
                  <Subheading
                    allowFontScaling={false}
                    numberOfLines={1}
                    style={{
                      alignSelf: 'center',
                      position: 'relative',
                      top: -50,
                      paddingHorizontal: 20,
                    }}>
                    {route.params.category_name}
                  </Subheading>
                </View>
              ) : null
            }
            ListFooterComponent={
              <DynamicTabView
                data={productData}
                renderTab={renderTab}
                onChangeTab={item => onChangeTab(item)}
                defaultIndex={0}
                containerStyle={{
                  flex: 1,
                  borderTopColor: '#ececec',
                  borderTopWidth: 1,
                }}
                headerBackgroundColor={PRIMARY_COLOR}
                headerTextStyle={{color: 'white'}}
              />
            }
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default SubCategory;

const styles = StyleSheet.create({});
