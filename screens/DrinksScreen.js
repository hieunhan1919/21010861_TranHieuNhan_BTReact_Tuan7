import React, { useEffect, useState, useContext } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Modal,
  Animated,
  TextInput,
  SafeAreaView,
  Platform
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import minusImage from '../assets/minus_18.png'; 
import plusImage from '../assets/plus8.png';  
import { CartContext } from '../contexts/CartContext';

export default function DrinksScreen() {
  const [drinks, setDrinks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false); // State for search input visibility
  const navigation = useNavigation();  

  const { cart, addToCart, decreaseQuantity, removeItem } = useContext(CartContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    axios.get('https://67022ea1b52042b542d96150.mockapi.io/drinks')
      .then(response => setDrinks(response.data))
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    if (modalVisible) {
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
  }, [modalVisible, fadeAnim]);

  const getQuantity = (id) => {
    const item = cart.find(cartItem => cartItem.id === id);
    return item ? item.quantity : 0;
  };

  const handleMinusPress = (item) => {
    const quantity = getQuantity(item.id);
    if (quantity === 1) {
      setSelectedItem(item);
      setModalVisible(true);
    } else if (quantity > 1) {
      decreaseQuantity(item.id);
    }
  };

  const confirmRemoval = () => {
    if (selectedItem) {
      removeItem(selectedItem.id); 
      setSelectedItem(null); 
      setModalVisible(false); 
    }
  };

  const cancelRemoval = () => {
    setSelectedItem(null); 
    setModalVisible(false); 
  };

  const filteredDrinks = drinks.filter(drink =>
    drink.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderDrinkItem = ({ item }) => (
    <View style={styles.drinkItem}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>${item.price}</Text>
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => handleMinusPress(item)}
          disabled={getQuantity(item.id) === 0}
        >
          <Image source={minusImage} style={styles.buttonImage} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => addToCart(item)}>
          <Image source={plusImage} style={styles.buttonImage} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()} // Navigate back to previous screen
          >
            <MaterialIcons name="arrow-back" size={30} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Drinks</Text>
          <TouchableOpacity 
            style={styles.searchButton} 
            onPress={() => setIsSearching(!isSearching)} // Toggle search input visibility
          >
            <MaterialIcons name="search" size={30} color="#000" />
          </TouchableOpacity>
        </View>

        {isSearching && (
          <TextInput
            style={styles.searchInput}
            placeholder="Search drinks..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        )}

        <ScrollView style={{ width: "100%", height: 500 }}>
          <FlatList
            data={filteredDrinks}
            keyExtractor={item => item.id.toString()}
            renderItem={renderDrinkItem}
          />
        </ScrollView>

        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate('CartScreen')}  
        >
          <Text style={styles.cartButtonText}>GO TO CART</Text>
        </TouchableOpacity>

        {/* Confirmation Modal */}
        <Modal
          transparent={true}
          animationType="none"
          visible={modalVisible}
          onRequestClose={cancelRemoval}
        >
          <Animated.View style={[styles.modalBackground, { opacity: fadeAnim }]}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Confirm</Text>
              <Text style={styles.modalMessage}>
                Do you want to cancel "{selectedItem ? selectedItem.name : ''}"?
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
    paddingTop: Platform.OS === 'android' ? 25 : 0,  // Padding for Android devices
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,  
    textAlign: 'left',
  },
  searchButton: {
    padding: 10,
  },
  backButton: {
    padding: 10,
    marginLeft: '-3%',
  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 24,
    backgroundColor: '#fff',
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  drinkItem: {
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
    marginLeft: 90,
    padding: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    color: '#888',
  },
  buttons: {
    flexDirection: 'row',
    width: 100,
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 5,
    borderRadius: 5,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonImage: {
    width: 20,
    height: 20,
  },
  cartButton: {
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
  cartButtonText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#fff',
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
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalButtonTextNo: {
    color: '#424242',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
