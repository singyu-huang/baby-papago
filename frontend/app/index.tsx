import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker, Region, PROVIDER_GOOGLE } from 'react-native-maps';
import { SearchBar, Icon } from 'react-native-elements';
import * as Location from 'expo-location';
import nearbyFacilities from '../mock/api/location/getNearby.json';
import useIcons from '../hooks/useIcons';

const App = () => {
  interface Facility {
    facility_id: number;
    facility_name: string;
    address: string;
    space_type: string;
    latitude: number;
    longitude: number;
    IconComponent?: React.ComponentType<any> | null;
  }

  const [region, setRegion] = useState<Region | null>(null);
  const [search, setSearch] = useState('');
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isAdvancedVisible, setIsAdvancedVisible] = useState(false);


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

    const processedFacilities: Facility[] = nearbyFacilities.map((facility) => {
      const IconComponent = useIcons(facility.space_type || 'default');

      return {
        ...facility,
        IconComponent,
      };
    });

    setFacilities(processedFacilities);
  }, []);

  const getMarkerStyle = (spaceType: string) => {
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

  const toggleAdvancedSearch = () => {
    setIsAdvancedVisible(!isAdvancedVisible);
  };

  return (
    <View style={styles.container}>
      {region && (
        <MapView
          style={styles.map}
          region={region}
          provider={PROVIDER_GOOGLE}
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
      )}

      {/* 搜尋按鈕 */}
      <SearchBar
        placeholder="輸入地點"
        // @ts-ignore
        onChangeText={(value) => setSearch(value)}
        value={search}
        containerStyle={styles.searchBarContainer}
        inputContainerStyle={styles.searchBarInputContainer}
        inputStyle={styles.searchBarInput}
        onFocus={toggleAdvancedSearch}
      />

      {isAdvancedVisible && (
        <View style={styles.advancedSearchContainer}>
          <Text style={styles.sectionTitle}>常用空間</Text>
          <View style={styles.optionRow}>
            <TouchableOpacity style={styles.optionButton}>
              <Text style={styles.optionText}>哺乳室</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton}>
              <Text style={styles.optionText}>親子廁所</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionTitle}>進入方式</Text>
          <View style={styles.optionRow}>
            <TouchableOpacity style={styles.optionButton}>
              <Text style={styles.optionText}>自由進出</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton}>
              <Text style={styles.optionText}>需登記</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.searchButton}>
              <Text style={styles.searchButtonText}>搜尋</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.clearButton}>
              <Text style={styles.clearButtonText}>清除選項</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

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
  },
  advancedSearchContainer: {
    position: 'absolute',  // 確保懸浮於畫面上
    bottom: 0,             // 將區塊固定在畫面的底部
    left: 0,
    right: 0,
    backgroundColor: 'white', // 白色背景方便查看
    padding: 16,
    borderRadius: 10,
    borderTopLeftRadius: 10,  // 上角圓角
    borderTopRightRadius: 10, // 上角圓角
    shadowColor: '#000',      // 陰影效果，讓它浮於地圖上方
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,            // Android 陰影效果
    zIndex: 10
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  optionButton: {
    backgroundColor: '#f7f7f7',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  optionText: {
    color: '#c21807',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchButton: {
    backgroundColor: '#c21807',
    padding: 12,
    borderRadius: 5,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: '#aaa',
    padding: 12,
    borderRadius: 5,
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
  }
});

export default App;