import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import {
  List,
  Card,
  Button,
  Title,
  Paragraph,
  Headline,
  Subheading,
  TextInput,
} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
import * as paymentAction from '../store/actions/PaymentAction';
import {PRIMARY_COLOR} from '../constants/Color';

const PaymentList = props => {
  const dispatch = useDispatch();
  const {paymentMethodeId} = useSelector(state => state.PaymentReducer);
  return (
    <>
      {props.status == 1 ? (
        <>
          {props.id == paymentMethodeId ? (
            <Card
              style={{borderRadius: 10, marginBottom: 5, marginHorizontal: 2}}
              elevation={5}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  dispatch(
                    paymentAction.setPaymentMethode(
                      props.id,
                      props.title,
                      props.img,
                      props.api_key,
                      props.description
                    ),
                  );
                  ToastAndroid.show(
                    'Payment Method Selected',
                    ToastAndroid.SHORT,
                  ),
                    props.setIsPaymentMethodeSelect(true);
                }}>
                <List.Item
                  allowFontScaling={false}
                  key={props.id}
                  title={props.title}
                  titleNumberOfLines={1}
                  description={props.description}
                  descriptionNumberOfLines={2}
                  descriptionStyle={{fontSize: 12, textAlign: 'justify'}}
                  titleStyle={{fontSize: 14}}
                  left={() => (
                    <Image
                      source={{
                        uri: props.img,
                      }}
                      style={{
                        width: 60,
                        height: 60,
                        resizeMode: 'contain',
                      }}
                    />
                  )}
                  style={{
                    borderColor: 'green',
                    borderWidth: 1,
                    borderRadius: 10,
                  }}
                />
              </TouchableOpacity>
            </Card>
          ) : (
            <Card
              style={{borderRadius: 10, marginBottom: 5, marginHorizontal: 2}}
              elevation={5}>
              <TouchableOpacity
                onPress={() => {
                  dispatch(
                    paymentAction.setPaymentMethode(
                      props.id,
                      props.title,
                      props.img,
                      props.api_key,
                      props.description
                    ),
                  ),
                    ToastAndroid.show(
                      'Payment Methode Selected',
                      ToastAndroid.SHORT,
                    ),
                    props.setIsPaymentMethodeSelect(true);
                }}>
                <List.Item
                  allowFontScaling={false}
                  key={props.id}
                  title={props.title}
                  titleStyle={{fontSize: 14}}
                  description={props.description}
                  descriptionNumberOfLines={2}
                  descriptionStyle={{fontSize: 12, textAlign: 'justify'}}
                  left={() => (
                    <Image
                      source={{
                        uri: props.img,
                      }}
                      style={{
                        width: 60,
                        height: 60,
                        resizeMode: 'contain',
                      }}
                    />
                  )}
                />
              </TouchableOpacity>
            </Card>
          )}
        </>
      ) : (
        <Card style={{borderRadius: 10, marginBottom: 5}} elevation={5}>
          <TouchableOpacity
            onPress={() => {
              ToastAndroid.show('Coming soon or Working on it', ToastAndroid.SHORT);
            }}>
            <List.Item
              title={props.title}
              titleStyle={{fontSize: 14}}
              style={{backgroundColor: '#eee', borderRadius: 5}}
              description={props.description}
              descriptionNumberOfLines={2}
              descriptionStyle={{fontSize: 12, textAlign: 'justify'}}
              left={() => (
                <Image
                  source={{
                    uri: props.img,
                  }}
                  style={{
                    width: 60,
                    height: 60,
                    resizeMode: 'contain',
                  }}
                />
              )}
            />
          </TouchableOpacity>
        </Card>
      )}
    </>
  );
};

export default PaymentList;

const styles = StyleSheet.create({});
