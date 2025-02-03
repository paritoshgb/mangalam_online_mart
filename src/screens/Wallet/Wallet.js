import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  DataTable,
  Button,
  TextInput,
  Divider,
  Card,
  Title,
  Avatar,
  IconButton,
  Headline,
} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
import {FlatList} from 'react-native-gesture-handler';
import NetworkError from '../Common/NetworkError';
import NetInfo from '@react-native-community/netinfo';
import {API_BASE_URL, BASE_URL} from '../../constants/Url';
import {PRIMARY_COLOR} from '../../constants/Color';
import RazorpayCheckout from 'react-native-razorpay';
import {useIsFocused} from '@react-navigation/native';

const Wallet = ({navigation}) => {
  const isVisible = useIsFocused();

  const auth_mobile = useSelector(state => state.AuthReducer.mobile);
  const name = useSelector(state => state.AuthReducer.name);

  const [amount, setAmount] = useState(0);
  const [walletAmount, setWalletAmount] = useState(0);
  const [paymentAPIKey, setPaymentAPIKey] = useState(null);
  const [isAPIKeyAvailable, setIsAPIKeyAvailable] = useState(false);

  const [title, setTitle] = useState();
  const [logo, setLogo] = useState();
  const [currency, setCurrency] = useState();

  const onChangeAmount = amount => {
    amount = amount.replace(
      /[`~a-zA-Z !@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,
      '',
    );
    setAmount(amount);
  };

  const fetchWalletAmountAPI = () => {
    var fetchProductAPIURL = API_BASE_URL + `fetchWalletAmountByMobileNo.php`;
    var header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    var authData = {
      mobile: auth_mobile,
    };

    fetch(fetchProductAPIURL, {
      method: 'POST',
      headers: header,
      body: JSON.stringify(authData),
    })
      .then(response => response.json())
      .then(response => {
        setWalletAmount(response.walletamount);
      });
  };

  const fetchPaymentAPIKeyAPI = () => {
    var fetchProductAPIURL = API_BASE_URL + `fetchPaymentAPIKeyByMobileNo.php`;
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
        console.log(response)
        if(response.result == "true"){
          setPaymentAPIKey(response.api_key);
          setIsAPIKeyAvailable(true);
        }else{
          setIsAPIKeyAvailable(false);
        }
      });
  };

  const apiSettingCall = () => {
    var authAPIURL = API_BASE_URL + 'setting.php';
    var header = {
      'Content-Type': 'application/json',
    };
    fetch(authAPIURL, {
      method: 'POST',
      headers: header,
    })
      .then(response => response.json())
      .then(response => {
        setTitle(response.data[0].title);
        setLogo(response.data[0].app_logo);
        setCurrency(response.data[0].currency);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const payNow = () => {
    if (isAPIKeyAvailable) {
      var authAPIURL = API_BASE_URL + 'addWalletAmount.php';
      var header = {
        'Content-Type': 'application/json',
      };

      var options = {
        description: title,
        image: BASE_URL + logo,
        currency: currency,
        key: paymentAPIKey,
        amount: amount * 100,
        name: name,
        prefill: {
          contact: auth_mobile,
          name: name,
        },
        theme: {color: PRIMARY_COLOR},
      };
      RazorpayCheckout.open(options)
        .then(data => {
          fetch(authAPIURL, {
            method: 'POST',
            headers: header,
            body: JSON.stringify({
              mobile: auth_mobile,
              amount: amount
            }),
          })
            .then(response => response.json())
            .then(response => {
              ToastAndroid.show(response.msg, ToastAndroid.SHORT);
              fetchWalletAmountAPI();
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(err => {
          ToastAndroid.show(err.error.description, ToastAndroid.LONG);
        });
    } else {
      ToastAndroid.show('Unable to make Payment', ToastAndroid.SHORT);
    }
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(internetState => {
      if (internetState.isConnected === true) {
        apiSettingCall();
        fetchWalletAmountAPI();
        fetchPaymentAPIKeyAPI();
      } else {
        setIsInternetConnected(true);
        ToastAndroid.show('Internet Connection Failed', ToastAndroid.SHORT);
      }
    });
    unsubscribe();
  }, [isVisible]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={{marginHorizontal: 10}}>
        <Card.Title
          style={{marginVertical: 10}}
          title={walletAmount}
          subtitle="Wallet Amount"
          left={props => (
            <Avatar.Icon
              {...props}
              icon="wallet"
              theme={{colors: {primary: PRIMARY_COLOR}}}
            />
          )}
          right={props => (
            <IconButton
              {...props}
              icon="dots-vertical"
              onPress={() => {
                navigation.navigate('WalletHistory');
              }}
            />
          )}
        />

        {/* <Card>
          <Card.Content>
            <Headline
              style={{
                fontSize: 18,
                marginLeft: 10,
                fontWeight: 'bold',
              }}
              numberOfLines={1}
              allowFontScaling={false}
              adjustsFontSizeToFit>
              Add Amount to wallet
            </Headline>
            <TextInput
              allowFontScaling={false}
              label="Add Amount to wallet"
              mode="flat"
              value={amount.toString()}
              // onChangeText={amount => onChangeAmount(amount)}
              // underlinecolor={PRIMARY_COLOR}
              // outlinecolor={PRIMARY_COLOR}
              editable={false}
              style={{
                color: PRIMARY_COLOR,
                backgroundColor: 'white',
              }}
              // keyboardType="numeric"
              theme={{colors: {primary: PRIMARY_COLOR}}}
              left={<TextInput.Icon name="wallet" size={24} />}
            />

             <Button
              mode="contained"
              style={{marginTop: 30}}
              theme={{colors: {primary: PRIMARY_COLOR}}}
              labelStyle={{color: 'white'}}
              onPress={() => {
                payNow();
              }}>
              Pay Now
            </Button> 
          </Card.Content>
        </Card> */}
      </View>
    </SafeAreaView>
  );
};

export default Wallet;

const styles = StyleSheet.create({});
