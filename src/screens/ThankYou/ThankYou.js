import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  Dimensions,
  BackHandler,
  ToastAndroid
} from 'react-native';
import {
  Button,
  Headline,
  Subheading,
  Title,
  TextInput,
} from 'react-native-paper';
import {useIsFocused} from '@react-navigation/native';
import {Rating} from 'react-native-ratings';
import Modal from 'react-native-modal';
import {useSelector, useDispatch} from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import { API_BASE_URL } from '../../constants/Url';
import {PRIMARY_COLOR} from '../../constants/Color';

const ThankYou = ({navigation, route}) => {
  const isVisible = useIsFocused();

  const { orderID } = route.params.params;

  const [isModalVisible, setModalVisible] = useState(true);
  const [feedback, setFeedback] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(1);

  const auth_mobile = useSelector(state => state.AuthReducer.mobile);
  const token = useSelector(state => state.AuthReducer.token);

  function handleBackButtonClick() {
    navigation.reset({
      index: 0,
      routes: [{name: 'Home'}],
      params: {product_id: null},
    });
    return true;
  }

  useEffect(() => {
    setTimeout(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    });
  }, [isVisible]);

  const sendFeedback = () => {
    NetInfo.addEventListener(internetState => {
      if (internetState.isConnected === true) {
        var authAPIURL =
          API_BASE_URL+'addFeedback.php';
        var header = {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        };
        fetch(authAPIURL, {
          method: 'POST',
          headers: header,
          body: JSON.stringify({
            mobile: auth_mobile,
            token: token,
            feedback:feedback,
            feedbackRating:feedbackRating,
            orderID:orderID
          }),
        })
          .then(response => response.json())
          .then(response => {
            ToastAndroid.show(response.msg, ToastAndroid.SHORT);
            setModalVisible(false)
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        ToastAndroid.show('Internet Connection Failed', ToastAndroid.SHORT);
      }
    });
  };

  return (
    <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <ScrollView>
        <View style={{marginHorizontal: 15}}>
          <Image
            source={require('../../assets/image/thank_you.png')}
            style={{
              height: 230,
              width: '80%',
              alignContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              marginVertical: 15,
            }}
          />

          <Modal
            isVisible={isModalVisible}
            onBackdropPress={() => setModalVisible(false)}
            deviceHeight={Dimensions.get('window').height + 100}
            deviceWidth={Dimensions.get('window').width}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                backgroundColor: 'white',
                alignItems: 'center',
                alignSelf: 'center',
                width: '90%',
                minHeight: 300,
                marginVertical: 200,
                borderRadius: 10,
              }}>
              <Title style={{marginBottom: 30}}>Rate our Order</Title>

              <Rating
                type="custom"
                ratingcolor={PRIMARY_COLOR}
                minValue={1}
                ratingCount={5}
                startingValue={1}
                imageSize={35}
                onFinishRating={rating => {
                  setFeedbackRating(rating);
                }}
              />

              <TextInput
                allowFontScaling={false}
                label="Feedback"
                mode="flat"
                placeholder="Enter Feedback"
                underlinecolor={PRIMARY_COLOR}
                // error={true}
                value={feedback}
                onChangeText={feedback => setFeedback(feedback)}
                outlinecolor={PRIMARY_COLOR}
                multiline={true}
                numberOfLines={3}
                style={{
                  color: PRIMARY_COLOR,
                  width: 200,
                  backgroundColor: 'white',
                }}
                theme={{colors: {primary: PRIMARY_COLOR}}}
              />

              <Button
                mode="outlined"
                onPress={() => {
                  sendFeedback();
                }}
                style={{marginVertical: 20, borderColor: PRIMARY_COLOR, width: 100}}
                theme={{colors: {primary: PRIMARY_COLOR}}}>
                Send
              </Button>
            </View>
          </Modal>

          <Headline allowFontScaling={true} style={{textAlign: 'center'}}>
            Congratulations !
          </Headline>
          <Subheading allowFontScaling={true} style={{textAlign: 'center'}}>
            Thank you for your Order. We received your order will being
            processed it soon
          </Subheading>
          <Button
            mode="outlined"
            style={{marginTop: 45, borderColor: PRIMARY_COLOR}}
            theme={{colors: {primary: PRIMARY_COLOR}}}
            onPress={() => navigation.navigate('Order')}>
            Track Your Order
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ThankYou;

const styles = StyleSheet.create({});
