import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useSelector } from 'react-redux';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PRIMARY_COLOR } from '../constants/Color';
import Icon from 'react-native-vector-icons/Ionicons';
import IconBadge from 'react-native-icon-badge';
import { API_BASE_URL } from '../constants/Url';
import { useNavigation } from '@react-navigation/native';
import AllCategories from '../screens/Products/AllCategories';
import AllSubCategories from '../screens/Products/AllSubCategories';
import ChildSubCategory from '../screens/Products/ChildSubCategory';
import Onboarding from '../screens/OnBoarding/OnBoarding';
import BottomTabScreen from '../screens/BottomTabScreen/BottomTabScreen';
import About from '../screens/About/About';
import AddAddress from '../screens/Address/AddAddress';
import Address from '../screens/Address/Address';
import Cart from '../screens/Cart/Cart';
import ChangePassword from '../screens/Auth/ChangePassword';
import ContactUs from '../screens/About/ContactUs';
import Coupons from '../screens/Coupons/Coupons';
import EditAddress from '../screens/Address/EditAddress';
import ForgetPassword from '../screens/Auth/ForgetPassword';
import Login from '../screens/Auth/Login';
import Otp from '../screens/Auth/Otp';
import PlaceOrder from '../screens/Order/PlaceOrder';
import PlaceOrderStepOne from '../screens/Order/PlaceOrderStepOne';
import PopularProductList from '../screens/Products/PopularProductList';
import PrivacyPolicy from '../screens/About/PrivacyPolicy';
import ProductDetails from '../screens/Products/ProductDetails';
import ProductSearch from '../screens/Products/ProductSearch';
import Profile from '../screens/Profile/Profile';
import RefundPolicy from '../screens/About/RefundPolicy';
import Signup from '../screens/Auth/Signup';
import SubCategory from '../screens/Products/SubCategory';
import TermsCondition from '../screens/About/TermsCondition';
import ThankYou from '../screens/ThankYou/ThankYou';
import TrackOrder from '../screens/Order/TrackOrder';
import Wallet from '../screens/Wallet/Wallet';
import WalletHistory from '../screens/Wallet/WalletHistory';
import AllProductsList from '../screens/Products/AllProductList';

