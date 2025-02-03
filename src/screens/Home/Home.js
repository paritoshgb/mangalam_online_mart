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
  Image,
  SectionList,
  ActivityIndicator,
  ToastAndroid,
  Alert,
  Linking,
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
  Snackbar,
} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
import ProductList from '../../components/ProductList';
import CategoryList from '../../components/CategoryList';
import ComboOfferDeal from '../../components/ComboOfferDeals';
import * as cartAction from '../../store/actions/CartAction';
import * as productAction from '../../store/actions/ProductAction';
import {SliderBox} from 'react-native-image-slider-box';
import NetInfo from '@react-native-community/netinfo';
import Icon from 'react-native-vector-icons/Ionicons';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import NetworkError from '../Common/NetworkError';
import VersionCheck from 'react-native-version-check';
import RNExitApp from 'react-native-exit-app';
import {API_BASE_URL} from '../../constants/Url';
import {PRIMARY_COLOR} from '../../constants/Color';
import DeviceInfo from 'react-native-device-info';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';

const Home = ({navigation}) => {
  const [isLoadingMoreItem, setLoadingMoreItem] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [dealOfTheDayProducts, setDealOfTheDayProducts] = useState([]);
  const [specialCombo, setSpecialCombo] = useState([]);
  const [offerProducts, setOfferProducts] = useState([]);
  const [homeSectionProducts, setHomeSectionProducts] = useState([]);
  const [offerAmount, setOfferAmount] = useState('');
  const [category, setCategory] = useState([]);
  const [headerBanner, setHeaderBanner] = useState([]);
  const [dealofthedayBanner, setDealofthedayBanner] = useState([]);
  const [homeSectionBanner, setHomeSectionBanner] = useState([]);
  const [footerSectionBanner, setFooterSectionBanner] = useState([]);
  const [isEndProductList, setIsEndProductList] = useState(false);
  const [isInternetConnected, setIsInternetConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deviceId, setDeviceid] = useState('');
  const [visibleUpdateSnackbar, setVisibleUpdateSnackbar] = useState(false);
  const onDismissSnackBar = () => setVisibleUpdateSnackbar(false);
  const isVisible = useIsFocused();

  const [onBack, setOnBack] = useState(false);

  const getDeviceId = () => {
    var deviceid = DeviceInfo.getAndroidId();
    setDeviceid(deviceid);
  };

  // console.log('OFFERPRODUCT',offerProducts)

  const apiUpdateVersionCall = () => {
    var authAPIURL = API_BASE_URL + 'fetchUpdateVersion.php';
    var header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    fetch(authAPIURL, {
      headers: header,
    })
      .then(response => response.json())
      .then(response => {
        const currentBuildNumber = VersionCheck.getCurrentBuildNumber();
        if (response[0].new_version_code > currentBuildNumber) {
          if (response[0].is_force_update == 1) {
            Alert.alert(
              'Good News!',
              'Update Available\nThis is Mandatory update',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    Linking.openURL(
                      'market://details?id=com.apksoftwaresolution.prestigepoint',
                    );
                    RNExitApp.exitApp();
                  },
                },
                {
                  text: 'Exit App!',
                  onPress: () => RNExitApp.exitApp(),
                },
              ],
            );
          } else {
            setVisibleUpdateSnackbar(true);
          }
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const fetchHomeSectionProductApi = () => {
    if (!isEndProductList) {
      setLoadingMoreItem(true);
      var fetchProductAPIURL = API_BASE_URL + `fetchHomeSectionProductList.php`;
      var header = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
      fetch(fetchProductAPIURL, {
        method: 'POST',
        headers: header,
      })
        .then(response => response.json())
        .then(response => {
          setHomeSectionProducts(response.home_section);
          setLoadingMoreItem(false);
        });
    } else {
    }
  };

  const fetchFavouriteProductApi = () => {
    if (!isEndProductList) {
      setLoadingMoreItem(true);
      var fetchProductAPIURL = `${API_BASE_URL}favouriteProductList.php?currentPage=${currentPage}`;
      fetch(fetchProductAPIURL, {
        method: 'POST',
        body: JSON.stringify({
          device_id: deviceId._j,
        }),
      })
        .then(response => response.json())
        .then(response => {
          console.log('popularresponse:', response)
          if (response.length > 0) {
            setProducts(response);
            setOnBack(true)
          } else {
            setIsEndProductList(true);
          }
          setLoadingMoreItem(false);
        });
    } else {
    }
  };

  const fetchDealOfTheDayProductApi = () => {
    if (!isEndProductList) {
      setLoadingMoreItem(true);
      var fetchProductAPIURL = `${API_BASE_URL}fetchDealOfTheDayProductList.php?currentPage=${currentPage}`;
      fetch(fetchProductAPIURL, {
        method: 'POST',
        body: JSON.stringify({
          device_id: deviceId._j,
        }),
      })
        .then(response => response.json())
        .then(response => {
          console.log('dealresponse:', response)
          if (response.length > 0) {
            setDealOfTheDayProducts(response);
            setOnBack(true);
           
          } else {
            setIsEndProductList(true);
          }
          setLoadingMoreItem(false);
        });
    } else {
    }
  };

  // const fetchComboDealOfferApi = () => {
  //   if (!isEndProductList) {
  //     setLoadingMoreItem(true);
  //     var fetchProductAPIURL = `${API_BASE_URL}fetchComboProductList.php?currentPage=${currentPage}`;
  //     fetch(fetchProductAPIURL, {
  //       method: 'POST',
  //     })
  //       .then(response => response.json())
  //       .then(response => {  console.log("special combo offer",response.data)
  //       setSpecialCombo([response.data])
  //         // if (response.length > 0) {
  //         //   setSpecialCombo([...specialCombo, ...response]);
  //         //   console.log("special combo offer",...response)
  //         // } else {
  //         //   setIsEndProductList(true);
  //         // }
  //         setLoadingMoreItem(false);
  //       });
  //   } else {
  //   }
  // };

  const fetchComboDealOfferApi = () => {
    var fetchProductAPIURL =
      API_BASE_URL + `fetchComboProductList.php?currentPage=${currentPage}`;
    fetch(fetchProductAPIURL, {
      method: 'POST',
      body: JSON.stringify({
        device_id: deviceId._j,
      }),
    })
      .then(response => response.json())
      .then(response => {
        setOfferAmount(response.total_amount);
        setSpecialCombo(response.data);
        // console.log("specialoffer",response.data)
      });
  };

  const fetchOfferProductApi = () => {
    if (!isEndProductList) {
      setLoadingMoreItem(true);
      var fetchProductAPIURL = `${API_BASE_URL}offerProductList.php?currentPage=${currentPage}`;
      fetch(fetchProductAPIURL, {
        method: 'POST',
        body: JSON.stringify({
          device_id: deviceId._j,
        }),
      })
        .then(response => response.json())

        .then(response => {
          if (response.length > 0) {
            setOfferProducts(response);
            setOnBack(true)
          } else {
            setIsEndProductList(true);
          }
          setLoadingMoreItem(false);
        });
    } else {
    }
  };

  const fetchHeaderBanner = () => {
    var fetchProductAPIURL =
      API_BASE_URL + `fetchHeaderBanner.php?device_id=${deviceId._j}`;
    fetch(fetchProductAPIURL)
      .then(response => response.json())
      .then(response => {
        setHeaderBanner(response.data);
        setLoading(false);
      });
  };

  const fetchDealOfTheDayBanner = () => {
    var fetchProductAPIURL = API_BASE_URL + `fetchDealofthedayBanner.php`;
    fetch(fetchProductAPIURL)
      .then(response => response.json())
      .then(response => {
        //  console.log(response.data)
        setDealofthedayBanner(response.data);
      });
  };

  const fetchHomeBanner = () => {
    var fetchProductAPIURL = API_BASE_URL + `fetchHomeBanner.php`;
    fetch(fetchProductAPIURL)
      .then(response => response.json())
      .then(response => {
        setHomeSectionBanner(response.data);
        // console.log(homeSectionBanner);
      });
  };

  const fetchFooterBanner = () => {
    var fetchProductAPIURL = API_BASE_URL + `fetchFooterBanner.php`;
    fetch(fetchProductAPIURL)
      .then(response => response.json())
      .then(response => {
        setFooterSectionBanner(response.data);
      });
  };

  const fetchCategory = () => {
    var fetchProductAPIURL = API_BASE_URL + `fetchCategoryList.php`;
    fetch(fetchProductAPIURL, {
      method: 'POST',
    })
      .then(response => response.json())
      .then(response => {
        setCategory(response);
      });
  };

  useEffect(() => {
    apiUpdateVersionCall();
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(internetState => {
      if (internetState.isConnected === true) {
        getDeviceId();
        fetchHeaderBanner();
        fetchCategory();
        fetchDealOfTheDayBanner();
        // fetchDealOfTheDayProductApi();
        // fetchOfferProductApi();
        // fetchFavouriteProductApi();
        fetchComboDealOfferApi();
        fetchHomeBanner();
        fetchHomeSectionProductApi();
        fetchFooterBanner();
      } else {
        setIsInternetConnected(true);
        ToastAndroid.show('Internet Connection Failed', ToastAndroid.SHORT);
      }
    });
    unsubscribe();
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      fetchHeaderBanner();
      // getDeviceId();
      fetchDealOfTheDayProductApi();
      fetchOfferProductApi();
        fetchFavouriteProductApi();
      setIsEndProductList(false);
      
    }, [isVisible, navigation,deviceId]),
  );

  const reloadPage = () => {
    setLoading(true);
    setIsInternetConnected(false);
    const unsubscribe = NetInfo.addEventListener(internetState => {
      if (internetState.isConnected === true) {
        fetchHeaderBanner();
        fetchCategory();
        fetchDealOfTheDayBanner();
        fetchDealOfTheDayProductApi();
        fetchOfferProductApi();
        fetchFavouriteProductApi();
        fetchHomeBanner();
        fetchHomeSectionProductApi();
        fetchFooterBanner();
      } else {
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
    <ProductList
      product_id={item.product_id}
      product_name={item.product_name}
      brand_name={item.brand_name}
      product_img={item.product_img}
      discount={item.discount}
      pgms_pprice={item.pgms_pprice}
      product_description={item.product_description}
      popular={item.popular}
      stock={item.stock}
      category={item.category}
      subcategory={item.subcategory}
      category_id={item.category_id}
      subcategory_id={item.subcategory_id}
      banner_img={item.banner_img}
      quantity={item.quantity}
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
          banner_img: item.banner_img,
        });
      }}
    />
  );

  const CategoryItem = ({item}) => (
    <CategoryList
      category_id={item.category_id}
      category_name={item.category_name}
      category_img={item.category_img}
      goToSubCategory={() => {
        navigation.navigate('Sub_Category_all', {
          screen: 'Sub_Category_all',
          category_id: item.category_id,
          category_name: item.category_name,
          category_img: item.category_img,
        });
      }}
    />
  );
  const SpecialDeal = ({item}) => (
    <ComboOfferDeal
      product_id={item.product_id}
      product_name={item.product_name}
      //brand_name: item.brand_name,
      combo={item.is_combo}
      combo_amount={item.is_combo_amount}
      product_img={item.product_img}
      discount={item.discount[0]}
      pgms_pprice={item.pgms_pprice}
      product_description={item.product_description}
      popular={item.popular}
      gotoProductDetails={() => {
        navigation.navigate('ProductDetails', {
          screen: 'ProductDetails',
          product_id: item.product_id,
          product_name: item.product_name,
          combo: item.is_combo,
          combo_amount: item.is_combo_amount,
          product_img: item.product_img,
          discount: item.discount[0],
          pgms_pprice: item.pgms_pprice,
          product_description: item.product_description,
          popular: item.popular,
        });
      }}
    />
  );

  return (
    <SafeAreaView style={{}}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      {loading ? (
        <View style={{marginHorizontal: 15}}>
          <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item
              width={Dimensions.get('window').width}
              height={45}
              borderRadius={4}
              marginVertical={5}
            />
            <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
              <SkeletonPlaceholder.Item
                width={Dimensions.get('window').width}
                height={200}
                borderRadius={4}
              />
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item
              flexDirection="row"
              alignItems="center"
              marginTop={15}>
              <SkeletonPlaceholder.Item
                width={Dimensions.get('window').width / 3.3}
                height={100}
                borderRadius={100}
                marginRight={5}
              />
              <SkeletonPlaceholder.Item
                width={Dimensions.get('window').width / 3.3}
                height={100}
                borderRadius={100}
                marginRight={5}
              />
              <SkeletonPlaceholder.Item
                width={Dimensions.get('window').width / 3.3}
                height={100}
                borderRadius={100}
                marginRight={5}
              />
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item
              flexDirection="row"
              alignItems="center"
              marginTop={15}>
              <SkeletonPlaceholder.Item
                width={Dimensions.get('window').width / 3.3}
                height={160}
                borderRadius={4}
                marginRight={5}
              />
              <SkeletonPlaceholder.Item
                width={Dimensions.get('window').width / 3.3}
                height={160}
                borderRadius={4}
                marginHorizontal={5}
              />
              <SkeletonPlaceholder.Item
                width={Dimensions.get('window').width / 3.4}
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
                width={Dimensions.get('window').width / 3.3}
                height={160}
                borderRadius={4}
                marginRight={5}
              />
              <SkeletonPlaceholder.Item
                width={Dimensions.get('window').width / 3.3}
                height={160}
                borderRadius={4}
                marginHorizontal={5}
              />
              <SkeletonPlaceholder.Item
                width={Dimensions.get('window').width / 3.4}
                height={160}
                borderRadius={4}
                marginLeft={5}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder>
        </View>
      ) : null}

      <FlatList
        renderItem={item => <View></View>}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* <View
              style={{
                marginHorizontal: 10,
                marginVertical: 5,
                borderColor: '#ececec',
                borderRadius: 4,
                borderWidth: 1,
                elevation: 5,
                height: 45,
                backgroundColor: 'white',
              }}>
              <TouchableOpacity
                onPress={() => navigation.navigate('ProductSearch')}
                style={{height: 45}}>
                <View style={{flexDirection: 'row', flex: 1, padding: 10}}>
                  <View
                    style={{
                      width: Dimensions.get('window').width / 9,
                      height: 40,
                      paddingLeft: 5,
                    }}>
                    <Icon
                      name="search"
                      color={PRIMARY_COLOR}
                      size={20}
                      allowFontScaling={false}
                    />
                  </View>
                  <View
                    style={{
                      width: Dimensions.get('window').width,
                    }}>
                    <Text
                      style={{color: 'gray', fontSize: 16}}
                      allowFontScaling={false}>
                      Search Product here...
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View> */}

            <SliderBox
              images={headerBanner}
              key={(item, index) => index + new Date('1975')}
              sliderBoxHeight={200}
              onCurrentImagePressed={index => {
                fetch(API_BASE_URL + 'fetchCategoryByBannerImgName.php', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    img_name: headerBanner[index].split('/banner/')[1],
                  }),
                })
                  .then(response => response.json())
                  .then(response => {
                    if (response.id != null) {
                      navigation.navigate('SubCategory', {
                        screen: 'SubCategory',
                        category_id: response.id,
                        category_name: response.category_name,
                        category_img: response.category_img,
                      });
                    }
                  })
                  .catch(error => {
                    console.log(error);
                  });
              }}
              circleLoop={true}
              disableOnPress={false}
              autoplay={true}
              dotStyle={{width: 0, height: 0}}
              resizeMethod={'resize'}
              resizeMode={'contain'}
              imageLoadingColor="transparent"
              ImageComponentStyle={{
                borderRadius: 15,
                width: '95%',
                marginTop: 5,
              }}
            />

            <View style={{flex: 1, marginLeft: 10, marginVertical: 10}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View style={{justifyContent: 'flex-start'}}>
                  <Headline
                    style={{
                      marginTop: 10,
                      fontSize: 18,
                      marginLeft: 10,
                      fontWeight: 'bold',
                    }}
                    allowFontScaling={false}>
                    Categories
                  </Headline>
                </View>
                <View style={{justifyContent: 'flex-end'}}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Category_all')}>
                    <Caption
                      allowFontScaling={false}
                      style={{
                        marginRight: 15,
                        marginTop: 15,
                        textAlign: 'right',
                        fontSize: 13,
                        color: '#e74c3c',
                      }}>
                      View all{' '}
                      <Icon name="grid-outline" color="#e74c3c" size={14} />
                    </Caption>
                  </TouchableOpacity>
                </View>
              </View>
              <FlatList
                data={category}
                renderItem={CategoryItem}
                keyExtractor={item => item.category_id}
                key={(item, index) => String(index)}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              />
            </View>

            <View style={{flex: 1, marginLeft: 10, marginVertical: 0}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View style={{justifyContent: 'flex-start'}}>
                  <Headline
                    style={{
                      marginTop: 10,
                      fontSize: 18,
                      marginLeft: 10,
                      fontWeight: 'bold',
                    }}
                    allowFontScaling={false}>
                    Shop for &#8377; {offerAmount} to get Steal Deals
                  </Headline>
                </View>
              </View>
              <FlatList
                data={specialCombo}
                renderItem={SpecialDeal}
                keyExtractor={item => item.product_id}
                key={(item, index) => String(index)}
                //horizontal={true}
                showsHorizontalScrollIndicator={false}
              />
            </View>

            <SliderBox
              images={dealofthedayBanner}
              keyExtractor={(item, index) =>
                dealofthedayBanner[0] + index + item
              }
              sliderBoxHeight={100}
              onCurrentImagePressed={index => {
                fetch(API_BASE_URL + 'fetchCategoryByBannerImgName.php', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    img_name: dealofthedayBanner[index].split('/banner/')[1],
                  }),
                })
                  .then(response => response.json())
                  .then(response => {
                    if (response.id != null) {
                      navigation.navigate('SubCategory', {
                        screen: 'SubCategory',
                        category_id: response.id,
                        category_name: response.category_name,
                        category_img: response.category_img,
                      });
                    }
                  })
                  .catch(error => {
                    console.log(error);
                  });
              }}
              circleLoop={true}
              disableOnPress={false}
              autoplay={true}
              dotStyle={{width: 0, height: 0}}
              resizeMethod={'resize'}
              resizeMode={'contain'}
              imageLoadingColor="transparent"
              ImageComponentStyle={{
                borderRadius: 15,
                width: '95%',
                marginTop: 20,
              }}
            />

            <View style={{flex: 1, marginLeft: 5, marginVertical: 10}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View style={{justifyContent: 'flex-start'}}>
                  <Headline
                    style={{
                      marginTop: 10,
                      fontSize: 18,
                      marginLeft: 10,
                      fontWeight: 'bold',
                    }}
                    allowFontScaling={false}>
                    Deal Of the Day
                  </Headline>
                </View>
                <View style={{justifyContent: 'flex-end'}}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Offer')}>
                    <Caption
                      allowFontScaling={false}
                      style={{
                        marginRight: 15,
                        marginTop: 15,
                        textAlign: 'right',
                        fontSize: 13,
                        color: '#e74c3c',
                      }}>
                      View all{' '}
                      <Icon
                        name="ios-arrow-forward-circle-outline"
                        color="#e74c3c"
                        size={14}
                      />
                    </Caption>
                  </TouchableOpacity>
                </View>
              </View>
              {onBack ? (
                <FlatList
                  data={dealOfTheDayProducts}
                  renderItem={ProductItem}
                  keyExtractor={item => item.product_id}
                  key={(item, index) => String(index)}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                />
              ) : null}
            </View>

            <View style={{flex: 1, marginLeft: 5, marginVertical: 10}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View style={{justifyContent: 'flex-start'}}>
                  <Headline
                    style={{
                      marginTop: 10,
                      fontSize: 18,
                      marginLeft: 10,
                      fontWeight: 'bold',
                    }}
                    numberOfLines={1}
                    allowFontScaling={false}
                    adjustsFontSizeToFit>
                    Popular Products
                  </Headline>
                </View>
                <View style={{justifyContent: 'flex-end'}}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('PopularProductList')}>
                    <Caption
                      numberOfLines={1}
                      allowFontScaling={false}
                      adjustsFontSizeToFit
                      style={{
                        marginRight: 15,
                        marginTop: 15,
                        textAlign: 'right',
                        fontSize: 13,
                        color: '#e74c3c',
                      }}>
                      View all{' '}
                      <Icon
                        name="ios-arrow-forward-circle-outline"
                        color="#e74c3c"
                        size={14}
                      />
                    </Caption>
                  </TouchableOpacity>
                </View>
              </View>
              {onBack ?<FlatList
                data={products}
                renderItem={ProductItem}
                keyExtractor={item => item.product_id}
                key={(item, index) => String(index)}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              /> : null }
              
            </View>
          </>
        }
        ListFooterComponent={
          <>
            <SliderBox
              images={homeSectionBanner}
              key={(item, index) => String(index)}
              sliderBoxHeight={100}
              onCurrentImagePressed={index => {
                fetch(API_BASE_URL + 'fetchCategoryByBannerImgName.php', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    img_name: homeSectionBanner[index].split('/banner/')[1],
                  }),
                })
                  .then(response => response.json())
                  .then(response => {
                    if (response.id != null) {
                      navigation.navigate('SubCategory', {
                        screen: 'SubCategory',
                        category_id: response.id,
                        category_name: response.category_name,
                        category_img: response.category_img,
                      });
                    }
                  })
                  .catch(error => {
                    console.log(error);
                  });
              }}
              circleLoop={true}
              disableOnPress={false}
              autoplay={true}
              dotStyle={{width: 0, height: 0}}
              resizeMethod={'resize'}
              resizeMode={'contain'}
              imageLoadingColor="transparent"
              ImageComponentStyle={{
                borderRadius: 15,
                width: '95%',
                marginTop: 5,
              }}
            />

            <FlatList
              data={homeSectionProducts}
              keyExtractor={item => item.sessionID + new Date('1970')}
              renderItem={({item}) => (
                <>
                  <View style={{flex: 1, marginLeft: 10}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <View style={{justifyContent: 'flex-start'}}>
                        <Headline
                          style={{
                            marginTop: 10,
                            fontSize: 18,
                            marginLeft: 10,
                            fontWeight: 'bold',
                          }}
                          numberOfLines={1}
                          allowFontScaling={false}
                          adjustsFontSizeToFit>
                          {item.title}
                        </Headline>
                      </View>
                    </View>
                    <FlatList
                      horizontal={true}
                      keyExtractor={item => item.sessionID + new Date('1971')}
                      data={item.product}
                      renderItem={ProductItem}
                      showsHorizontalScrollIndicator={false}
                    />
                  </View>
                </>
              )}
            />

            <View style={{flex: 1, marginLeft: 5, marginVertical: 10}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View style={{justifyContent: 'flex-start'}}>
                  <Headline
                    style={{
                      marginTop: 10,
                      fontSize: 18,
                      marginLeft: 10,
                      fontWeight: 'bold',
                    }}
                    numberOfLines={1}
                    allowFontScaling={false}
                    adjustsFontSizeToFit>
                    Special Offer
                  </Headline>
                </View>
                <View style={{justifyContent: 'flex-end'}}>
                  {/* <TouchableOpacity
                    onPress={() => navigation.navigate('PopularProductList')}>
                    <Caption
                      numberOfLines={1}
                      allowFontScaling={false}
                      adjustsFontSizeToFit
                      style={{
                        marginRight: 15,
                        marginTop: 15,
                        textAlign: 'right',
                        fontSize: 13,
                        color: '#e74c3c',
                      }}>
                      View all{' '}
                      <Icon
                        name="ios-arrow-forward-circle-outline"
                        color="#e74c3c"
                        size={14}
                      />
                    </Caption>
                  </TouchableOpacity> */}
                </View>
              </View>
              {onBack ? <FlatList
                data={offerProducts}
                renderItem={ProductItem}
                keyExtractor={item => item.product_id}
                key={(item, index) => String(index)}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              /> : null}
              
            </View>
            <SliderBox
              images={footerSectionBanner}
              keyExtractor={(item, index) =>
                footerSectionBanner[0] + index + item
              }
              sliderBoxHeight={100}
              onCurrentImagePressed={index => {
                fetch(API_BASE_URL + 'fetchCategoryByBannerImgName.php', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    img_name: footerSectionBanner[index].split('/banner/')[1],
                  }),
                })
                  .then(response => response.json())
                  .then(response => {
                    if (response.id != null) {
                      navigation.navigate('SubCategory', {
                        screen: 'SubCategory',
                        category_id: response.id,
                        category_name: response.category_name,
                        category_img: response.category_img,
                      });
                    }
                  })
                  .catch(error => {
                    console.log(error);
                  });
              }}
              circleLoop={true}
              disableOnPress={false}
              autoplay={true}
              dotStyle={{width: 0, height: 0}}
              resizeMethod={'resize'}
              resizeMode={'contain'}
              imageLoadingColor="transparent"
              ImageComponentStyle={{
                borderRadius: 15,
                width: '95%',
                marginTop: 5,
              }}
            />

            <>
              {/* <Image
                source={require('../../assets/image/thinking.png')}
                style={{
                  width: 50,
                  height: 50,
                  alignSelf: 'center',
                  marginVertical: 5,
                }}
              /> */}
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('AllProductsList');
                }}>
                {/* <Subheading
                  allowFontScaling={false}
                  adjustsFontSizeToFit
                  style={{
                    textAlign: 'center',
                    marginHorizontal: 60,
                    color: '#ccc',
                  }}>
                  Haven't found what you're looking for ?
                </Subheading> */}

                <Text
                  allowFontScaling={false}
                  style={{
                    color: PRIMARY_COLOR,
                    textAlign: 'center',
                    borderColor: PRIMARY_COLOR,
                    borderWidth: 1,
                    padding: 5,
                    marginTop: 10,
                    borderRadius: 5,
                    marginHorizontal: 100,
                    marginBottom: 15,
                  }}>
                  Explore Products
                </Text>
              </TouchableOpacity>
            </>
          </>
        }
      />

      {/* <Snackbar
        visible={visibleUpdateSnackbar}
        onDismiss={onDismissSnackBar}
        action={{
          label: 'Update',
          onPress: () => {
            setVisibleUpdateSnackbar(false);
            Linking.openURL('market://details?id=com.groceryapp');
          },
        }}>
        App Update Available
      </Snackbar> */}
    </SafeAreaView>
  );
};

export default Home;
