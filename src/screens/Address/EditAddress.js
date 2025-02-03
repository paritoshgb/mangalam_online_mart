//not working
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import {PRIMARY_COLOR} from '../../constants/Color';

import {Picker} from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Ionicons';
import {TextInput, Button, Checkbox} from 'react-native-paper';
const EditAddress = ({address_id}) => {
  console.log(address_id)
  const [checked, setChecked] = React.useState(false);
  // const {
  //   address_id,
  //   houseNo,
  //   area,
  //   landMark,
  //   addressType,
  //   status, 
  //   addressName,
  //   deliveryCharge,
  // } = route.params;
  return (
    <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <ScrollView>
        <View style={{marginHorizontal: 15}}>
          <TextInput
            label="Name"
            mode="flat"
            placeholder="Enter Name"
            underlinecolor={PRIMARY_COLOR}
            // error={true}
            outlinecolor={PRIMARY_COLOR}
            style={{
              color: PRIMARY_COLOR,
              marginVertical: 5,
              backgroundColor: 'white',
            }}
            theme={{colors: {primary: PRIMARY_COLOR}}}
          />
          <TextInput
            label="Address Type"
            mode="flat"
            placeholder="Enter Address Type (Eg. Office Address)"
            underlinecolor={PRIMARY_COLOR}
            // error={true}
            outlinecolor={PRIMARY_COLOR}
            style={{
              color: PRIMARY_COLOR,
              marginVertical: 5,
              backgroundColor: 'white',
            }}
            theme={{colors: {primary: PRIMARY_COLOR}}}
          />
          <TextInput
            label="House Number"
            mode="flat"
            placeholder="Enter House Number"
            underlinecolor={PRIMARY_COLOR}
            // error={true}
            outlinecolor={PRIMARY_COLOR}
            style={{
              color: PRIMARY_COLOR,
              marginVertical: 5,
              backgroundColor: 'white',
            }}
            theme={{colors: {primary: PRIMARY_COLOR}}}
          />

          <TextInput
            label="Land Mark"
            mode="flat"
            placeholder="Enter Land Mark"
            underlinecolor={PRIMARY_COLOR}
            // error={true}
            outlinecolor={PRIMARY_COLOR}
            style={{
              color: PRIMARY_COLOR,
              marginVertical: 5,
              backgroundColor: 'white',
            }}
            theme={{colors: {primary: PRIMARY_COLOR}}}
          />

          <TextInput
            label="City"
            mode="flat"
            placeholder="Enter City"
            underlinecolor={PRIMARY_COLOR}
            // error={true}
            value="Bhandara"
            editable={false}
            outlinecolor={PRIMARY_COLOR}
            style={{
              color: PRIMARY_COLOR,
              backgroundColor: 'white',
            }}
            theme={{colors: {primary: PRIMARY_COLOR}}}
          />

          <TextInput
            label="Pincode"
            mode="flat"
            placeholder="Enter Pincode"
            underlinecolor={PRIMARY_COLOR}
            // error={true}
            value="441904"
            editable={false}
            outlinecolor={PRIMARY_COLOR}
            style={{
              color: PRIMARY_COLOR,
              backgroundColor: 'white',
            }}
            theme={{colors: {primary: PRIMARY_COLOR}}}
          />

          <Picker
            selectedValue={'java'}
            style={{
              borderStyle: 'solid',
              borderWidth: 20,
              color: 'gray',
              marginVertical: 5,
              backgroundColor: 'white',
            }}
            mode="dropdown"
            // onValueChange={(itemValue, itemIndex) =>
            //   setSelectedValue(itemValue)
            // }
          >
            <Picker.Item label="Select Area" value="" />
            <Picker.Item label="Java" value="java" />
            <Picker.Item label="JavaScript" value="js" />
          </Picker>

          <Checkbox.Item
            label="Set as default Address"
            status={checked ? 'checked' : 'unchecked'}
            onPress={() => {
              setChecked(!checked);
            }}
            color={PRIMARY_COLOR}
            theme={{colors: {primary: PRIMARY_COLOR}}}
          />

          <Button
            mode="text"
            onPress={() => console.log('Pressed')}
            style={{marginVertical: 20}}
            theme={{colors: {primary: PRIMARY_COLOR}}}>
            Save Address
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditAddress;

const styles = StyleSheet.create({});
