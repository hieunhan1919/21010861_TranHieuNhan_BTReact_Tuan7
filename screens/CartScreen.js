import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  SafeAreaView,
  Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import minusImage from '../assets/minus_18.png';
import plusImage from '../assets/plus8.png';
import { useNavigation } from '@react-navigation/native';
import { CartContext } from '../contexts/CartContext';
import emptyCartImage from '../assets/cart-removebg-preview.png';
export default function CartScreen() {
  const { cart, increaseQuantity, decreaseQuantity, removeItem, clearCart } = useContext(CartContext);

  const [modalVisible, setModalVisible] = useState(false);  // Modal for product removal
  const [paymentModalVisible, setPaymentModalVisible] = useState(false); // Modal for payment confirmation
  const [paymentSuccessModalVisible, setPaymentSuccessModalVisible] = useState(false); // Modal for payment success
  const [emptyCartModalVisible, setEmptyCartModalVisible] = useState(false); // Modal for empty cart warning
  const [selectedItem, setSelectedItem] = useState(null);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const navigation = useNavigation();
  useEffect(() => {
    if (modalVisible || paymentModalVisible || paymentSuccessModalVisible || emptyCartModalVisible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [modalVisible, paymentModalVisible, paymentSuccessModalVisible, emptyCartModalVisible, fadeAnim]);

  // Handle decrease button press
  const handleDecreasePress = (item) => {
    if (item.quantity === 1) {
      setSelectedItem(item);
      setModalVisible(true);
    } else if (item.quantity > 1) {
      decreaseQuantity(item.id);
    }
  };

  // Handle checkout press
  const handleCheckoutPress = () => {
    if (cart.length === 0) {
      setEmptyCartModalVisible(true); // Show the empty cart modal if no products are in the cart
    } else {
      setPaymentModalVisible(true); // Show the payment confirmation modal if cart is not empty
    }
  };

  const confirmRemoval = () => {
    if (selectedItem) {
      removeItem(selectedItem.id); // Remove product from cart
      setSelectedItem(null);
      setModalVisible(false);
    }
  };

  const cancelRemoval = () => {
    setSelectedItem(null);
    setModalVisible(false);
  };

  const confirmPayment = () => {
    setPaymentModalVisible(false);
    setPaymentSuccessModalVisible(true); // Show the success modal after payment
  };

  const cancelPayment = () => {
    setPaymentModalVisible(false); // Cancel payment
  };

  const closePaymentSuccess = () => {
    setPaymentSuccessModalVisible(false);
    clearCart(); // Clear the cart when payment is successful
  };

  const closeEmptyCartModal = () => {
    setEmptyCartModalVisible(false); // Close empty cart modal
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>${item.price}</Text>
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity onPress={() => handleDecreasePress(item)} disabled={item.quantity === 0}>
          <Image source={minusImage} style={styles.buttonImage} />
        </TouchableOpacity>
        <Text style={styles.quantity}>{item.quantity}</Text>
        <TouchableOpacity onPress={() => increaseQuantity(item.id)}>
          <Image source={plusImage} style={styles.buttonImage} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={30} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Orders</Text>
        </View>

        {cart.length === 0 ? (
          <View style={styles.emptyCartContainer}>
            <Image source={emptyCartImage} style={styles.emptyCartImage} />
            <Text style={[styles.emptyCartText, { fontSize: '20px' }]}>Your cart is empty.</Text>
          </View>
        ) : (
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCartItem}
          />
        )}

        <View style={styles.footer}>
          <View style={styles.dashedLine} />
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total:</Text>
            <Text style={styles.totalAmount}>$ {total.toFixed(2)}</Text>
          </View>
          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckoutPress}>
            <Text style={styles.checkoutButtonText}>PAY NOW</Text>
          </TouchableOpacity>
        </View>

        {/* Modal for empty cart */}
        <Modal
          transparent={true}
          animationType="none"
          visible={emptyCartModalVisible}
          onRequestClose={closeEmptyCartModal}
        >
          <Animated.View style={[styles.modalBackground, { opacity: fadeAnim }]} >
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Notification!!!</Text>
              <Text style={styles.modalMessage}>You have no orders</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalButton} onPress={closeEmptyCartModal}>
                  <Text style={styles.modalButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </Modal>

        {/* Modal for product removal */}
        <Modal
          transparent={true}
          animationType="none"
          visible={modalVisible}
          onRequestClose={cancelRemoval}
        >
          <Animated.View style={[styles.modalBackground, { opacity: fadeAnim }]} >
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Confirm</Text>
              <Text style={styles.modalMessage}>
                Do you want to cancel your order "{selectedItem ? selectedItem.name : ''}"?
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalButton} onPress={confirmRemoval}>
                  <Text style={styles.modalButtonText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButtonNo} onPress={cancelRemoval}>
                  <Text style={styles.modalButtonTextNo}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </Modal>

        {/* Modal for payment confirmation */}
        <Modal
          transparent={true}
          animationType="none"
          visible={paymentModalVisible}
          onRequestClose={cancelPayment}
        >
          <Animated.View style={[styles.modalBackground, { opacity: fadeAnim }]} >
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Confirm</Text>
              <Text style={styles.modalMessage}>Do you want to pay?</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalButton} onPress={confirmPayment}>
                  <Text style={styles.modalButtonText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButtonNo} onPress={cancelPayment}>
                  <Text style={styles.modalButtonTextNo}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </Modal>

        {/* Modal for payment success */}
        <Modal
          transparent={true}
          animationType="none"
          visible={paymentSuccessModalVisible}
          onRequestClose={closePaymentSuccess}
        >
          <Animated.View style={[styles.modalBackground, { opacity: fadeAnim }]} >
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Confirm</Text>
              <Text style={styles.modalMessage}>Successful payment of ${total.toFixed(2)}!</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalButton} onPress={closePaymentSuccess}>
                  <Text style={styles.modalButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    padding: 10,
    marginLeft: '-3%',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
    flex: 1,
    textAlign: 'left',
  },
  emptyCartContainer: {
    alignItems: 'center',
    marginTop: 5,
  },
  emptyCartImage: {
    width: 250,
    height: 250,
    marginBottom: 5,
  },
  emptyCartText: {
    fontSize: 24,
    color: '#888',
    textAlign: 'center',
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 10,
    alignItems: 'center',
    height: 80,
    borderWidth: 1,
    borderColor: '#cccccc',
    overflow: 'hidden',
  },
  image: {
    width: 80,
    height: 80,
    position: 'absolute',
    left: 0,
    top: 0,
    borderRadius: 10,
  },
  info: {
    flex: 1,
    marginLeft: '30%',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 18,
    color: '#888',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    width: 120,
  },
  buttonImage: {
    width: 20,
    height: 20,
  },
  quantity: {
    marginHorizontal: 10,
    fontSize: 18,
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  dashedLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderStyle: 'dashed',
    width: '100%',
    marginBottom: 10,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 10,
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  checkoutButton: {
    marginBottom: 20,
    backgroundColor: '#ffcc00',
    paddingVertical: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    width: '100%',
    height: 44,
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#fff',
  },
  emptyCartText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginTop: 50,
  },
  // Modal Styles
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    backgroundColor: '#ffcc00',
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  modalButtonNo: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cccccc',
  },
  modalButtonTextNo: {
    color: '#424242',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
