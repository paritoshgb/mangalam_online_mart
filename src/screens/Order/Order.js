import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  ToastAndroid,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {Card, List, Button, Chip, Subheading} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector, useDispatch} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import * as orderAction from '../../store/actions/OrderAction';
import NetworkError from '../Common/NetworkError';
import NetInfo from '@react-native-community/netinfo';
import {API_BASE_URL} from '../../constants/Url';
import {PRIMARY_COLOR} from '../../constants/Color';

const Order = ({navigation}) => {
  const isVisible = useIsFocused();
  const dispatch = useDispatch();

  const auth_mobile = useSelector(state => state.AuthReducer.mobile);
  const token = useSelector(state => state.AuthReducer.token);

  const [orderList, setOrderList] = useState([]);
  const [isOrderListAvailable, setIsOrderListAvailable] = useState(false);
  const [orderMsg, setOrderMsg] = useState('');

  const [isInternetConnected, setIsInternetConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = React.useState(false);

  const apiCall = () => {
    var authAPIURL =
    API_BASE_URL+'orderList.php';
    var header = {
      'Content-Type': 'application/json',
    };
    fetch(authAPIURL, {
      method: 'POST',
      headers: header,
      body: JSON.stringify({
        mobile: auth_mobile,
        token: token,
      }),
    })
      .then(response => response.json())
      .then(response => {
        if (response.orderlist.length > 0) {
          setOrderList(response.orderlist);
          setIsOrderListAvailable(true);
        } else {
          setOrderMsg(response.msg);
          setIsOrderListAvailable(false);
        }
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
      });
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
  }, [isVisible]);

  const reloadPage = () => {
    setLoading(true);
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

  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setLoading(false);
    setIsInternetConnected(false);
    const unsubscribe = NetInfo.addEventListener(internetState => {
      if (internetState.isConnected === true) {
        apiCall();
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
      ) : null}

      {isOrderListAvailable ? (
        <View style={{marginHorizontal: 10}}>
          <FlatList
            data={orderList}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={({item}) => (
              <Card
                elevation={5}
                style={{
                  marginVertical: 5,
                  paddingVertical:5,
                  borderWidth: 1,
                  borderRadius: 10,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    dispatch(orderAction.setOrderId(item.order_id));
                    navigation.navigate('TrackOrder');
                  }}>
                  <List.Item
                    style={{padding: 0}}
                    title={`Order Id : ${item.order_id} `}
                    allowFontScaling={false}
                    titleStyle={{
                      color: PRIMARY_COLOR,
                      marginBottom: 10,
                      fontSize: 14,
                    }}
                    description={() => (
                      <View>
                        <Text allowFontScaling={false}>
                          <MaterialCommunityIcons
                            name="currency-inr"
                            style={{fontSize: 14}}
                          />
                          {item.totalPaidAmt}
                        </Text>
                      </View>
                    )}
                    right={() => (
                      <>
                        <View style={{flexDirection: 'column', 
                              marginRight: 10,}}>
                          <View style={{alignSelf: 'flex-end', marginBottom:5}}>
                            <Text>{item.orderDate}</Text>
                          </View>
                          <Chip
                            theme={{colors: {primary: PRIMARY_COLOR}}}
                            style={{
                              alignSelf: 'flex-end',
                            }}>
                            {item.status == 1
                              ? 'Pending'
                              : item.status == 2
                              ? 'Processing'
                              : item.status == 3
                              ? 'Completed'
                              : item.status == 4
                              ? 'Cancelled'
                              : null}
                          </Chip>
                        </View>
                      </>
                    )}
                  />
                </TouchableOpacity>
              </Card>
            )}
            keyExtractor={item => item.id}
            key={item => item.id}
          />
        </View>
      ) : loading ? null : (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: Dimensions.get('window').width + 100,
          }}>
          <Image
            source={require('../../assets/image/empty_cart.png')}
            style={{width: 100, height: 100}}
          />
          <Subheading
            allowFontScaling={false}
            style={{
              textAlign: 'center',
              marginHorizontal: 60,
              color: '#ccc',
            }}>
            {orderMsg}
          </Subheading>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Order;

const styles = StyleSheet.create({});
