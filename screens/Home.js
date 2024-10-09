import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import TypeWriter from 'react-native-typewriter';

const Home = ({ navigation }) => {  // Thêm prop navigation vào đây
  const [shops, setShops] = useState([]);
  const [displayTitle, setDisplayTitle] = useState('Welcome to Cafe World'); // State to handle title change

  useEffect(() => {
    // Fetch shops data
    axios.get('https://67022ea1b52042b542d96150.mockapi.io/shops')
      .then(response => {
        setShops(response.data);
      })
      .catch(error => {
        console.log(error);
      });

    // Set interval to update the title
    const interval = setInterval(() => {
      setDisplayTitle(prevTitle => prevTitle === 'Welcome to Cafe World' ? 'Cafe World Awaits You!' : 'Welcome to Cafe World');
    }, 3000); // Change title every 3 seconds

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Function to render the title with the "Cafe World" part in brown
  const renderTitle = (title) => {
    const parts = title.split('Cafe World'); // Split the title into two parts
    return (
      <Text style={styles.title}>
        {parts[0]}
        <Text style={styles.cafeWorld}>Cafe World</Text>
        {parts[1]}
      </Text>
    );
  };

  return (
    <View style={styles.container}>
      {/* Title container with fixed height */}
      <View style={styles.titleContainer}>
        <TypeWriter typing={1} minDelay={100} style={styles.title}>
          {renderTitle(displayTitle)}
        </TypeWriter>
      </View>
      <ScrollView contentContainerStyle={styles.shopList}>
        {shops.slice(0, 3).map((shop) => ( //get 3 shop in shops list
          <View key={shop.id} style={styles.shopContainer}>
            <Image source={{ uri: shop.image }} style={styles.shopImage} />
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('ShopsNearMe')} // Điều hướng đến ShopsNearMe khi bấm
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'space-between', 
    alignItems: 'center',
  },
  titleContainer: {
    height: 60, // Fixed height for the title container
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%', // Full width to avoid shifting of content
    marginTop: '10%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black', // Default color for the rest of the text
  },
  cafeWorld: {
    color: '#8B4513', // Brown color for "Cafe World"
  },
  shopList: {
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1, 
  },
  shopContainer: {
    marginBottom: 20,
  },
  shopImage: {
    width: 300,
    height: 150,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#00c4cc',
    width: 300,  
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',  
    marginBottom: 50,  
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Home;
