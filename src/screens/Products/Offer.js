import React, {useEffect, useState, useMemo} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import {List, Caption, Button, Subheading} from 'react-native-paper';
import {FlatList} from 'react-native-gesture-handler';
import NetInfo from '@react-native-community/netinfo';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import NetworkError from '../Common/NetworkError';
import NoProduct from '../Common/NoProduct';
import OfferProductList from '../../components/OfferProductList';
import OptionsMenu from 'react-native-option-menu';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {API_BASE_URL} from '../../constants/Url';
import {PRIMARY_COLOR} from '../../constants/Color';

const Offer = ({navigation}) => {
  const [isEndProductList, setIsEndProductList] = useState(false);
  const [isLoadingMoreItem, setLoadingMoreItem] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isInternetConnected, setIsInternetConnected] = useState(false);

  const [highToLowPrice, setHighToLowPrice] = useState(false);
  const [lowToHighPrice, setLowToHighPrice] = useState(false);
  const [highToLowDiscount, setHighToLowDiscount] = useState(false);
  const [filterMsg, setFilterMsg] = useState('Random');

  const fetchDealOfTheDayProductAPI = () => {
    if (!isEndProductList) {
      setLoadingMoreItem(true);
      var fetchProductAPIURL = API_BASE_URL+`fetchOfferProductList.php?currentPage=${currentPage}`;
      fetch(fetchProductAPIURL, {
        method: 'POST',
      }) 
        .then(response => response.json())
        .then(response => {
          if (response.length > 0) {
            setProducts([...products, ...response]);
          } else {
            setIsEndProductList(true);
          }
          setLoadingMoreItem(false);
          setLoading(false);
        });
    } else {
    }
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(internetState => {
      if (internetState.isConnected === true) {
        fetchDealOfTheDayProductAPI();
      } else {
        setLoading(false);
        setIsInternetConnected(true);
        ToastAndroid.show('Internet Connection Failed', ToastAndroid.SHORT);
      }
    });
    unsubscribe();
  }, [currentPage]);

  const loadMoreItem = () => {
    setCurrentPage(currentPage + 1);
  };

  const renderLoader = () => {
    return isLoadingMoreItem ? (
      <View style={{marginVertical: 20, alignItems: 'center'}}>
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        <Text style={{fontSize: 12}}>Loading Kirana</Text>
      </View>
    ) : null;
  };

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
    setFilterMsg('Price Low to High');
  }, []);

  const highToLowPriceFiter = () => {
    setHighToLowPrice(true);
    setLowToHighPrice(false);
    setFilterMsg('Price High to Low');
  };

  const lowToHighPriceFiter = () => {
    setHighToLowPrice(false);
    setLowToHighPrice(true);
    setFilterMsg('Price Low to High');
  };

  const highToLowDiscountFilter = () => {
    setHighToLowPrice(false);
    setLowToHighPrice(false);
    setHighToLowDiscount(true);
    setFilterMsg('Discount High to Low');
  };

  const reloadPage = () => {
    setLoading(true);
    setIsInternetConnected(false);
    const unsubscribe = NetInfo.addEventListener(internetState => {
      if (internetState.isConnected === true) {
        fetchDealOfTheDayProductAPI();
      } else {
        setLoading(false);
        setIsInternetConnected(true);
        ToastAndroid.show('Internet Connection Failed', ToastAndroid.SHORT);
      }
    });
    unsubscribe();
  };

  const sortedArray = useMemo(() => {
    return highToLowPrice
      ? [...products].sort((a, b) => {
          return (
            (b.pgms_pprice[0].product_price * (100 - b.discount)) / 100 -
            (a.pgms_pprice[0].product_price * (100 - a.discount)) / 100
          );
        })
      : lowToHighPrice
      ? [...products].sort((a, b) => {
          return (
            (a.pgms_pprice[0].product_price * (100 - a.discount)) / 100 -
            (b.pgms_pprice[0].product_price * (100 - b.discount)) / 100
          );
        })
      : highToLowDiscount
      ? [...products].sort((a, b) => {
          return (b.discount - a.discount);
        })
      : products;
  }, [products, highToLowPrice, lowToHighPrice]);

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
        <View style={{alignItems: 'center', flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        </View>
      ) : null}

      {products.length > 0 ? (
        <>
          <View style={{marginHorizontal: 10}}>
            <FlatList
              data={sortedArray}
              keyExtractor={(item, index) => String(index)}
              renderItem={ProductItem}
              ListHeaderComponent={
                <List.Item
                  title={filterMsg}
                  titleStyle={{fontSize: 14}}
                  right={props => (
                    <OptionsMenu
                      customButton={
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <MaterialCommunityIcons
                            name="filter-outline"
                            size={18}
                          />
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
              }
              ListFooterComponent={renderLoader}
              onEndReached={loadMoreItem}
              onEndReachedThreshold={0.5}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </>
      ) : null}
    </SafeAreaView>
  );
};

export default Offer;

const styles = StyleSheet.create({});
