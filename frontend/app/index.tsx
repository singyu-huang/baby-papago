import React, { useState, useEffect, useRef, useMemo } from 'react';
import { StyleSheet, View, Keyboard } from 'react-native';
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
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const advancedSearch = {
    sheetRef: useRef<BottomSheet>(null),
    searchBarRef: useRef(null),
    snapPoints: useMemo(() => (keyboardVisible ? ['80%'] : ['50%', '90%']), [keyboardVisible]),
    isSheetOpen: useState(false),
  };

  /**
   * 元件載入時執行
   */
  useEffect(() => {
    // 取得使用者當前位置
    getLocation();

    // 為每個設施生成對應的 Marker Icon Component
    const processedFacilities = nearbyFacilities.map((facility) => {
      const IconComponent = useIcons(facility.space_type || 'default');

      return {
        ...facility,
        IconComponent,
      };
    });

    // 儲存處理後的設施資料
    setFacilities(processedFacilities);
  }, []);

  /**
   * 元件載入時執行，為鍵盤的顯示與隱藏事件加入監聽
   */
  useEffect(() => {
    // 當鍵盤顯示時
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    //  當鍵盤隱藏時
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    // 元件移除時，移除鍵盤顯示與隱藏的監聽
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  /**
   * 按下定位按鈕時，觸發 `getLocation` 來取得使用者當前的位置
   */
  const handleLocationPress = () => {
    getLocation();
  };


  /**
   * 按下搜尋欄時，開啟進階搜尋的 BottomSheet
   */
  const handleAdvancedSearchBarPress = () => {
    advancedSearch.sheetRef.current?.expand(); //展開 BottomSheet
    advancedSearch.isSheetOpen[1](true); //表示 BottomSheet 已開啟
  };

  /**
   * 當進階搜尋的 BottomSheet 關閉時執行
   */
  const handleAdvancedSearchSheetClose = () => {
    advancedSearch.sheetRef.current?.close();
    advancedSearch.searchBarRef.current?.blur(); //取消搜尋欄的 focus
    advancedSearch.isSheetOpen[1](false); //表示 BottomSheet 已關閉
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
        searchBarRef={advancedSearch.searchBarRef}
      />

      {/* 定位按鈕 */}
      <LocationButton onPress={handleLocationPress} />

      {/* 進階搜尋區塊 */}
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