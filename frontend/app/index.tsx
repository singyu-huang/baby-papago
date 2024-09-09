import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, TouchableOpacity } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { SearchBar, Icon } from 'react-native-elements';
import * as Location from 'expo-location';

const App = () => {
  const [region, setRegion] = useState<Region | null>(null);
  const [search, setSearch] = useState('');

  // 地標的測試資料
  const markers = [
    {
      id: 1,
      title: '竹中火車站',
      coordinates: { latitude: 24.781322377021244, longitude: 121.0312899066833 },
    },
    {
      id: 2,
      title: '金山街',
      coordinates: {
        latitude: 24.776607710239443,
        longitude: 121.02453073996587,
      },
    },
  ];

  const handleLocationPress = () => {
    getLocation();
  };

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    console.log(location);
    setRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  // 取得目前使用者的位置，並設定預設的地圖位置
  useEffect(() => {
    getLocation();
  }, []);

  return (
    <View style={styles.container}>
      {region && (
        <MapView
          style={styles.map}
          region={region}
          showsUserLocation
          showsMyLocationButton={false}
        >
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={marker.coordinates}
              title={marker.title}
            />
          ))}
        </MapView>
      )}

      {/* 搜尋按鈕 */}
      <SearchBar
        placeholder="搜尋..."
        // @ts-ignore
        onChangeText={(value) => setSearch(value)}
        value={search}
        containerStyle={styles.searchBarContainer}
        inputContainerStyle={styles.searchBarInputContainer}
        inputStyle={styles.searchBarInput}
      />

      {/* 定位按鈕 */}
      <TouchableOpacity style={styles.locationButton} onPress={handleLocationPress}>
        <Icon name="my-location" style={styles.locationIcon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  searchBarContainer: {
    position: 'absolute',
    top: 10,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  searchBarInputContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    height: 45,
  },
  searchBarInput: {
    color: '#000',
  },
  locationButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 50,
    elevation: 5,
  },
  locationIcon: {
    color: '#3E4958',
    fontSize: 30,
  },
});

export default App;
