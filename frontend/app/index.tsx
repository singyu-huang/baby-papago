import React, { useState, useEffect, useRef, useMemo } from 'react';
import { StyleSheet, View, Keyboard } from 'react-native';
import { Region } from 'react-native-maps';
import * as Location from 'expo-location';
import nearbyFacilities from '../mock/api/location/getNearby.json';
import searchNearbyFacilities from '../mock/api/location/getSearchNearby.json';
import useIcons from '../hooks/useIcons';
import AdvancedSearchSheet from '../components/AdvancedSearchSheet';
import BottomSheet from '@gorhom/bottom-sheet';
import OverviewMap from '../components/OverviewMap';
import LocationButton from '../components/LocationButton';
import SearchBarComponent from '../components/SearchBarComponent';

const App = () => {
  /**
   * 設施 (Facility)
   * 
   * @property {number} facility_id - 設施的唯一識別碼
   * @property {string} facility_name - 設施的名稱
   * @property {string} address - 設施的地址
   * @property {string} space_type - 設施的空間類型
   * @property {number} latitude - 設施所在位置的緯度
   * @property {number} longitude - 設施所在位置的經度
   * @property {React.ComponentType<any> | null} [IconComponent] - 顯示設施類型的 Icon
   */
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 存儲來自 AdvancedSearchSheet 的篩選條件
  const [advancedFilters, setAdvancedFilters] = useState({
    spaceTypes: ['nursing_room', 'family_restroom', 'accessible_restroom'],
    accessMethods: ['open_access', 'registration_required', 'staff_assistance'],
    spaceSizes: ['spacious', 'medium', 'narrow'],
    facilities: [],
  });

  const advancedSearch = {
    sheetRef: useRef<BottomSheet>(null),
    searchBarRef: useRef(null),
    isSheetOpen: useState(false),
  };

  /**
   * 元件載入時執行
   */
  useEffect(() => {
    // 取得使用者當前位置
    getLocation();

    const processedFacilities = processFacilitiesWithIcons(nearbyFacilities);

    // 儲存處理後的設施資料
    setFacilities(processedFacilities);
  }, []);

  // 為設施生成對應的 Icon
  const processFacilitiesWithIcons = (facilities: Facility[]): Facility[] => {
    return facilities.map((facility) => {
      const IconComponent = useIcons(facility.space_type || 'default');
      return {
        ...facility,
        IconComponent,
      };
    });
  };

  /**
   * 按下定位按鈕時，觸發 `getLocation` 來取得使用者當前的位置
   */
  const handleLocationPress = () => {
    getLocation();
  };


  const handleSearchSubmit = (location: string, advancedFilters: any) => {
    setIsSubmitting(true);

    const processedFacilities = processFacilitiesWithIcons(searchNearbyFacilities);
    setFacilities(processedFacilities);

    if (advancedSearch.sheetRef.current) {
      advancedSearch.sheetRef.current.close();
    }

    setTimeout(() => {
      setIsSubmitting(false);
    }, 300);

    // 模擬地點為台北火車站，更新地圖顯示範圍
    setRegion({
      latitude: 25.0478,
      longitude: 121.5171,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });

    setSearch("");
  };

  /**
   * 按下搜尋欄時，開啟進階搜尋的 BottomSheet
   */
  const handleAdvancedSearchBarPress = () => {
    advancedSearch.sheetRef.current?.snapToIndex(0);
  };

  /**
   * 當進階搜尋的 BottomSheet 關閉時執行
   */
  const handleAdvancedSearchSheetClose = () => {
    advancedSearch.sheetRef.current?.close();
    advancedSearch.searchBarRef.current?.blur(); //取消搜尋欄的 focus
  };

  /**
   * 取得使用者當前位置
   */
  const getLocation = async () => {
    // 請求定位權限，若權限未被授予，則顯示錯誤訊息並停止執行
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }

    //若權限被授予，則取得使用者當前位置
    const location = await Location.getCurrentPositionAsync({});

    // 使用獲得的經緯度來更新地圖的區域範圍 (region)
    setRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  return (
    <View style={styles.container}>
      {/* 地圖 */}
      <OverviewMap
        region={region}
        facilities={facilities}
      />

      {/* 搜尋框 */}
      <SearchBarComponent
        value={search}
        onChangeText={setSearch}
        onPress={handleAdvancedSearchBarPress}
        onSubmitEditing={() => handleSearchSubmit(search, advancedFilters)}
        searchBarRef={advancedSearch.searchBarRef}
      />

      {/* 定位按鈕 */}
      <LocationButton onPress={handleLocationPress} />

      {/* 進階搜尋區塊 */}
      <AdvancedSearchSheet
        bottomSheetRef={advancedSearch.sheetRef}
        isSheetOpen={advancedSearch.isSheetOpen[0]}
        handleBottomSheetClose={handleAdvancedSearchSheetClose}
        setAdvancedFilters={setAdvancedFilters}
        isSubmitting={isSubmitting}
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