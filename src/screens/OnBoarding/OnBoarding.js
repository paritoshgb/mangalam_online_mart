import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import {useSelector, useDispatch} from 'react-redux';
import * as onBoardingAction from '../../store/actions/OnBoardingAction';

const OnBoarding = ({navigation}) => {
    const dispatch = useDispatch()
  return (
    <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <Onboarding
        onSkip={() => {dispatch(onBoardingAction.disabledOnBoarding()),navigation.navigate('BottomTabScreen') }}
        onDone={() => {dispatch(onBoardingAction.disabledOnBoarding()),navigation.navigate('BottomTabScreen') }}
        pages={[
          {
            backgroundColor: '#F8F9FD',
            image: (
              <Image
                source={require('../../assets/image/add_to_cart.png')}
                style={{width:Dimensions.get('window').width-100, height:Dimensions.get('window').height-400}}
              />
            ),
            title: 'Select Grocery Item',
            subtitle: 'select your Grocery product that you want to buy easily',
          },
          {
            backgroundColor: '#F8F9FD',
            image: (
              <Image
                source={require('../../assets/image/order_pay.png')}
                style={{width:Dimensions.get('window').width-100, height:Dimensions.get('window').height-360}}
              />
            ),
            title: 'Easy and Safe Payment',
            subtitle: 'pay for the product you buy safely and easily',
          },
          {
            backgroundColor: '#F8F9FD',
            image: (
              <Image
                source={require('../../assets/image/delivery.png')}
                style={{width:Dimensions.get('window').width-100, height:Dimensions.get('window').height-400}}
              />
            ),
            title: 'Delivery to door step',
            subtitle: 'Your product is delivered to your home safely and securely',
          },
        ]}
      />
    </SafeAreaView>
  );
};

export default OnBoarding;

const styles = StyleSheet.create({});
