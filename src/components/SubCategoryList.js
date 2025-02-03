import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import {Card, Subheading, Title, Button, Avatar} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import {PRIMARY_COLOR} from '../constants/Color';

const SubCategoryList = (props) => {
  return (
    <>
      <View
        style={{
          // overflow: 'visible',
          margin: 10,
          width: Dimensions.get('window').width / 5,
        }}>
        <TouchableOpacity
          onPress={() => props.goToSubCategory()}>
          <Avatar.Image
            size={64}
            source={{  
              uri: props.subcategory_img,
            }}
            onPress={() => props.goToSubCategory()}
            style={{
              alignSelf: 'center',
              backgroundColor: '#FADFD3',
              elevation:5
            }}
          />
          <Subheading
          numberOfLines={2}
          allowFontScaling={false}
            style={{
              textAlign: 'center',
              fontSize: 13,
              lineHeight: 16,
              fontWeight:'700'
            }}>
            {props.subcategory_name}
          </Subheading>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default SubCategoryList;

const styles = StyleSheet.create({});
