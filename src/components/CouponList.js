import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ToastAndroid,
} from 'react-native';
import {
  Card,
  List,
  Button,
  Chip,
  Headline,
  Subheading,
  Caption,
  Paragraph,
  Title,
} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import * as couponAction from '../store/actions/CouponAction';
import {PRIMARY_COLOR} from '../constants/Color';

const CouponList = props => {
  // console.log(props.coupon_id)
  const dispatch = useDispatch();
  const appliedCoupon = useSelector(state => state.CouponReducer.appliedCoupon);
  const totalAmount = useSelector(state => state.CartReducer.totalAmount);
  
  return (
    <>
      {props.validity == 'Valid' ? (
        <Card
          elevation={5}
          key={props.coupon_id}
          style={{
            marginVertical: 4,
            borderWidth: 1,
            borderRadius:10,
            overflow: 'hidden',
            shadowColor: PRIMARY_COLOR,
            shadowRadius: 10,
            shadowOpacity: 1,
          }}>
          <TouchableOpacity
            onPress={() => {
              parseInt(props.min_amt) <= parseInt(totalAmount)
                ? (dispatch(couponAction.removeApplyCoupon(props)),
                  props.goBack())
                : ToastAndroid.show(
                    `Add ${
                      parseInt(props.min_amt) - parseInt(totalAmount)
                    } more to avail this coupon`,
                    ToastAndroid.SHORT,
                  );
            }}>
            <List.Item
              key={props.coupon_id}
              style={{padding: 0}}
              title={props.coupon_code}
              descriptionNumberOfLines={2}
              titleStyle={{fontWeight: 'bold', color: PRIMARY_COLOR, fontSize: 14}}
              titleNumberOfLines={1}
              descriptionNumberOfLines={2}
              description={() => (
                <View style={{flex: 4, flexDirection: 'row'}}>
                  <Title style={{flex: 3, fontSize: 14}}>
                    {props.coupon_title}
                  </Title>
                  {appliedCoupon.map(item => {
                    if (props.coupon_id == item.coupon_id) {
                      return (
                        <Chip style={{flex: 1.6, marginRight: 5}} selected>
                          Applied
                        </Chip>
                      );
                    } else {
                      return (
                        <Chip style={{flex: 1, marginRight: 5}}>Apply</Chip>
                      );
                    }
                  })}
                </View>
              )}
              left={() => (
                <Image
                  source={{
                    uri: props.coupon_img,
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
          {props.coupon_desc ? (
            <Paragraph
              style={{textAlign: 'justify', fontSize: 12, marginHorizontal: 5}} numberOfLines={2}>
              {props.coupon_desc}
            </Paragraph>
          ) : null}
          <Paragraph style={{paddingHorizontal: 5}}>
            This coupon is valid till date {props.coupon_date}{' '}
          </Paragraph>
        </Card>
      ) : (
        <Card
          elevation={5}
          key={props.coupon_id}
          style={{
            marginVertical: 4,
            borderWidth: 1,
            borderRadius:10,
            overflow: 'hidden',
            shadowColor: PRIMARY_COLOR,
            shadowRadius: 10,
            shadowOpacity: 1,
            backgroundColor: '#eee',
          }}>
          <TouchableOpacity
            onPress={() => {
              ToastAndroid.show('Coupon expired', ToastAndroid.SHORT);
            }}>
            <List.Item
              key={props.coupon_id}
              style={{padding: 0}}
              title={props.coupon_code}
              titleStyle={{fontWeight: 'bold', color: PRIMARY_COLOR, fontSize: 14}}
              titleNumberOfLines={1}
              descriptionNumberOfLines={2}
              description={() => (
                <View style={{flex: 4, flexDirection: 'row'}}>
                  <Title
                    style={{flex: 3, fontSize: 14}}
                    allowFontScaling={false}>
                    {props.coupon_title}
                  </Title>
                </View>
              )}
              left={() => (
                <Image
                  source={{
                    uri: props.coupon_img,
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

          {props.coupon_desc ? (
            <Paragraph
              style={{textAlign: 'justify', fontSize: 12, marginHorizontal: 5}}
              allowFontScaling={false} numberOfLines={2}>
              {props.coupon_desc}
            </Paragraph>
          ) : null}
          <Paragraph style={{paddingHorizontal: 5}} allowFontScaling={false}>
            This coupon is valid till date {props.coupon_date}{' '}
          </Paragraph>
        </Card>
      )}
    </>
  );
};

export default CouponList;

const styles = StyleSheet.create({});
