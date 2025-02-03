// import React, {useState, useCallback, useEffect} from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   SafeAreaView,
//   StatusBar,
//   Dimensions,
//   Image,
// } from 'react-native';
// import {TouchableOpacity} from 'react-native-gesture-handler';
// import {
//   Card,
//   Title,
//   Paragraph,
//   List,
//   Subheading,
//   TouchableRipple,
//   Button,
//   Headline,
//   Caption,
// } from 'react-native-paper';
// import Icon from 'react-native-vector-icons/Ionicons';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import {useSelector, useDispatch} from 'react-redux';
// import * as cartAction from '../store/actions/CartAction';
// import * as couponAction from '../store/actions/CouponAction';
// import {PRIMARY_COLOR} from '../constants/Color';

// const CartList = props => {
//   // console.log(props);
//   const productTypePriceId = props.product_type_price_id;
//   const dispatch = useDispatch();
//   const [productCount, setProductCount] = useState(props.productQuantity);
 

//   var cartReadyItems = [];
//   cartReadyItems.push(
//     props.product_name,
//     props.product_img,
//     props.discount,
//     props.popular,
//     productTypePriceId,
//     props.combo_amount,
//     props.combo
//   );

//   return (
//     <View style={{marginBottom: 10, marginHorizontal: 5}}>
//       <Card
//         style={{
//           height: Dimensions.get('window').height / 6.2,
//           elevation: 5,
//           borderRadius: 10,
//         }}>
//         <View style={{flex: 1, flexDirection: 'row'}}>
//           <View
//             style={{
//               width: 100,
//             }}>
//             {props.discount > 0 ? (
//               <Text
//                 allowFontScaling={false}
//                 style={{
//                   backgroundColor: 'green',
//                   color: 'white',
//                   width: 65,
//                   borderRadius: 50,
//                   paddingLeft: 8,
//                   position: 'absolute',
//                   top: 3,
//                   left: 5,
//                   zIndex: 999,
//                   fontSize: 12,
//                 }}>
//                 {props.discount}% Off
//               </Text>
//             ) : null}

//             {props.popular == 1 ? (
//               <Text
//                 style={{
//                   color: PRIMARY_COLOR,
//                   paddingLeft: 8,
//                   position: 'absolute',
//                   top: 3,
//                   right: 5,
//                   zIndex: 999,
//                 }}>
//                 <MaterialCommunityIcons name="heart" />
//               </Text>
//             ) : null}
//               <Image
//                 source={{
//                   uri: props.product_img,
//                 }}
//                 style={{height: '100%', borderRadius: 10}}
//               />
//           </View>
//           <View style={{marginLeft: 5}}>
//             <Title style={{fontSize: 16}} allowFontScaling={false} numberOfLines={2}>
//               {props.product_name.length < 28
//                 ? props.product_name
//                 : props.product_name.substring(0, 25) + '...'}
//             </Title>
//             <View
//               style={{flexDirection: 'row', justifyContent: 'space-between'}}>
//               <Subheading
//                 style={{fontSize: 14, letterSpacing: 0}}
//                 allowFontScaling={false}>
//                 <MaterialCommunityIcons
//                   name="currency-inr"
//                   style={{fontSize: 14}}
//                   allowFontScaling={false}
//                 />
//                 <Text allowFontScaling={false}>
//                   {props.discount > 0
//                     ? Math.ceil(
//                         (props.productPrice * (100 - props.discount)) / 100,
//                       )
//                     : props.productPrice}
//                 </Text>

//                 {props.discount > 0 ? (
//                   <Text
//                     style={{fontSize: 11, color: PRIMARY_COLOR}}
//                     allowFontScaling={false}>
//                     {'   '}Save
//                     <MaterialCommunityIcons
//                       name="currency-inr"
//                       style={{fontSize: 11}}
//                     />
//                     {props.productPrice -
//                       Math.ceil(
//                         (props.productPrice * (100 - props.discount)) / 100,
//                       )}
//                   </Text>
//                 ) : null}
//               </Subheading>
//               {props.discount > 0 ? (
//                 <Caption style={{letterSpacing: 0}} allowFontScaling={false}>
//                   MRP :
//                   <MaterialCommunityIcons
//                     name="currency-inr"
//                     style={{fontSize: 12}}
//                   />
//                   <Text>{props.productPrice}</Text>
//                 </Caption>
//               ) : null}
//             </View>

//             <View
//               style={{flexDirection: 'row'}}>
//               <View
//                 style={{
//                   borderRadius: 5,
//                   borderWidth: 1,
//                   width: 100,
//                   marginRight: 5,
//                   borderColor: 'gray',
//                   justifyContent: 'space-between',
//                   alignItems: 'center',
//                   paddingVertical: 5,
//                   paddingHorizontal: 5,
//                   flexDirection: 'row',
//                 }}>
//                 <Text
//                   numberOfLines={1}
//                   allowFontScaling={false}
//                   style={{fontSize: 12}}>
//                   {props.productVariation}
//                 </Text>
//                 {/* <TouchableOpacity>
//                   <Text>
//                     <Icon name="ios-caret-forward-outline" />
//                   </Text>
//                 </TouchableOpacity> */}
//               </View>
//               <View style={{width: 100}}>
//                 <View style={{flex: 3, flexDirection: 'row'}}>
//                   <View style={{flex: 1, alignSelf: 'flex-start'}}>
//                     <Button
//                       allowFontScaling={false}
//                       onPress={() => {
//                         dispatch(cartAction.removeToCart(cartReadyItems));
//                         dispatch(couponAction.emptyCoupon());
//                         setProductCount(productCount - 1);
//                         props.cartProductAPI()
//                       }}
//                       compact="true"
//                       mode="contained"
//                       color={PRIMARY_COLOR}
//                       style={{width: 30, marginLeft: 5}}
//                       disabled={productCount > 0 ? false : true}
//                       labelStyle={{
//                         color: 'white',
//                         marginVertical: 6,
//                         fontSize: 12,
//                         textAlign: 'center',
//                       }}>
//                       -
//                     </Button>
//                   </View>
//                   <View
//                     style={{
//                       alignItems: 'center',
//                     }}>
//                     <Text style={{marginVertical: 5}} allowFontScaling={false}>
//                       {parseInt(productCount)}
//                     </Text>
//                   </View>
//                   <View style={{flex: 1, alignItems: 'flex-end'}}>
//                     <Button
//                       allowFontScaling={false}
//                       compact="true"
//                       mode="contained"
//                       color={PRIMARY_COLOR}
//                       onPress={() => {
                       
//                         dispatch(cartAction.addToCart(cartReadyItems));
//                         setProductCount(productCount + 1);
//                         props.cartProductAPI()
//                       }}
//                       style={{width: 30, marginRight: 5}}
//                       labelStyle={{
//                         color: 'white',
//                         marginVertical: 6,
//                         fontSize: 12,
//                       }}>
//                       +
//                     </Button>
//                   </View>
//                 </View>
//               </View>
//             </View>
//           </View>
//         </View>
        
//       </Card>
//     </View>
//   );
// };

// export default CartList;
