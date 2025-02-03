import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Home from '../Home/Home';
import AllProductList from '../Products/AllProductList';
import Menu from '../Menu/Menu';
import Order from '../Order/Order';
import Offer from '../Products/Offer';
import Notification from '../Notification/Notification';
import IconBadge from 'react-native-icon-badge';
import {useSelector, useDispatch} from 'react-redux';
import {API_BASE_URL} from '../../constants/Url';
import {PRIMARY_COLOR} from '../../constants/Color';

const BottomTabScreen = () => {
  const auth_mobile = useSelector(state => state.AuthReducer.mobile);
  const token = useSelector(state => state.AuthReducer.token);
  const [unReadNotificationCount, setUnReadNotificationCount] = useState(0)

  const apiCall = () => {
    var authAPIURL =
    API_BASE_URL+'fetchCountUnReadNotification.php';
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
        setUnReadNotificationCount(response.unreadnotification)
      })
      .catch(error => {
        console.log('unreadnotification ',error);
      });
  };

  useEffect(() => {
    apiCall()
  }, [auth_mobile])

  const Tab = createMaterialBottomTabNavigator();
  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor={'white'}
      inactiveColor={'white'}
      barStyle={{backgroundColor: PRIMARY_COLOR}}
      screenOptions={({route}) => ({
        tabBarLabel:'',
        tabBarIcon: ({focused, color}) => {
          let iconName;
         
          if (route.name === 'Home') {
            iconName = focused ? 'home-sharp' : 'home-outline';
            return (
              <>
                <Icon
                  name={iconName}
                  size={22}
                  color={'white'}
                  style={{backgroundColor:PRIMARY_COLOR}}
                  allowFontScaling={false}
                />
                <Text style={{fontSize:12,width:100,color:'#fff',textAlign:'center'}}>Home</Text>
              </>
            );
          }
          else if(route.name === 'Offer'){
            iconName = focused
              ? 'ticket-percent'
              : 'ticket-percent-outline';
            return (
              <>
                <MaterialCommunityIcons
                  name={iconName}
                  size={22}
                  color={color}
                  style={{backgroundColor:PRIMARY_COLOR}}
                  allowFontScaling={false}
                />
                 <Text style={{fontSize:12,width:100,color:'#fff',textAlign:'center'}}>Offers</Text>
              </>
            );
          }   
               
          else if (route.name === 'Order') {
            
            iconName = focused ? 'cart' :'cart-outline';
            return (
              <>
                <MaterialCommunityIcons
                  name={iconName}
                  size={22}
                  color={color}
                  style={{backgroundColor:PRIMARY_COLOR}}
                  allowFontScaling={false}
                />
                  <Text style={{fontSize:12,width:100,color:'#fff',textAlign:'center'}}>Order</Text>
                  
              </>
            );
          } else if (route.name === 'Menu') {
            iconName = focused
              ? 'ios-list-circle-sharp'
              : 'ios-list-circle-outline';
            return (
              <>
                <Icon
                  name={iconName}
                  size={22}
                  color={color}
                  style={{backgroundColor:PRIMARY_COLOR}}
                  allowFontScaling={false}
                />
           <Text style={{fontSize:12,width:100,color:'#fff',textAlign:'center'}}>Menu</Text>

              </>
            );
          }
          else if (route.name === 'Notification') {
            iconName = focused
              ? 'notifications-circle-sharp'
              : 'notifications-circle-outline';
            return (
              <>
                {unReadNotificationCount==0 || unReadNotificationCount==undefined?<><Icon color={color} name={iconName} size={24} />
                </>:<IconBadge
                  MainElement={<Icon color={color} name={iconName} size={22} />}
                  BadgeElement={
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 8,
                        padding: 0,
                        margin: 0,
                      }}>
                      {unReadNotificationCount}
                    </Text>
                  }
                  IconBadgeStyle={{
                    position: 'absolute',
                    top: -1,
                    right: -5,
                    backgroundColor: '#000',
                  }}
                  Hidden={unReadNotificationCount == 0 ? 1 : 0 }
                />}
         <Text style={{fontSize:12,width:100,color:'#fff',textAlign:'center'}}>Notification</Text>

              </>
            );
          } 
        },
      })}>
      <Tab.Screen name="Home" component={Home} allowFontScaling={false}/>
      <Tab.Screen name="Offer" component={Offer} allowFontScaling={false} />
      {/* {token ? <Tab.Screen name="Order" component={Order} allowFontScaling={false} /> : null }  */}
      <Tab.Screen name="Order" component={Order} allowFontScaling={false} />
      {/* {token ? <Tab.Screen name="Notification" component={Notification} allowFontScaling={false} />  : null }  */}
      <Tab.Screen name="Notification" component={Notification} allowFontScaling={false} />
      <Tab.Screen name="Menu" component={Menu} allowFontScaling={false} />
    </Tab.Navigator>
  );
};

export default BottomTabScreen;

const styles = StyleSheet.create({});
