import React from 'react';
import {View, Image} from 'react-native';
import {Subheading, Button} from 'react-native-paper';
import {PRIMARY_COLOR} from '../../constants/Color';

const NetworkError = () =>{
    return (
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Image
            source={require('../../assets/image/no_internet.png')}
            style={{width: 150, height: 150}}
          />
          <Subheading
              style={{
                textAlign: 'center',
                marginHorizontal: 60,
                color: '#ccc',
              }}>
              No Internet Connection
            </Subheading>
        </View>
      );
}

export default NetworkError;