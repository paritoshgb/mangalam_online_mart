import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ImageBackground,
  Dimensions,
  ScrollView,
  Alert,
  Linking,
  TouchableOpacity,
 
} from 'react-native';
import {
  Divider,
  List,
  Avatar,
  Title,
  Caption,
  Paragraph,
  TouchableRipple,
  Switch,
  
} from 'react-native-paper';
import {TEXT_PRIMARY_COLOR} from '../../constants/Color';
import * as authActions from '../../store/actions/AuthAction';
import {useSelector, useDispatch} from 'react-redux';
import Share from 'react-native-share';
import {API_BASE_URL} from '../../constants/Url';


const Menu = ({navigation}) => {
  const {name, mobile, isLoggedIn} = useSelector(state => state.AuthReducer);
  const [profileImg, updateProfileImg] = useState(null);
  const dispatch = useDispatch();
  const [refCode, setRefCode] = useState();
  
  const apiCall = () => {
    var authAPIURL = API_BASE_URL + 'fetchProfilePic.php';
    var header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    var authData = {
      mobile: mobile,
    };
    fetch(authAPIURL, {
      method: 'POST',
      headers: header,
      body: JSON.stringify(authData),
    })
      .then(response => response.json())
      .then(response => {
        updateProfileImg(response.data.profilePicturePath);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const fetchWalletAmountAPI = () => {
    var fetchProductAPIURL = API_BASE_URL + `fetchRefCodeByMobileNo.php`;
    var header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    var authData = {
      mobile: mobile,
    };

    fetch(fetchProductAPIURL, {
      method: 'POST',
      headers: header,
      body: JSON.stringify(authData),
    })
      .then(response => response.json())
      .then(response => {
        console.log('refcode', response)

        setRefCode(response.ref_code);
      });
  };

  useEffect(() => {
    apiCall();
    fetchWalletAmountAPI();
  }, [mobile]);

  const shareApp = async () => {
    try {
      const ShareResponse = await Share.open({
        title: 'Grocery App',
        url: '',
        message: isLoggedIn
          ? 'Download now: https://play.google.com/store/apps/details?id=com.groceryapp \nUse My referral code: ' +
            refCode
          : 'Download now: https://play.google.com/store/apps/details?id=com.groceryapp',
      });
    } catch (e) {
      console.log(e);
    }
  };

  const rateApp = () => {
    Linking.openURL('market://details?id=com.groceryapp');
  };

  return (
    <SafeAreaView style={{width:'60%',backgroundColor:'#fff',flex: 1}}>
      <StatusBar backgroundColor={TEXT_PRIMARY_COLOR} />

      <ScrollView>
       
        <View style={styles.userInfoSection}>
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <TouchableOpacity
              onPress={() =>
                isLoggedIn ? navigation.navigate('Profile') : navigation.navigate('Login')
              }>
              {/* <Avatar.Image
                source={{uri: profileImg}}
                size={80}
                style={{backgroundColor: 'white'}}
              /> */}
            </TouchableOpacity>
            <View style={{marginLeft: 15, flexDirection: 'column'}}>
              <Title allowFontScaling={false}>
                Hi, {isLoggedIn ? name : 'User'}
              </Title>
              <Caption style={styles.caption} allowFontScaling={false}>
                {isLoggedIn ? `+91 ${mobile}` : null}
              </Caption>
              <Caption style={[styles.caption,{color:'black',fontWeight:'600'}]} allowFontScaling={false}>
                {isLoggedIn ? `Refcode: ${refCode}` : null}
              </Caption>
            </View>
          </View>
        </View>

        {isLoggedIn ? (
          <>
            <List.Item
              title="Address"
              onPress={() => navigation.navigate('Address')}
              left={props => (
                <List.Icon
                  {...props}
                  icon="map-marker"
                  color={TEXT_PRIMARY_COLOR}
                />
              )}
            />
            <List.Item
              title="Wallet"
              onPress={() => navigation.navigate('Wallet')}
              left={props => (
                <List.Icon
                  {...props}
                  icon="wallet"
                  color={TEXT_PRIMARY_COLOR}
                />
              )}
            />
          </>
        ) : (
          <>
            <List.Item
              title="Address"
              onPress={() => navigation.navigate('Login')}
              left={props => (
                <List.Icon
                  {...props}
                  icon="map-marker"
                  color={TEXT_PRIMARY_COLOR}
                />
              )}
            />
            <List.Item
              title="Wallet"
              onPress={() => navigation.navigate('Login')}
              left={props => (
                <List.Icon
                  {...props}
                  icon="wallet"
                  color={TEXT_PRIMARY_COLOR}
                />
              )}
            />
          </>
        )}
        <List.Item
          title="Share App"
          onPress={() => shareApp()}
          left={props => (
            <List.Icon
              {...props}
              icon="share-variant"
              color={TEXT_PRIMARY_COLOR}
            />
          )}
        />
        <List.Item
          title="Rate App"
          onPress={() => rateApp()}
          left={props => (
            <List.Icon {...props} icon="heart" color={TEXT_PRIMARY_COLOR} />
          )}
        />
        <List.Item
          title="Contact Us"
          onPress={() => navigation.navigate('ContactUs')}
          left={props => (
            <List.Icon {...props} icon="phone" color={TEXT_PRIMARY_COLOR} />
          )}
        />
        {isLoggedIn ? (
          <>
            <List.Item
              title="Logout"
              onPress={() =>
                Alert.alert('Logout', 'Really want to logout?', [
                  {
                    text: 'Cancel',
                    onPress: () => {},
                    style: 'cancel',
                  },
                  {text: 'OK', onPress: () => dispatch(authActions.logout())},
                ])
              }
              left={props => (
                <List.Icon
                  {...props}
                  icon="logout"
                  color={TEXT_PRIMARY_COLOR}
                />
              )}
            />
          </>
        ) : (
          <List.Item
            title="Login"
            onPress={() => navigation.navigate('Login')}
            left={props => (
              <List.Icon
                {...props}
                icon="location-enter"
                color={TEXT_PRIMARY_COLOR}
              />
            )}
          />
        )}
        <Divider />
        <List.Item
          title="About Us"
          onPress={() => navigation.navigate('About')}
          left={props => (
            <List.Icon
              {...props}
              icon="alpha-b-box"
              color={TEXT_PRIMARY_COLOR}
            />
          )}
        />
        <List.Item
          title="Privacy Policy"
          onPress={() => navigation.navigate('PrivacyPolicy')}
          left={props => (
            <List.Icon
              {...props}
              icon="clipboard-flow"
              color={TEXT_PRIMARY_COLOR}
            />
          )}
        />
        <List.Item
          title="Terms & Conditions"
          onPress={() => navigation.navigate('TermsCondition')}
          left={props => (
            <List.Icon
              {...props}
              icon="alpha-t-box"
              color={TEXT_PRIMARY_COLOR}
            />
          )}
        />
        <List.Item
          title="Refund Policy"
          onPress={() => navigation.navigate('RefundPolicy')}
          left={props => (
            <List.Icon
              {...props}
              icon="cash-refund"
              color={TEXT_PRIMARY_COLOR}
            />
          )}
        />
                
      </ScrollView>
    </SafeAreaView>
  );
};

export default Menu;

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 15,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {},
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
