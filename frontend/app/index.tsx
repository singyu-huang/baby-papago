import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const MyMap = () => {
  const [region, setRegion] = useState(null);

  //地標的測試資料
  const markers = [
    {
      id: 1,
      title: "竹中火車站",
      coordinates: { latitude: 24.781322377021244, longitude: 121.0312899066833 },
    },
    {
      id: 2,
      title: "金山街",
      coordinates: {
        latitude: 24.776607710239443,
        longitude: 121.02453073996587,
      },
    },
  ];

  // 取得目前使用者的位置，並設定預設的地圖位置
  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    };

    getLocation();
  }, []);

  return (
    <View style={styles.container}>
      {region && (
        <MapView
          style={styles.map}
          region={region}
          showsUserLocation={true}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default MyMap;