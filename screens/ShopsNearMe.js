import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Modal, Button, TextInput, FlatList, SafeAreaView, Platform } from 'react-native';
import axios from 'axios';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

const ShopsNearMe = ({ navigation }) => {
  const [shops, setShops] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    axios.get('https://67022ea1b52042b542d96150.mockapi.io/shops')
      .then(response => setShops(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleShopPress = (shop) => {
    if (shop.isAvailable) {
      navigation.navigate('DrinksScreen');
    } else {
      setModalVisible(true);
    }
  };

  const filteredShops = shops.filter(shop =>
    shop.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={30} color="#000" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Shops Near Me</Text>

          <TouchableOpacity 
            style={styles.searchButton} 
            onPress={() => setIsSearching(!isSearching)}
          >
            <MaterialIcons name="search" size={30} color="#000" />
          </TouchableOpacity>
        </View>

        {isSearching && (
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            value={searchInput}
            onChangeText={setSearchInput}
          />
        )}

        <ScrollView style={{ width: "100%", height: 500 }}>
          <FlatList
            data={filteredShops}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.shopCard} onPress={() => handleShopPress(item)}>
                <Image source={{ uri: item.image }} style={styles.shopImage} />
                <View style={styles.shopInfo}>
                  <View style={styles.statusAndTime}>
                    <Text style={item.isAvailable ? styles.statusAvailable : styles.statusUnavailable}>
                      <MaterialIcons name={item.isAvailable ? "check-circle" : "lock"} size={16} color={item.isAvailable ? "green" : "red"} />
                      {` ${item.status}`} 
                    </Text>
                    <Text style={styles.deliveryTime}>
                      <FontAwesome name="clock-o" size={16} color="green" />
                      {` ${item.delivery_time}`}
                    </Text>
                    <View style={styles.locationContainer}>
                      <FontAwesome name="map-marker" size={20} color="green" />
                    </View>
                  </View>
                  <Text style={styles.shopName}>{item.name}</Text>
                  <Text style={styles.shopAddress}>{item.address}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </ScrollView>

        {/* Modal for unavailable shop */}
        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Tiệm này đang đóng cửa.</Text>
              <Button title="Đóng" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    marginBottom: 20,  
    paddingTop: Platform.OS === 'android' ? 25 : 0,  // Padding for Android devices
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,  
    textAlign: 'center',
  },
  searchButton: {
    padding: 10,
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
  shopCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 2,
    overflow: 'hidden',
  },
  shopImage: {
    width: '100%',
    height: 150,
  },
  shopInfo: {
    padding: 10,
  },
  shopName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusAndTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  statusAvailable: {
    color: 'green',
    fontSize: 16,
  },
  statusUnavailable: {
    color: 'red',
    fontSize: 16,
  },
  deliveryTime: {
    color: 'red',
    marginLeft: 5,
  },
  locationContainer: {
    position: 'absolute', 
    right: 0,
    top: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  shopAddress: {
    color: '#666',
    marginTop: 5,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default ShopsNearMe;
