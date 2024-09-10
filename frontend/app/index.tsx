import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { SearchBar, Icon } from 'react-native-elements';
import * as Location from 'expo-location';
import nearbyFacilities from '../mock/api/location/getNearby.json';
import useIcons from '../hooks/useIcons';

const App = () => {
  const [region, setRegion] = useState<Region | null>(null);
  const [search, setSearch] = useState('');
  const [facilities, setFacilities] = useState([]);

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
    const processedFacilities = nearbyFacilities.map((facility) => {
      const IconComponent = useIcons(facility.space_type);
      return { ...facility, IconComponent };
    });
    setFacilities(processedFacilities);
  }, []);

  const getMarkerStyle = (spaceType) => {
    switch (spaceType) {
      case 'nursing_room':
        return styles.nursingRoomMarker;
      case 'family_restroom':
        return styles.familyRestroomMarker;
      case 'accessible_restroom':
        return styles.accessibleRestroomMarker;
      default:
        return styles.defaultMarker;
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {facilities.map((facility) => (
          <Marker
            key={facility.facility_id}
            coordinate={{ latitude: facility.latitude, longitude: facility.longitude }}
            title={facility.facility_name}
            description={facility.address}
            tracksViewChanges={false}
          >
            {facility.IconComponent && (
              <View style={getMarkerStyle(facility.space_type)}>
                <facility.IconComponent width={35} height={35} />
              </View>
            )}
          </Marker>
        ))}
      </MapView>

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
  nursingRoomMarker: {
    backgroundColor: '#d63384',
    borderRadius: 25,
    padding: 10,
    borderWidth: 2,
    borderColor: '#f7d6e6',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50
  },
  familyRestroomMarker: {
    backgroundColor: '#fd7e14',
    borderRadius: 25,
    padding: 10,
    borderWidth: 2,
    borderColor: '#ffe5d0',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
  },
  accessibleRestroomMarker: {
    backgroundColor: '#0d6efd',
    borderRadius: 25,
    padding: 10,
    borderWidth: 2,
    borderColor: '#cfe2ff',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
  },
  defaultMarker: {
    backgroundColor: '#adb5bd',
    borderRadius: 25,
    padding: 10,
    borderWidth: 2,
    borderColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
  }
});

export default App;