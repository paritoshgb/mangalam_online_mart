import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  ToastAndroid,
  RefreshControl
} from 'react-native';
import {Button, Subheading} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import CouponList from '../../components/CouponList';
import {useIsFocused} from '@react-navigation/native';

import NetworkError from '../Common/NetworkError';
import NetInfo from '@react-native-community/netinfo';
import {API_BASE_URL} from '../../constants/Url';
import {PRIMARY_COLOR} from '../../constants/Color';

const Coupons = ({navigation}) => {
  // const coupons = useSelector(state => state.CouponReducer.coupons);
  const isVisible = useIsFocused();
  const {name, mobile, isLoggedIn, token} = useSelector(
    state => state.AuthReducer,
  );
  const [couponList, setCouponList] = useState([]);
  const [isInternetConnected, setIsInternetConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [couponMsg, setCouponMsg] = useState('');

  // console.log(coupons.couponlist);

  const [refreshing, setRefreshing] = React.useState(false);

  const apiCouponCall = () => {
    var apiDefaultAddressURL =
    API_BASE_URL+'couponList.php';
    var header = {
      'Content-Type': 'application/json',
    };
    fetch(apiDefaultAddressURL, {
      method: 'POST',
      headers: header,
      body: JSON.stringify({
        mobile: mobile,
        token: token,
      }),
    })
      .then(response => response.json())
      .then(response => {
        setCouponList(response.couponlist);
        setCouponMsg(response.msg);
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const reloadPage = () => {
    setLoading(true);
    setIsInternetConnected(false);
    const unsubscribe = NetInfo.addEventListener(internetState => {
      if (internetState.isConnected === true) {
        apiCouponCall();
      } else {
        setLoading(false);
        setIsInternetConnected(true);
        ToastAndroid.show('Internet Connection Failed', ToastAndroid.SHORT);
      }
    });
    unsubscribe();
  };

  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setLoading(false);
    setIsInternetConnected(false);
    const unsubscribe = NetInfo.addEventListener(internetState => {
      if (internetState.isConnected === true) {
        apiCouponCall();
        ToastAndroid.show('Data Refreshed', ToastAndroid.SHORT);
      } else {
        setLoading(false);
        setIsInternetConnected(true);
        ToastAndroid.show('Internet Connection Failed', ToastAndroid.SHORT);
      }
    });
    unsubscribe();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    setLoading(true);
    setIsInternetConnected(false);
    const unsubscribe = NetInfo.addEventListener(internetState => {
      if (internetState.isConnected === true) {
        apiCouponCall();
      } else {
        setLoading(false);
        setIsInternetConnected(true);
        ToastAndroid.show('Internet Connection Failed', ToastAndroid.SHORT);
      }
    });
    unsubscribe();
  }, [isVisible]);

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

  const renderItem = ({item}) => (
    <CouponList
      coupon_id={item.coupon_id}
      coupon_img={item.coupon_img}
      coupon_date={item.coupon_date}
      coupon_desc={item.coupon_desc}
      coupon_value={item.coupon_value}
      coupon_code={item.coupon_code}
      coupon_title={item.coupon_title}
      min_amt={item.min_amt}
      validity={item.validity}
      goBack={() => navigation.goBack()}
    />
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        </View>
      ) : couponList.length > 0 ? (
        <View style={{marginHorizontal: 15}}>
          <FlatList
            data={couponList}
            renderItem={renderItem}
            keyExtractor={item => item.coupon_id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </View>
      ) : (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: Dimensions.get('window').width + 100,
          }}>
          <Image
            source={require('../../assets/image/address.png')}
            style={{width: 100, height: 100}}
          />
          <Subheading
            style={{
              textAlign: 'center',
              marginHorizontal: 60,
              color: '#ccc',
            }}>
            {couponMsg}
          </Subheading>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Coupons;

const styles = StyleSheet.create({});
