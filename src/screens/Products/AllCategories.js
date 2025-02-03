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
import {Headline} from 'react-native-paper'
import {FlatList} from 'react-native-gesture-handler';
import NetInfo from '@react-native-community/netinfo';
import CategoryList from '../../components/CategoryList';
import {API_BASE_URL} from '../../constants/Url';
import {PRIMARY_COLOR} from '../../constants/Color';
import {SliderBox} from 'react-native-image-slider-box';

const AllCategories = ({navigation}) => {
  const [isEndProductList, setIsEndProductList] = useState(false);
  const [isLoadingMoreItem, setLoadingMoreItem] = useState(false);
  //const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isInternetConnected, setIsInternetConnected] = useState(false);

 const[headerBanner,setHeaderBanner]=useState([]);

 
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
    const unsubscribe = NetInfo.addEventListener(internetState => {
      if (internetState.isConnected === true) {
        //fetchDealOfTheDayProductAPI();
        setLoading(false)
        fetchCategory();
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
    <CategoryList
      category_id={item.category_id}
      category_name={item.category_name}
      category_img={item.category_img}
      goToSubCategory={() => {
        //Sub_Category_all
        navigation.navigate('Sub_Category_all', {
          screen: 'Sub_Category_all',
          category_id: item.category_id,
          category_name: item.category_name,
          category_img: item.category_img,
        });
      }}
    />
  );

   useEffect(() => {
     fetchHeaderBanner()
     renderLoader()
     loadMoreItem()
    }, []);
  

  const fetchHeaderBanner = () => {
    var fetchProductAPIURL = API_BASE_URL + `fetchHeaderBanner.php`;
    fetch(fetchProductAPIURL)
      .then(response => response.json())
      .then(response => {
        setHeaderBanner(response.data);
        setLoading(false);
      });
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      {loading ? (
        <View style={{alignItems: 'center', flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        </View>
      ) : null}


       
      {category.length > 0 ? (
        <>
          <View style={{justifyContent:'center',alignItems:'center'}}>
            {/* <Image source={require('../../assets/image/ShopByCategory.png')} style={{height:200,width:370}}/> */}
            
            <FlatList
              data={category}
              keyExtractor={(item, index) => String(index)}
              renderItem={ProductItem}
              numColumns={4}
             
            />
          </View>
        </>
      ) : null}

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

    </SafeAreaView>
  );
};

export default AllCategories;

const styles = StyleSheet.create({});
