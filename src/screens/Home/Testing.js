import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity
} from 'react-native';
import {
    Card,
    Title,
    Paragraph,
    Caption,
    Subheading,
    Divider,
    Headline,
    Avatar,
    Button,
    Searchbar,
    List,
  } from 'react-native-paper';
  import Icon from 'react-native-vector-icons/Ionicons';
import DummyProductList from '../../components/DummyProductList';

const DATA = [
  {
    title: 'Atta',
    product: [
      {
        product_id: '4',
        product_name: 'Cronflour',
        brand_name: 'Cronflour',
        product_description: 'Cronflour',
        pgms_pprice: [
          {
            product_type_price_id: '4_10kg_200',
            product_type: '10kg',
            product_price: '200',
          },
        ],
        discount: '0',
        stock: '1',
        popular: '1',
      },
      {
        product_id: '3',
        product_name: 'Besan',
        brand_name: 'Test Basan',
        product_description: 'Dummy Basan',
        pgms_pprice: [
          {
            product_type_price_id: '3_10kg_120',
            product_type: '10kg',
            product_price: '120',
          },
        ],
        discount: '5',
        stock: '1',
        popular: '1',
      },
      {
        product_id: '2',
        product_name: 'Chakki Atta',
        brand_name: 'Test Atta',
        product_description: 'Fresh atta',
        pgms_pprice: [
          {
            product_type_price_id: '2_5kg_120',
            product_type: '5kg',
            product_price: '120',
          },
          {
            product_type_price_id: '2_10kg_240',
            product_type: '10kg',
            product_price: '240',
          },
          {
            product_type_price_id: '2_30kg_400',
            product_type: '30kg',
            product_price: '400',
          },
        ],
        discount: '0',
        stock: '1',
        popular: '1',
      },
    ],
  },
  {
    title: 'Spices',
    product: [
      {
        product_id: '1058',
        product_name: 'Dummy',
        brand_name: 'Dummy Brand',
        product_description: 'DDD',
        pgms_pprice: [
          {
            product_type_price_id: '1058_100gm_100',
            product_type: '100gm',
            product_price: '100',
          },
        ],
        discount: '0',
        stock: '1',
        popular: '0',
      },
      {
        product_id: '6',
        product_name: 'Turmeric Powder',
        brand_name: 'Turmeric Powder',
        product_description: 'Turmeric Powder',
        pgms_pprice: [
          {
            product_type_price_id: '6_100gm_20',
            product_type: '100gm',
            product_price: '20',
          },
          {
            product_type_price_id: '6_250gm_40',
            product_type: '250gm',
            product_price: '40',
          },
          {
            product_type_price_id: '6_1kg_80',
            product_type: '1kg',
            product_price: '80',
          },
        ],
        discount: '0',
        stock: '1',
        popular: '0',
      },
      {
        product_id: '5',
        product_name: 'pp1',
        brand_name: 'bhandara',
        product_description: 'ggsggggggg',
        pgms_pprice: [
          {
            product_type_price_id: '5_100gm_10',
            product_type: '100gm',
            product_price: '10',
          },
          {
            product_type_price_id: '5_500gm_50',
            product_type: '500gm',
            product_price: '50',
          },
        ],
        discount: '5',
        stock: '1',
        popular: '1',
      },
    ],
  },
  {
    title: 'Rice',
    product: [
      {
        product_id: '23',
        product_name: 'Fortune Hamesha Basmati Rice',
        brand_name: 'Fortune ',
        product_description: 'Fortune Hamesha Basmati Rice',
        pgms_pprice: [
          {
            product_type_price_id: '23_5kg_425',
            product_type: '5kg',
            product_price: '425',
          },
        ],
        discount: '34',
        stock: '1',
        popular: '1',
      },
      {
        product_id: '22',
        product_name: 'Whole Farm Pesticide Free Sonamasuri Rice',
        brand_name: 'Whole Farm',
        product_description: 'Whole Farm Pesticide Free Sonamasuri Rice',
        pgms_pprice: [
          {
            product_type_price_id: '22_5 kg_476',
            product_type: '5 kg',
            product_price: '476',
          },
        ],
        discount: '7',
        stock: '1',
        popular: '1',
      },
    ],
  },
  {
    title: 'Pulses',
    product: [
      {
        product_id: '25',
        product_name: 'Basic Arhar Dal/Toor Dal',
        brand_name: 'Basic',
        product_description: 'Basic Arhar Dal/Toor Dal',
        pgms_pprice: [
          {
            product_type_price_id: '25_1 kg_102',
            product_type: '1 kg',
            product_price: '102',
          },
        ],
        discount: '0',
        stock: '1',
        popular: '1',
      },
      {
        product_id: '24',
        product_name: 'Whole Farm Pesticide Free Moong Dal (Dhuli)',
        brand_name: 'Whole Farm',
        product_description: 'Whole Farm Pesticide Free Moong Dal (Dhuli)',
        pgms_pprice: [
          {
            product_type_price_id: '24_500 g_150',
            product_type: '500 g',
            product_price: '150',
          },
        ],
        discount: '10',
        stock: '1',
        popular: '1',
      },
    ],
  },
  {title: 'Dry fruits', product: []},
  {
    title: 'Ghee',
    product: [
      {
        product_id: '26',
        product_name: 'Dalda Vanaspati Vanaspati',
        brand_name: 'Vanaspati',
        product_description: 'Dalda Vanaspati Vanaspati',
        pgms_pprice: [
          {
            product_type_price_id: '26_1l_400',
            product_type: '1l',
            product_price: '400',
          },
        ],
        discount: '0',
        stock: '1',
        popular: '1',
      },
    ],
  },
  {
    title: 'Chocolate ',
    product: [
      {
        product_id: '8',
        product_name: 'Cadbury 5 Star Home Treat Chocolate',
        brand_name: 'Cadbury 5 Star',
        product_description: 'Cadbury 5 Star Home Treat Chocolate',
        pgms_pprice: [
          {
            product_type_price_id: '8_100_105',
            product_type: '100',
            product_price: '105',
          },
        ],
        discount: '0',
        stock: '1',
        popular: '1',
      },
      {
        product_id: '7',
        product_name: 'Cadbury Dairy Milk Home Treats Chocolate',
        brand_name: 'dairy Milk',
        product_description: 'best Chocolate',
        pgms_pprice: [
          {
            product_type_price_id: '7_1pcs_50',
            product_type: '1pcs',
            product_price: '50',
          },
        ],
        discount: '1',
        stock: '1',
        popular: '1',
      },
    ],
  },
  {
    title: 'Noodles',
    product: [
      {
        product_id: '16',
        product_name: 'Top Ramen Atta Masala Noodles',
        brand_name: 'Top Ramen',
        product_description: 'Top Ramen Atta Masala Noodles',
        pgms_pprice: [
          {
            product_type_price_id: '16_280 g_80',
            product_type: '280 g',
            product_price: '80',
          },
        ],
        discount: '10',
        stock: '1',
        popular: '1',
      },
      {
        product_id: '15',
        product_name: 'Sunfeast Yippee Magic Masala Noodles - Pack of 12',
        brand_name: 'Sunfeast',
        product_description:
          'Sunfeast Yippee Magic Masala Noodles - Pack of 12',
        pgms_pprice: [
          {
            product_type_price_id: '15_12 x 67.5 g_144',
            product_type: '12 x 67.5 g',
            product_price: '144',
          },
        ],
        discount: '18',
        stock: '1',
        popular: '0',
      },
      {
        product_id: '13',
        product_name: 'Maggi Special Masala Noodles',
        brand_name: 'Nestle',
        product_description: 'Maggi Special Masala Noodles',
        pgms_pprice: [
          {
            product_type_price_id: '13_70 g_15',
            product_type: '70 g',
            product_price: '15',
          },
        ],
        discount: '0',
        stock: '1',
        popular: '0',
      },
      {
        product_id: '12',
        product_name: 'Maggi Nutri-licious Atta Noodles',
        brand_name: 'Nestle',
        product_description: 'Maggi Nutri-licious Atta Noodles',
        pgms_pprice: [
          {
            product_type_price_id: '12_72.5 g_24',
            product_type: '72.5 g',
            product_price: '24',
          },
        ],
        discount: '0',
        stock: '1',
        popular: '0',
      },
      {
        product_id: '11',
        product_name: 'Maggi Masala Noodles - Pack of 12 - Brand Offer',
        brand_name: 'Nestle',
        product_description: 'Maggi Masala Noodles - Pack of 12 - Brand Offer',
        pgms_pprice: [
          {
            product_type_price_id: '11_12x70 g_144',
            product_type: '12x70 g',
            product_price: '144',
          },
        ],
        discount: '8',
        stock: '1',
        popular: '1',
      },
    ],
  },
  {
    title: 'gtrhy',
    product: [
      {
        product_id: '1055',
        product_name: 'choki',
        brand_name: 'haldiram',
        product_description: 'hytyh',
        pgms_pprice: [
          {
            product_type_price_id: '1055_1_10',
            product_type: '1',
            product_price: '10',
          },
        ],
        discount: '0',
        stock: '0',
        popular: '0',
      },
      {
        product_id: '19',
        product_name:
          'Nature Protect Disinfectant Fruit & Vegetable Wash (Bottle)',
        brand_name: 'Nature Protect',
        product_description:
          'Nature Protect Disinfectant Fruit & Vegetable Wash (Bottle)',
        pgms_pprice: [
          {
            product_type_price_id: '19_500 ml_199',
            product_type: '500 ml',
            product_price: '199',
          },
        ],
        discount: '15',
        stock: '1',
        popular: '0',
      },
      {
        product_id: '18',
        product_name:
          'Dettol Cleaner for Home, Lime Fresh Disinfectant - Pack of 3',
        brand_name: 'Dettol ',
        product_description:
          'Dettol Cleaner for Home, Lime Fresh Disinfectant - Pack of 3',
        pgms_pprice: [
          {
            product_type_price_id: '18_3x500 ml_579',
            product_type: '3x500 ml',
            product_price: '579',
          },
        ],
        discount: '11',
        stock: '1',
        popular: '0',
      },
      {
        product_id: '17',
        product_name:
          'Savlon Multipurpose Liquid Cleaner Disinfectant (Bottle)',
        brand_name: 'Savlon ',
        product_description:
          'Savlon Multipurpose Liquid Cleaner Disinfectant (Bottle)',
        pgms_pprice: [
          {
            product_type_price_id: '17_500 ml_193',
            product_type: '500 ml',
            product_price: '193',
          },
        ],
        discount: '19',
        stock: '1',
        popular: '0',
      },
      {
        product_id: '10',
        product_name: 'Dettol Original Multi-Use Skin & Surface Wipes',
        brand_name: 'Dettol ',
        product_description: 'Dettol Original Multi-Use Skin & Surface Wipes',
        pgms_pprice: [
          {
            product_type_price_id: '10_40units_129',
            product_type: '40units',
            product_price: '129',
          },
        ],
        discount: '7',
        stock: '1',
        popular: '1',
      },
    ],
  },
];

