import React, { useState, useEffect, useRef, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Region } from 'react-native-maps';
import * as Location from 'expo-location';
import nearbyFacilities from '../mock/api/location/getNearby.json';
import useIcons from '../hooks/useIcons';
import AdvancedSearchSheet from '../components/AdvancedSearchSheet';
import BottomSheet from '@gorhom/bottom-sheet';
import OverviewMap from '../components/OverviewMap';
import LocationButton from '../components/LocationButton';
import SearchBarComponent from '../components/SearchBarComponent';

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

  const advancedSearch = {
    sheetRef: useRef<BottomSheet>(null),
    searchBarRef: useRef(null),
    snapPoints: useMemo(() => ['50%'], []),
    isSheetOpen: useState(false),
  };

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
    setRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  useEffect(() => {
    getLocation();

    const processedFacilities = nearbyFacilities.map((facility) => {
      const IconComponent = useIcons(facility.space_type || 'default');

      return {
        ...facility,
        IconComponent,
      };
    });

    setFacilities(processedFacilities);
  }, []);

  const handleAdvancedSearchBarPress = () => {
    advancedSearch.sheetRef.current?.expand();
    advancedSearch.isSheetOpen[1](true);
  };

  const handleAdvancedSearchSheetClose = () => {
    advancedSearch.sheetRef.current?.close();
    advancedSearch.searchBarRef.current?.blur();
    advancedSearch.isSheetOpen[1](false);
  };

  return (
    <View style={styles.container}>
      <OverviewMap
        region={region}
        facilities={facilities}
      />

      <SearchBarComponent
        value={search}
        onChangeText={setSearch}
        onPress={handleAdvancedSearchBarPress}
        searchBarRef={advancedSearch.searchBarRef}
      />

      <LocationButton onPress={handleLocationPress} />

      <AdvancedSearchSheet
        snapPoints={advancedSearch.snapPoints}
        bottomSheetRef={advancedSearch.sheetRef}
        isSheetOpen={advancedSearch.isSheetOpen[0]}
        handleBottomSheetClose={handleAdvancedSearchSheetClose}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

export default App;