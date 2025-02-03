import React from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {Subheading, Button} from 'react-native-paper';
import {PRIMARY_COLOR} from '../../constants/Color';

const NoProduct = () => {
    return (
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Image
            source={require('../../assets/image/no_product.png')}
            style={{width: 150, height: 150}}
          />
          <Subheading
              style={{
                textAlign: 'center',
                marginHorizontal: 60,
                color: '#ccc',
              }}>
              No Product Available
            </Subheading>
        </View>
    )
}

export default NoProduct

const styles = StyleSheet.create({})
