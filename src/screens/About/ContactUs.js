import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Linking,
  TouchableOpacity,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {Card, Headline, List, Subheading} from 'react-native-paper';
import {API_BASE_URL} from '../../constants/Url';
import {PRIMARY_COLOR} from '../../constants/Color';

const ContactUs = () => {
  const [contact, setContact] = useState([]);
  const openLink = url => {
    Linking.openURL(url)
      .then(data => {})
      .catch(() => {});
  };

  const apiCall = () => {
    var authAPIURL = API_BASE_URL + 'appContactList.php';
    var header = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    fetch(authAPIURL, {
      headers: header,
    })
      .then(response => response.json())
      .then(response => {
        setContact(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    apiCall();
  }, []);

  const Item = props => (
    <Card
      style={{marginVertical: 5}}
      onPress={() => {
        props.link ? openLink(props.link) : null;
      }}>
      <List.Section>
        <List.Item
          left={prop => (
            <List.Icon {...prop} icon={props.icon} color={PRIMARY_COLOR} />
          )}
          title={props.title}
          description={props.description}
          titleNumberOfLines={3}
        />
      </List.Section>
    </Card>
  );

  const contactItem = ({item}) => (
    <Item
      id={item.id}
      title={item.title}
      description={item.description}
      link={item.link}
      icon={item.icon}
    />
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <FlatList
        data={contact}
        keyExtractor={(item, index) => String(index)}
        renderItem={contactItem}
      />

      <View
        style={{
          bottom: 0,
          height: 30,
          marginTop: 10,
          backgroundColor: 'white',
        }}>
        {/* <TouchableOpacity
          onPress={() => openLink('https://apksoftwaresolution.com')}>
          <Subheading
            allowFontScaling={false}
            style={{
              textAlign: 'center',
              bottom: 0,
              height: 30,
              color: PRIMARY_COLOR,
              letterSpacing: 0,
            }}>
            Developed by APK Software Solution
          </Subheading>
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
};

export default ContactUs;

const styles = StyleSheet.create({});
