import React, {useState, useEffect, useMemo} from 'react';
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
  ActivityIndicator,
  ToastAndroid,
  Dimensions,
} from 'react-native';
// import {Picker} from '@react-native-community/picker';
import {Searchbar, List, Card, Button, Caption} from 'react-native-paper';
// import Icon from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ProductListHorizontal from '../../components/ProductListHorizontal';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import NetworkError from '../Common/NetworkError';
import NetInfo from '@react-native-community/netinfo';
import OptionsMenu from 'react-native-option-menu';
import {API_BASE_URL} from '../../constants/Url';
import {PRIMARY_COLOR} from '../../constants/Color';

const PopularProductList = ({navigation}) => {
  const [isEndProductList, setIsEndProductList] = useState(false);
  const [isLoadingMoreItem, setLoadingMoreItem] = useState(false);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [isInternetConnected, setIsInternetConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  const [highToLowPrice, setHighToLowPrice] = useState(false);
  const [lowToHighPrice, setLowToHighPrice] = useState(false);
  const [filterMsg, setFilterMsg] = useState('Random');

  const fetchProductApi = () => {
    if (!isEndProductList) {
      setLoadingMoreItem(true);
      var fetchProductAPIURL =
        API_BASE_URL + `favouriteProductList.php?currentPage=${currentPage}`;
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
    }
  };

  useEffect(() => {
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
  }, [currentPage]);

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
    setHighToLowPrice(false);
    setLowToHighPrice(false);
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

  const ProductItem = ({item}) => (
    <ProductListHorizontal
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
          brand_name: item.brand_name,
          product_img: item.product_img,
          discount: item.discount,
          pgms_pprice: item.pgms_pprice,
          product_description: item.product_description,
          popular: item.popular,
          stock: item.stock,
          category: item.category,
          subcategory: item.subcategory,
        });
      }}
    />
  );

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

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      {loading ? (
        <View style={{alignItems: 'center', flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        </View>
      ) : null}
      {products.length > 0 ? (
        <View style={{marginHorizontal: 10}}>
          <FlatList
            data={sortedArray}
            renderItem={ProductItem}
            keyExtractor={item => item.product_id}
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
                      'Cancel',
                    ]}
                    actions={[highToLowPriceFiter, lowToHighPriceFiter]}
                  />
                )}
              />
            }
            ListFooterComponent={renderLoader}
            onEndReached={loadMoreItem}
            onEndReachedThreshold={2}
            showsVerticalScrollIndicator={false}
          />
        </View>
      ) : null}
    </SafeAreaView>
  );
};

export default PopularProductList;

const styles = StyleSheet.create({});