const RootStack = ({ }) => {
  const AppStack = createNativeStackNavigator();
  const navigation = useNavigation();
  const disabledOnBoarding = useSelector(
    state => state.OnBoardingReducer.disabledOnBoarding,
  );
  // console.log(disabledOnBoarding)
  const cartProducts = useSelector(state => state.CartReducer.cartProducts);

  var result = [];
  for (var i in cartProducts) {
    result.push([i, cartProducts[i]]);
  }

  const [headerLogo, setHeaderLogo] = useState();

  const apiCall = () => {
    var authAPIURL = API_BASE_URL + 'fetchHeaderLogo.php';
    var header = {
      'Content-Type': 'application/json',
    };
    fetch(authAPIURL, {
      method: 'POST',
      headers: header,
    })
      .then(response => response.json())
      .then(response => {
        setHeaderLogo(response.data[0]);
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    apiCall();
  }, []);
  return (
    <AppStack.Navigator>
      {!disabledOnBoarding ? (
        <AppStack.Screen
          name="OnBoarding"
          component={Onboarding}
          options={{ headerShown: false }}
        />
      ) : null}

      <AppStack.Screen
        name="BottomTabScreen"
        component={BottomTabScreen}
        options={{
          headerTintColor: PRIMARY_COLOR,
          title: ' ',
          headerStyle: { backgroundColor:'white' },
          headerTitleAlign: 'center',
          headerLeft: () => (
            <View style={{ flexDirection: 'row',justifyContent:'space-between'}}>
             
                
              
              <TouchableOpacity onPress={() => navigation.navigate('ProductSearch')}>
              <Icon
                style={{color:PRIMARY_COLOR,marginTop:2,}}
                name="search"
                backgroundColor='white'
                size={22}
              />
              </TouchableOpacity>
                <Image
                 // source={require('../assets/image/mangalamMart.png')}
                 source={{uri: headerLogo}}
                  style={{
                    width: Dimensions.get('window').width - 150,
                    //height: 10,
                    resizeMode: 'contain',
                    alignItems: 'center',
                    alignContent: 'center',
                    justifyContent: 'center',
                    //flex: 1,
                    flexDirection: 'row',
                    marginLeft:35,
                    // backgroundColor:'#b23820'
                  
                  }}
                />

                <TouchableOpacity onPress={() => navigation.navigate('Wallet')}>
              <Icon
                style={{color:PRIMARY_COLOR,marginTop:2,marginRight:20}}
                name="wallet"
                backgroundColor='white'
                size={24}
              />
              </TouchableOpacity>

            </View>
          ),
          headerRight: () => (
            <View
              style={{
                flexDirection: 'row',
              }}>
              <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
                <IconBadge
                  MainElement={
                    <Icon
                      style={{ color: PRIMARY_COLOR }}
                      name="cart"
                      backgroundColor='white'
                      size={24}
                    />
                  }
                  BadgeElement={
                    <Text style={{ color: '#000000', fontSize: 10 }} size={6}>
                      {result.length}
                    </Text>
                  }
                  IconBadgeStyle={{
                    position: 'absolute',
                    top: 12,
                    right: -5,
                    width: 18,
                    height: 18,
                    borderRadius: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#FFFFFF',
                  }}
                  Hidden={result.length ? 0 : 1}
                />
              </TouchableOpacity>

              
            </View>
          ),
        }}
      />

      <AppStack.Screen
        name="Cart"
        component={Cart}
        allowFontScaling={false}
        adjustsFontSizeToFit
        options={{
          headerTintColor: PRIMARY_COLOR,
          headerStyle: { backgroundColor: 'white' },
          title: 'Cart',
          headerTitleAlign: 'center',
          headerTitleStyle: { fontSize: 17 },
          headerLeft: () => (
            <Icon
              allowFontScaling={false}
              style={{ color: PRIMARY_COLOR, marginLeft: 10 }}
              onPress={() => navigation.goBack()}
              name="ios-arrow-back-sharp"
              backgroundColor="white"
              size={28}
            />
          ),
        }}
      />

      <AppStack.Screen
        name="ProductSearch"
        allowFontScaling={false}
        component={ProductSearch}
        options={{
          headerTintColor: PRIMARY_COLOR,
          headerStyle: { backgroundColor: 'white' },
          title: 'Search Product',
          headerTitleAlign: 'center',
          headerTitleStyle: { fontSize: 17 },
          headerLeft: () => (
            <Icon
              allowFontScaling={false}
              style={{ color: PRIMARY_COLOR, marginLeft: 10 }}
              onPress={() => navigation.goBack()}
              name="ios-arrow-back-sharp"
              backgroundColor="white"
              size={24}
            />
          ),
          headerRight: () => (
            <View
              style={{
                flexDirection: 'row',
              }}>
              <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
                <IconBadge
                  MainElement={
                    <Icon
                      allowFontScaling={false}
                      style={{ color: PRIMARY_COLOR, marginHorizontal: 10 }}
                      name="cart-outline"
                      backgroundColor="white"
                      size={28}
                    />
                  }
                  BadgeElement={
                    <Text
                      style={{ color: '#FFFFFF', fontSize: 10 }}
                      size={6}
                      allowFontScaling={false}>
                      {result.length}
                    </Text>
                  }
                  IconBadgeStyle={{
                    position: 'absolute',
                    top: 12,
                    right: 5,
                    width: 20,
                    height: 20,
                    borderRadius: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#000',
                  }}
                  Hidden={result.length ? 0 : 1}
                />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <AppStack.Screen
        name="SubCategory"
        component={SubCategory}
        options={{
          headerTintColor: PRIMARY_COLOR,
          headerStyle: { backgroundColor: 'white' },
          title: 'Sub Category',
          headerTitleAlign: 'center',
          headerTitleStyle: { fontSize: 17 },
          headerLeft: () => (
            <Icon
              style={{ color: PRIMARY_COLOR, marginLeft: 10 }}
              onPress={() => navigation.goBack()}
              name="ios-arrow-back-sharp"
              backgroundColor="white"
              size={28}
            />
          ),
          headerRight: () => (
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Icon
                allowFontScaling={false}
                style={{ color: PRIMARY_COLOR, marginHorizontal: 1 }}
                onPress={() => navigation.navigate('ProductSearch')}
                name="search-sharp"
                backgroundColor="white"
                size={28}
              />
              <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
                <IconBadge
                  MainElement={
                    <Icon
                      allowFontScaling={false}
                      style={{ color: PRIMARY_COLOR, marginHorizontal: 10 }}
                      name="cart-outline"
                      backgroundColor="white"
                      size={28}
                    />
                  }
                  BadgeElement={
                    <Text
                      style={{ color: '#FFFFFF', fontSize: 10 }}
                      size={6}
                      allowFontScaling={false}>
                      {result.length}
                    </Text>
                  }
                  IconBadgeStyle={{
                    position: 'absolute',
                    top: 12,
                    right: 5,
                    width: 20,
                    height: 20,
                    borderRadius: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#000',
                  }}
                  Hidden={result.length ? 0 : 1}
                />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

<AppStack.Screen
        name="Category_all"
        component={AllCategories}
        options={{
          headerTintColor: PRIMARY_COLOR,
          headerStyle: { backgroundColor: 'white' },
          title: 'All Category',
          headerTitleAlign: 'center',
          headerTitleStyle: { fontSize: 17 },
          headerLeft: () => (
            <Icon
              style={{ color: PRIMARY_COLOR, marginLeft: 10 }}
              onPress={() => navigation.goBack()}
              name="ios-arrow-back-sharp"
              backgroundColor="white"
              size={28}
            />
          ),
          headerRight: () => (
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Icon
                allowFontScaling={false}
                style={{ color: PRIMARY_COLOR, marginHorizontal: 1 }}
                onPress={() => navigation.navigate('ProductSearch')}
                name="search-sharp"
                backgroundColor="white"
                size={28}
              />
              <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
                <IconBadge
                  MainElement={
                    <Icon
                      allowFontScaling={false}
                      style={{ color: PRIMARY_COLOR, marginHorizontal: 10 }}
                      name="cart-outline"
                      backgroundColor="white"
                      size={28}
                    />
                  }
                  BadgeElement={
                    <Text
                      style={{ color: '#FFFFFF', fontSize: 10 }}
                      size={6}
                      allowFontScaling={false}>
                      {result.length}
                    </Text>
                  }
                  IconBadgeStyle={{
                    position: 'absolute',
                    top: 12,
                    right: 5,
                    width: 20,
                    height: 20,
                    borderRadius: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#000',
                  }}
                  Hidden={result.length ? 0 : 1}
                />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <AppStack.Screen
        name="Sub_Category_all"
        component={AllSubCategories}
        options={{
          headerTintColor: PRIMARY_COLOR,
          headerStyle: { backgroundColor: 'white' },
          title: 'All SubCategory',
          headerTitleAlign: 'center',
          headerTitleStyle: { fontSize: 17 },
          headerLeft: () => (
            <Icon
              style={{ color: PRIMARY_COLOR, marginLeft: 10 }}
              onPress={() => navigation.goBack()}
              name="ios-arrow-back-sharp"
              backgroundColor="white"
              size={28}
            />
          ),
          headerRight: () => (
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Icon
                allowFontScaling={false}
                style={{ color: PRIMARY_COLOR, marginHorizontal: 1 }}
                onPress={() => navigation.navigate('ProductSearch')}
                name="search-sharp"
                backgroundColor="white"
                size={28}
              />
              <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
                <IconBadge
                  MainElement={
                    <Icon
                      allowFontScaling={false}
                      style={{ color: PRIMARY_COLOR, marginHorizontal: 10 }}
                      name="cart-outline"
                      backgroundColor="white"
                      size={28}
                    />
                  }
                  BadgeElement={
                    <Text
                      style={{ color: '#FFFFFF', fontSize: 10 }}
                      size={6}
                      allowFontScaling={false}>
                      {result.length}
                    </Text>
                  }
                  IconBadgeStyle={{
                    position: 'absolute',
                    top: 12,
                    right: 5,
                    width: 20,
                    height: 20,
                    borderRadius: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#000',
                  }}
                  Hidden={result.length ? 0 : 1}
                />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <AppStack.Screen
        name="ProductDetails"
        component={ProductDetails}
        allowFontScaling={false}
        options={{
          headerTintColor: PRIMARY_COLOR,
          headerStyle: { backgroundColor: 'white' },
          title: 'Product Details',
          headerTitleAlign: 'center',
          headerTitleStyle: { fontSize: 17 },
          headerLeft: () => (
            <Icon
              allowFontScaling={false}
              style={{ color: PRIMARY_COLOR, marginLeft: 10 }}
              onPress={() => navigation.goBack()}
              name="ios-arrow-back-sharp"
              backgroundColor="white"
              size={28}
            />
          ),
          headerRight: () => (
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Icon
                allowFontScaling={false}
                style={{ color: PRIMARY_COLOR, marginHorizontal: 1 }}
                onPress={() => navigation.navigate('ProductSearch')}
                name="search-sharp"
                backgroundColor="white"
                size={28}
              />
              <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
                <IconBadge
                  MainElement={
                    <Icon
                      allowFontScaling={false}
                      style={{ color: PRIMARY_COLOR, marginHorizontal: 10 }}
                      name="cart-outline"
                      backgroundColor="white"
                      size={28}
                    />
                  }
                  BadgeElement={
                    <Text
                      style={{ color: '#FFFFFF', fontSize: 10 }}
                      size={6}
                      allowFontScaling={false}>
                      {result.length}
                    </Text>
                  }
                  IconBadgeStyle={{
                    position: 'absolute',
                    top: 12,
                    right: 5,
                    width: 20,
                    height: 20,
                    borderRadius: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#000',
                  }}
                  Hidden={result.length ? 0 : 1}
                />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <AppStack.Screen
        name="AllProductsList"
        component={AllProductsList}
        options={{
          headerTintColor: PRIMARY_COLOR,
          headerStyle: { backgroundColor: 'white' },
          title: 'All Products List',
          headerTitleAlign: 'center',
          headerTitleStyle: { fontSize: 17 },
          headerLeft: () => (
            <Icon
              style={{ color: PRIMARY_COLOR, marginLeft: 10 }}
              onPress={() => navigation.goBack()}
              name="ios-arrow-back-sharp"
              backgroundColor="white"
              size={28}
            />
            
          ),
          headerRight: () => (
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Icon
                allowFontScaling={false}
                style={{ color: PRIMARY_COLOR, marginHorizontal: 1 }}
                onPress={() => navigation.navigate('ProductSearch')}
                name="search-sharp"
                backgroundColor="white"
                size={28}
              />
              <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
                <IconBadge
                  MainElement={
                    <Icon
                      allowFontScaling={false}
                      style={{ color: PRIMARY_COLOR, marginHorizontal: 10 }}
                      name="cart-outline"
                      backgroundColor="white"
                      size={28}
                    />
                  }
                  BadgeElement={
                    <Text
                      style={{ color: '#FFFFFF', fontSize: 10 }}
                      size={6}
                      allowFontScaling={false}>
                      {result.length}
                    </Text>
                  }
                  IconBadgeStyle={{
                    position: 'absolute',
                    top: 12,
                    right: 5,
                    width: 20,
                    height: 20,
                    borderRadius: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#000',
                  }}
                  Hidden={result.length ? 0 : 1}
                />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <AppStack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
       {/* <AppStack.Screen
        name="ChildSubCategory"
        component={ChildSubCategory}
        options={{ headerShown: false }}
      /> */}

<AppStack.Screen
        name="ChildSubCategory"
        component={ChildSubCategory}
        options={{
          headerTintColor: PRIMARY_COLOR,
          headerStyle: { backgroundColor: 'white' },
          title: 'All ChildSubCategory List',
          headerTitleAlign: 'center',
          headerTitleStyle: { fontSize: 17 },
          headerLeft: () => (
            <Icon
              style={{ color: PRIMARY_COLOR, marginLeft: 10 }}
              onPress={() => navigation.goBack()}
              name="ios-arrow-back-sharp"
              backgroundColor="white"
              size={28}
            />
          ),
          headerRight: () => (
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Icon
                allowFontScaling={false}
                style={{ color: PRIMARY_COLOR, marginHorizontal: 1 }}
                onPress={() => navigation.navigate('ProductSearch')}
                name="search-sharp"
                backgroundColor="white"
                size={28}
              />
              <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
                <IconBadge
                  MainElement={
                    <Icon
                      allowFontScaling={false}
                      style={{ color: PRIMARY_COLOR, marginHorizontal: 10 }}
                      name="cart-outline"
                      backgroundColor="white"
                      size={28}
                    />
                  }
                  BadgeElement={
                    <Text
                      style={{ color: '#FFFFFF', fontSize: 10 }}
                      size={6}
                      allowFontScaling={false}>
                      {result.length}
                    </Text>
                  }
                  IconBadgeStyle={{
                    position: 'absolute',
                    top: 12,
                    right: 5,
                    width: 20,
                    height: 20,
                    borderRadius: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#000',
                  }}
                  Hidden={result.length ? 0 : 1}
                />
              </TouchableOpacity>
            </View>
          ),
        }}
      />


      <AppStack.Screen
        name="PlaceOrderStepOne"
        component={PlaceOrderStepOne}
        options={{
          headerTintColor: PRIMARY_COLOR,
          headerStyle: { backgroundColor: 'white' },
          title: 'Place Order',
          headerTitleAlign: 'center',
          headerTitleStyle: { fontSize: 17 },
          headerLeft: () => (
            <Icon
              style={{ color: PRIMARY_COLOR, marginLeft: 10 }}
              onPress={() => navigation.goBack()}
              name="ios-arrow-back-sharp"
              backgroundColor="white"
              size={28}
            />
          ),
        }}
      />

      <AppStack.Screen
        name="Signup"
        component={Signup}
        options={{ headerShown: false }}
      />

      <AppStack.Screen
        name="ForgetPassword"
        component={ForgetPassword}
        options={{ headerShown: false }}
      />

      <AppStack.Screen
        name="ContactUs"
        component={ContactUs}
        options={{
          headerTintColor: PRIMARY_COLOR,
          headerStyle: { backgroundColor: 'white' },
          title: 'Contact Us',
          headerTitleAlign: 'center',
          headerTitleStyle: { fontSize: 17 },
          headerLeft: () => (
            <Icon
              style={{ color: PRIMARY_COLOR, marginLeft: 10 }}
              onPress={() => navigation.goBack()}
              name="ios-arrow-back-sharp"
              backgroundColor="white"
              size={28}
            />
          ),
        }}
      />

      <AppStack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicy}
        options={{
          headerTintColor: PRIMARY_COLOR,
          headerStyle: { backgroundColor: 'white' },
          title: 'Privacy Policy',
          headerTitleAlign: 'center',
          headerTitleStyle: { fontSize: 17 },
          headerLeft: () => (
            <Icon
              style={{ color: PRIMARY_COLOR, marginLeft: 10 }}
              onPress={() => navigation.goBack()}
              name="ios-arrow-back-sharp"
              backgroundColor="white"
              size={28}
            />
          ),
        }}
      />

      <AppStack.Screen
        name="About"
        component={About}
        options={{
          headerTintColor: PRIMARY_COLOR,
          headerStyle: { backgroundColor: 'white' },
          title: 'About Us',
          headerTitleAlign: 'center',
          headerTitleStyle: { fontSize: 17 },
          headerLeft: () => (
            <Icon
              style={{ color: PRIMARY_COLOR, marginLeft: 10 }}
              onPress={() => navigation.goBack()}
              name="ios-arrow-back-sharp"
              backgroundColor="white"
              size={28}
            />
          ),
        }}
      />

      <AppStack.Screen
        name="TermsCondition"
        component={TermsCondition}
        options={{
          headerTintColor: PRIMARY_COLOR,
          headerStyle: { backgroundColor: 'white' },
          title: 'Terms & Condition',
          headerTitleAlign: 'center',
          headerTitleStyle: { fontSize: 17 },
          headerLeft: () => (
            <Icon
              style={{ color: PRIMARY_COLOR, marginLeft: 10 }}
              onPress={() => navigation.goBack()}
              name="ios-arrow-back-sharp"
              backgroundColor="white"
              size={28}
            />
          ),
        }}
      />

      <AppStack.Screen
        name="RefundPolicy"
        component={RefundPolicy}
        options={{
          headerTintColor: PRIMARY_COLOR,
          headerStyle: { backgroundColor: 'white' },
          title: 'Return Policy',
          headerTitleAlign: 'center',
          headerTitleStyle: { fontSize: 17 },
          headerLeft: () => (
            <Icon
              style={{ color: PRIMARY_COLOR, marginLeft: 10 }}
              onPress={() => navigation.goBack()}
              name="ios-arrow-back-sharp"
              backgroundColor="white"
              size={28}
            />
          ),
        }}
      />

      <AppStack.Screen
        name="TrackOrder"
        component={TrackOrder}
        options={{
          headerTintColor: PRIMARY_COLOR,
          headerStyle: { backgroundColor: 'white' },
          title: 'Track Order',
          headerTitleAlign: 'center',
          headerTitleStyle: { fontSize: 17 },
          headerLeft: () => (
            <Icon
              style={{ color: PRIMARY_COLOR, marginLeft: 10 }}
              onPress={() => navigation.goBack()}
              name="ios-arrow-back-sharp"
              backgroundColor="white"
              size={28}
            />
          ),
        }}
      />

      <AppStack.Screen
        name="Address"
        component={Address}
        options={{
          headerTintColor: PRIMARY_COLOR,
          headerStyle: { backgroundColor: 'white' },
          title: 'My Address List',
          headerTitleAlign: 'center',
          headerTitleStyle: { fontSize: 17 },
          headerLeft: () => (
            <Icon
              style={{ color: PRIMARY_COLOR, marginLeft: 10 }}
              onPress={() => navigation.goBack()}
              name="ios-arrow-back-sharp"
              backgroundColor="white"
              size={28}
            />
          ),
        }}
      />

      <AppStack.Screen
        name="AddAddress"
        component={AddAddress}
        options={{
          headerTintColor: PRIMARY_COLOR,
          headerStyle: { backgroundColor: 'white' },
          title: 'Add new Address',
          headerTitleAlign: 'center',
          headerTitleStyle: { fontSize: 17 },
          headerLeft: () => (
            <Icon
              style={{ color: PRIMARY_COLOR, marginLeft: 10 }}
              onPress={() => navigation.goBack()}
              name="ios-arrow-back-sharp"
              backgroundColor="white"
              size={28}
            />
          ),
        }}
      />

      <AppStack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{ headerShown: false }}
      />

      <AppStack.Screen
        name="Coupons"
        component={Coupons}
        options={{
          headerTintColor: PRIMARY_COLOR,
          headerStyle: { backgroundColor: 'white' },
          title: 'Apply Coupons',
          headerTitleAlign: 'center',
          headerTitleStyle: { fontSize: 17 },
          headerLeft: () => (
            <Icon
              style={{ color: PRIMARY_COLOR, marginLeft: 10 }}
              onPress={() => navigation.goBack()}
              name="ios-arrow-back-sharp"
              backgroundColor="white"
              size={28}
            />
          ),
        }}
      />

      <AppStack.Screen
        name="Otp"
        component={Otp}
        options={{ headerShown: false }}
      />

      <AppStack.Screen
        name="PlaceOrder"
        component={PlaceOrder}
        options={{
          headerTintColor: PRIMARY_COLOR,
          headerStyle: { backgroundColor: 'white' },
          title: 'Place Order',
          headerTitleAlign: 'center',
          headerTitleStyle: { fontSize: 17 },
          headerLeft: () => (
            <Icon
              style={{ color: PRIMARY_COLOR, marginLeft: 10 }}
              onPress={() => navigation.goBack()}
              name="ios-arrow-back-sharp"
              backgroundColor="white"
              size={28}
            />
          ),
        }}
      />

      <AppStack.Screen
        name="PopularProductList"
        component={PopularProductList}
        options={{
          headerTintColor: PRIMARY_COLOR,
          headerStyle: { backgroundColor: 'white' },
          title: 'Popular Products',
          headerTitleAlign: 'center',
          headerTitleStyle: { fontSize: 17 },
          headerLeft: () => (
            <Icon
              style={{ color: PRIMARY_COLOR, marginLeft: 10 }}
              onPress={() => navigation.goBack()}
              name="ios-arrow-back-sharp"
              backgroundColor="white"
              size={28}
            />
          ),
          headerRight: () => (
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Icon
                allowFontScaling={false}
                style={{ color: PRIMARY_COLOR, marginHorizontal: 1 }}
                onPress={() => navigation.navigate('ProductSearch')}
                name="search-sharp"
                backgroundColor="white"
                size={28}
              />
              <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
                <IconBadge
                  MainElement={
                    <Icon
                      allowFontScaling={false}
                      style={{ color: PRIMARY_COLOR, marginHorizontal: 10 }}
                      name="cart-outline"
                      backgroundColor="white"
                      size={28}
                    />
                  }
                  BadgeElement={
                    <Text
                      style={{ color: '#FFFFFF', fontSize: 10 }}
                      size={6}
                      allowFontScaling={false}>
                      {result.length}
                    </Text>
                  }
                  IconBadgeStyle={{
                    position: 'absolute',
                    top: 12,
                    right: 5,
                    width: 20,
                    height: 20,
                    borderRadius: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#000',
                  }}
                  Hidden={result.length ? 0 : 1}
                />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <AppStack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerTintColor: PRIMARY_COLOR,
          headerStyle: { backgroundColor: 'white' },
          title: 'Profile',
          headerTitleAlign: 'center',
          headerTitleStyle: { fontSize: 17 },
          headerLeft: () => (
            <Icon
              style={{ color: PRIMARY_COLOR, marginLeft: 10 }}
              onPress={() => navigation.goBack()}
              name="ios-arrow-back-sharp"
              backgroundColor="white"
              size={28}
            />
          ),
        }}
      />

      <AppStack.Screen
        name="ThankYou"
        component={ThankYou}
        allowFontScaling={false}
        options={{
          headerTintColor: PRIMARY_COLOR,
          headerStyle: { backgroundColor: 'white' },
          title: 'Thank You',
          headerTitleAlign: 'center',
          headerTitleStyle: { fontSize: 17 },
          headerLeft: () => (
            <Icon
              style={{ color: PRIMARY_COLOR, marginLeft: 10 }}
              onPress={() => navigation.navigate('Home')}
              name="ios-arrow-back-sharp"
              backgroundColor="white"
              size={28}
            />
          ),
        }}
      />

      <AppStack.Screen
        name="WalletHistory"
        component={WalletHistory}
        options={{
          headerTintColor: PRIMARY_COLOR,
          headerStyle: { backgroundColor: 'white' },
          title: 'Wallet History',
          headerTitleAlign: 'center',
          headerTitleStyle: { fontSize: 17 },
          headerLeft: () => (
            <Icon
              style={{ color: PRIMARY_COLOR, marginLeft: 10 }}
              onPress={() => navigation.goBack()}
              name="ios-arrow-back-sharp"
              backgroundColor="white"
              size={28}
            />
          ),
        }}
      />

      <AppStack.Screen
        name="Wallet"
        component={Wallet}
        options={{
          headerTintColor: PRIMARY_COLOR,
          headerStyle: { backgroundColor: 'white' },
          title: 'Wallet',
          headerTitleAlign: 'center',
          headerTitleStyle: { fontSize: 17 },
          headerLeft: () => (
            <Icon
              style={{ color: PRIMARY_COLOR, marginLeft: 10 }}
              onPress={() => navigation.goBack()}
              name="ios-arrow-back-sharp"
              backgroundColor="white"
              size={28}
            />
          ),
        }}
      />
    </AppStack.Navigator>
  );
};

export default RootStack;

const styles = StyleSheet.create({});
