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
  import {DataTable, Button} from 'react-native-paper';
  import {useSelector, useDispatch} from 'react-redux';
  import {FlatList} from 'react-native-gesture-handler';
  import NetworkError from '../Common/NetworkError';
  import NetInfo from '@react-native-community/netinfo';
  import {API_BASE_URL} from '../../constants/Url';
  import {PRIMARY_COLOR} from '../../constants/Color';
  
  const WalletHistory = () => {
    const auth_mobile = useSelector(state => state.AuthReducer.mobile);
    const [walletList, setWalletList] = useState([]);
  
    const fetchWalletHistoryAPI = () => {
      var fetchProductAPIURL = API_BASE_URL + `fetchWalletHistory.php`;
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
          setWalletList(response.walletlist);
          console.log(response);
        });
    };
  
    useEffect(() => {
      const unsubscribe = NetInfo.addEventListener(internetState => {
        if (internetState.isConnected === true) {
          fetchWalletHistoryAPI();
        } else {
          setIsInternetConnected(true);
          ToastAndroid.show('Internet Connection Failed', ToastAndroid.SHORT);
        }
      });
      unsubscribe();
    }, [auth_mobile]);
  
    return (
      <SafeAreaView style={{flex: 1}}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <DataTable>
          <FlatList
            data={walletList}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={() =>
              walletList.length > 0 ? (
                <DataTable.Header>
                  <DataTable.Title>Date</DataTable.Title>
                  <DataTable.Title>Amount</DataTable.Title>
                  <DataTable.Title numeric>Remark</DataTable.Title>
                </DataTable.Header>
              ) : null
            }
            renderItem={({item}) => (
              <DataTable.Row>
                <DataTable.Cell>{item.date}</DataTable.Cell>
                <DataTable.Cell>{item.amount}</DataTable.Cell>
                <DataTable.Cell numeric>{item.remark}</DataTable.Cell>
              </DataTable.Row>
            )}
            keyExtractor={item => item.id}
            key={item => item.id}
          />
        </DataTable>
      </SafeAreaView>
    );
  };
  
  export default WalletHistory;
  
  const styles = StyleSheet.create({});
  