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
  ActivityIndicator,
  ToastAndroid,
  Dimensions,
} from 'react-native';
// import {Picker} from '@react-native-community/picker';
import {Searchbar, List, Card, Button} from 'react-native-paper';
// import Icon from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AllProductsList from '../../components/AllProductsList';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import NetworkError from '../Common/NetworkError';
import NetInfo from '@react-native-community/netinfo';
import {API_BASE_URL} from '../../constants/Url';
import {PRIMARY_COLOR} from '../../constants/Color';

const AllProductList = ({navigation}) => {
  const [isEndProductList, setIsEndProductList] = useState(false); 
  const [isLoadingMoreItem, setLoadingMoreItem] = useState(false);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [isInternetConnected, setIsInternetConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProductApi = () => {
    if (!isEndProductList) {
      setLoadingMoreItem(true);
      var fetchProductAPIURL =
        API_BASE_URL + `productList.php?currentPage=${currentPage}`;
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
    <AllProductsList
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
        <View style={{marginHorizontal: 15}}>
          <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item
              flexDirection="row"
              alignItems="center"
              marginTop={15}>
              <SkeletonPlaceholder.Item
                width={Dimensions.get('window').width / 3}
                height={160}
                borderRadius={4}
                marginRight={5}
              />
              <SkeletonPlaceholder.Item
                width={Dimensions.get('window').width / 3}
                height={160}
                borderRadius={4}
                marginHorizontal={5}
              />
              <SkeletonPlaceholder.Item
                width={Dimensions.get('window').width / 3}
                height={160}
                borderRadius={4}
                marginLeft={5}
                
              />
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item
              flexDirection="row"
              alignItems="center"
              marginTop={15}>
              <SkeletonPlaceholder.Item
                width={Dimensions.get('window').width / 3}
                height={160}
                borderRadius={4}
                marginRight={5}
              />
              <SkeletonPlaceholder.Item
                width={Dimensions.get('window').width / 3}
                height={160}
                borderRadius={4}
                marginHorizontal={5}
              />
              <SkeletonPlaceholder.Item
                width={Dimensions.get('window').width / 3}
                height={160}
                borderRadius={4}
                marginLeft={5}
              />
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item
              flexDirection="row"
              alignItems="center"
              marginTop={15}>
              <SkeletonPlaceholder.Item
                width={Dimensions.get('window').width / 3}
                height={160}
                borderRadius={4}
                marginRight={5}
              />
              <SkeletonPlaceholder.Item
                width={Dimensions.get('window').width / 3}
                height={160}
                borderRadius={4}
                marginHorizontal={5}
              />
              <SkeletonPlaceholder.Item
                width={Dimensions.get('window').width / 3}
                height={160}
                borderRadius={4}
                marginLeft={5}
              />
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item
              flexDirection="row"
              alignItems="center"
              marginTop={15}>
              <SkeletonPlaceholder.Item
                width={Dimensions.get('window').width / 3}
                height={160}
                borderRadius={4}
                marginRight={5}
              />
              <SkeletonPlaceholder.Item
                width={Dimensions.get('window').width / 3}
                height={160}
                borderRadius={4}
                marginHorizontal={5}
              />
              <SkeletonPlaceholder.Item
                width={Dimensions.get('window').width / 3}
                height={160}
                borderRadius={4}
                marginLeft={5}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder>
        </View>
      ) : null}
      {products.length > 0 ? (
        <View style={{marginLeft: 5}}>
          <FlatList
            data={products}
            renderItem={ProductItem}
            keyExtractor={item => item.product_id}
            numColumns={3}
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

export default AllProductList;

const styles = StyleSheet.create({});
