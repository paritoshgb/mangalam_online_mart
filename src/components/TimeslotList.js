import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {RadioButton} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
import { API_BASE_URL } from '../constants/Url';
import {PRIMARY_COLOR} from '../constants/Color';

const TimeslotList = () => {
  const [timeslot, setTimeslot] = React.useState();
  const [deliveryDate, setDeliveryDate] = React.useState();
  const [timeslotList, setTimeslotList] = useState([]);
  const [deliveryDateList, setDeliveryDateList] = useState([]);

  const auth_mobile = useSelector(state => state.AuthReducer.mobile);

  const apiTimeslotCall = () => {
    var authAPIURL =
      API_BASE_URL+'fetchTimeslot.php';
    var header = {
      'Content-Type': 'application/json',
    };
    fetch(authAPIURL, {
      method: 'POST',
      headers: header,
      body: JSON.stringify({
        mobile: auth_mobile,
      }),
    })
      .then(response => response.json())
      .then(response => {
        if (response.Result == 'true') {
          setTimeslotList(response.data);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const apiDeliveryDateCall = () => {
    var authAPIURL =
      API_BASE_URL+'fetchDeliveryDates.php';
    var header = {
      'Content-Type': 'application/json',
    };
    fetch(authAPIURL, {
      method: 'POST',
      headers: header,
      body: JSON.stringify({
        mobile: auth_mobile,
      }),
    })
      .then(response => response.json())
      .then(response => {
        if (response.Result == 'true') {
          setDeliveryDateList(response.data);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    apiTimeslotCall();
    apiDeliveryDateCall();
  }, [timeslotList, deliveryDateList]);

  return (
    <View style={{flex: 2, flexDirection: 'row'}}>
      <View style={{flex: 1, alignSelf: 'flex-start'}}>
        <RadioButton.Group
          onValueChange={newValue => setDeliveryDate(newValue)}
          value={deliveryDate}>
          <FlatList
            listKey={1}
            data={deliveryDateList}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <View
                style={{
                  flexDirection: 'row',
                  alignContent: 'center',
                  alignItems: 'center',
                }}>
                <RadioButton
                  value={item.deliveryDate}
                  theme={{colors: {primary: PRIMARY_COLOR}}}
                  color={PRIMARY_COLOR}
                />
                <Text allowFontScaling={false}>{`${item.deliveryDate}`}</Text>
              </View>
            )}
            keyExtractor={item => item.deliveryDate}
            style={{height: 140}}
          />
        </RadioButton.Group>
      </View>
      <View style={{flex: 1, alignSelf: 'flex-end'}}>
        <RadioButton.Group
          onValueChange={newValue => setTimeslot(newValue)}
          value={timeslot}>
          <FlatList
            listKey={2}
            data={timeslotList}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <View
                style={{
                  flexDirection: 'row',
                  alignContent: 'center',
                  alignItems: 'center',
                }}>
                <RadioButton
                  value={item.id}
                  theme={{colors: {primary: PRIMARY_COLOR}}}
                  color={PRIMARY_COLOR}
                />
                <Text
                  allowFontScaling={
                    false
                  }>{`${item.mintime} - ${item.maxtime}`}</Text>
              </View>
            )}
            keyExtractor={item => item.id}
            style={{height: 140}}
          />
        </RadioButton.Group>
      </View>
    </View>
  );
};

export default TimeslotList;

const styles = StyleSheet.create({});
