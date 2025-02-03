
import DeviceInfo from 'react-native-device-info';

var deviceid=DeviceInfo.getAndroidId()

class CartModel {

  constructor(
    quantity,
    productPrice,
    productVariation,
    sum,
    product_name,
    product_img,
    discount,
    popular,
    productTypePriceId,
    combo_amount ,
    combo,
   
  ) {
    this.quantity = quantity;
    this.productPrice = productPrice;
    this.productVariation = productVariation;
    this.sum = sum;
    this.product_name = product_name;
    this.product_img = product_img;
    this.discount = discount;
    this.popular = popular;
    this.productTypePriceId = productTypePriceId;
    this.combo_amount=combo_amount;
    this.combo=combo;
    this.device_id=deviceid._j;
  }
}

export default CartModel;
