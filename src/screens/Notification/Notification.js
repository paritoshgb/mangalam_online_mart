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
  ActivityIndicator,
  ToastAndroid,
  RefreshControl,
} from 'react-native';
import {Card, List, Paragraph, Subheading, Button} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useIsFocused} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';

import NetworkError from '../Common/NetworkError';
import NetInfo from '@react-native-community/netinfo';
import {API_BASE_URL} from '../../constants/Url';
import {PRIMARY_COLOR} from '../../constants/Color';

const Notification = ({navigation}) => {
  const isVisible = useIsFocused();
  const auth_mobile = useSelector(state => state.AuthReducer.mobile);
  const token = useSelector(state => state.AuthReducer.token);

  const [notificationList, setNotificationList] = useState([]);
  const [notificationMsg, setNotificationMsg] = useState('');
   const[image,setImage]=useState('')
  const [isInternetConnected, setIsInternetConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = React.useState(false);

  const apiCall = () => {
    var authAPIURL = API_BASE_URL + 'fetchNotificationList.php';
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
        if (response.data.length > 0) {
          setNotificationList(response.data);
          
          setImage(response.data[0].img)
        // console.log("notification",image);
        } else {
          setNotificationMsg(response.msg);
          
        }
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const reloadPage = () => {
    setLoading(true);
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

  useEffect(() => {
    setLoading(true);
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

  const Item = props => (
    <Card
      elevation={5}
      style={{
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginVertical: 5,
        marginHorizontal: 2,
        borderRadius: 10,
      }}>
      <List.Item
        style={{padding: 0}}
        title={props.title}
        titleStyle={{fontSize: 14, fontWeight: '900'}}
        titleNumberOfLines={2}
        description={() => (
          <View style={{marginVertical: 5}}>
             {props.img == null ? null : ( 
              <Image
                source={{uri:props.img}}
                style={{width: '100%', height: 150, borderRadius: 5}}
                onError={(error) => {
                  console.error('Image failed to load:', error);
                }}
              />
            )} 

            <Paragraph
              allowFontScaling={false}
              style={{
                marginTop: 2,
                fontSize: 13,
                textAlign: 'justify',
                paddingHorizontal: 5,
              }}>
              {props.message}
            </Paragraph>
            <Paragraph
              allowFontScaling={false}
              style={{
                marginTop: 5,
                marginRight: 5,
                fontWeight: '100',
                fontSize: 12,
                textAlign: 'right',
              }}>
              {props.date}
            </Paragraph>
          </View>
        )}
        descriptionNumberOfLines={7}
       // titleStyle={{fontWeight: '400'}}
      />
    </Card>
  );

  const renderItem = ({item}) => (
    <Item
      title={item.title}
      message={item.msg}
      date={item.date}
      img={item.img}
    />
  );

  return (
    <SafeAreaView style={{flex: 1}}>
       
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        </View>
      ) : null}
      <View style={{marginHorizontal: 10}}>
        {notificationList.length ? (
          <FlatList
            data={notificationList}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        ) : loading ? null : (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: Dimensions.get('window').width + 100,
            }}>
            <Image
              source={require('../../assets/image/notification.png')}
              style={{width: 100, height: 100}}
            />
            <Subheading
              allowFontScaling={false}
              style={{
                textAlign: 'center',
                marginHorizontal: 60,
                color: '#ccc',
              }}>
              {notificationMsg}
            </Subheading>
          </View>
        )}
      </View>
    
    </SafeAreaView>
  );
};

export default Notification;

const styles = StyleSheet.create({});