const Testing = () => {
  const ProductItem = ({item}) => (
    <DummyProductList
      product_id={item.product_id}
      product_name={item.product_name}
      brand_name={item.brand_name}
      product_img={item.product_img}
      discount={item.discount}
      pgms_pprice={item.pgms_pprice}
      product_description={item.product_description}
      popular={item.popular}
      stock={item.stock}
      category={item.category}
      subcategory={item.subcategory}
      category_id={item.category_id}
      subcategory_id={item.subcategory_id}
      banner_img={item.banner_img}
      gotoProductDetails={() => {
        navigation.navigate('ProductDetails', {
          screen: 'ProductDetails',
          product_id: item.product_id,
          product_name: item.product_name,
          brand_name: item.brand_name,
          product_img: item.product_img,
          discount: item.discount,
          pgms_pprice: item.pgms_pprice,
          product_description: item.product_description,
          popular: item.popular,
          stock: item.stock,
          category: item.category,
          subcategory: item.subcategory,
          banner_img: item.banner_img,
        });
      }}
    />
  );

  return (
    <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <FlatList
        data={DATA}
        keyExtractor={(item, index) => String(index)}
        // ListHeaderComponent={(item)=><View><Text>{item.title}</Text></View>}
        renderItem={({item}) => (
          <>
            <View style={{flex: 1, marginLeft: 10}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View style={{justifyContent: 'flex-start'}}>
                  <Headline style={{marginTop: 10, fontSize: 18}}>
                    {item.title}
                  </Headline>
                </View>
                <View style={{justifyContent: 'flex-end'}}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Product')}>
                    <Caption
                      style={{
                        marginRight: 15,
                        marginTop: 15,
                        textAlign: 'right',
                        fontSize: 12,
                      }}>
                      View all{' '}
                      <Icon
                        name="ios-arrow-forward-circle-outline"
                        color="black"
                        size={12}
                      />
                    </Caption>
                  </TouchableOpacity>
                </View>
              </View>
              <FlatList
                horizontal={true}
                keyExtractor={(item, index) => String(index)}
                data={item.product}
                renderItem={ProductItem}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          </>
        )}
      />
    </SafeAreaView>
  );
};

export default Testing;

const styles = StyleSheet.create({});
