import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import MapView, { Marker, Region, PROVIDER_GOOGLE } from 'react-native-maps';
import { useSpaceTypeDescriptions } from '../hooks/useSpaceTypeDescriptions';

/**
 * Facility 定義設施（Facility）的屬性
 * 
 * @property {number} facility_id - 設施的唯一識別碼
 * @property {string} facility_name - 設施的名稱
 * @property {string} address - 設施的地址
 * @property {string} space_type - 設施的空間類型
 * @property {number} latitude - 設施的緯度座標
 * @property {number} longitude - 設施的經度座標
 * @property {React.ComponentType<any> | null} [IconComponent] - 可選的圖示組件，類型為 React Component 或 null
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

/**
 * OverviewMapProps 定義傳遞給 OverviewMap Component 的屬性
 * 
 * @property {Region | null} region - 定義地圖顯示的區域，若為 null 則無區域設定
 * @property {Facility[]} facilities - 需要在地圖上顯示的設施清單
 */
interface OverviewMapProps {
  region: Region | null;
  facilities: Facility[];
}

/**
 * baseMarkerStyle 地圖標記的基本樣式
 */
const baseMarkerStyle = {
  borderRadius: 25,
  padding: 10,
  borderWidth: 2,
  justifyContent: 'center',
  alignItems: 'center',
  width: 50,
  height: 50,
};

/**
 * OverviewMap 顯示地圖和設施標記的 Component
 * 
 * @param {OverviewMapProps} props - 傳遞給 OverviewMap 的屬性
 * @param {Region | null} props.region - 地圖顯示的區域，如果為 null 則不顯示地圖
 * @param {Facility[]} props.facilities - 需要顯示在地圖上的設施列表
 * 
 * @returns {JSX.Element} 包含地圖和設施標記的視圖
 */
const OverviewMap: React.FC<OverviewMapProps> = ({ region, facilities }) => {
  const spaceTypeDescriptions = useSpaceTypeDescriptions();

  /**
   * 根據設施的空間類型 (spaceType) 獲取相應的地圖標記樣式
   * 
   * @param {string} spaceType - 設施的空間類型
   * @returns {object} 返回包含基本標記樣式與依照 spaceType 設定的自訂樣式
   */
  const getMarkerStyle = (spaceType: string) => {
    const stylesMap: { [key: string]: any } = {
      nursing_room: {
        backgroundColor: '#d63384',
        borderColor: '#f7d6e6',
      },
      family_restroom: {
        backgroundColor: '#fd7e14',
        borderColor: '#ffe5d0',
      },
      accessible_restroom: {
        backgroundColor: '#0d6efd',
        borderColor: '#cfe2ff',
      },
      default: {
        backgroundColor: '#adb5bd',
        borderColor: '#f8f9fa',
      },
    };

    const typeStyle = stylesMap[spaceType] || stylesMap.default;
    return { ...baseMarkerStyle, ...typeStyle };
  };

  return (
    <View style={styles.container}>
      {/* 如果 region 存在，才渲染 MapView，region 為地圖顯示的區域範圍 */}
      {region && (
        <MapView
          style={styles.map}
          region={region}
          provider={PROVIDER_GOOGLE}
          showsUserLocation
          showsMyLocationButton={false}
        >
          {/* 逐一處理設施列表，為每個設施渲染一個 Marker */}
          {facilities.map((facility) => (
            <Marker
              key={facility.facility_id}
              coordinate={{ latitude: facility.latitude, longitude: facility.longitude }}
              title={spaceTypeDescriptions[facility.space_type]}
              description={facility.address}
              tracksViewChanges={false}
            >
              {/* 如果設施有 IconComponent，則顯示該圖示 */}
              {facility.IconComponent && (
                <View style={getMarkerStyle(facility.space_type)}>
                  <facility.IconComponent width={35} height={35} />
                </View>
              )}
            </Marker>
          ))}
        </MapView>
      )}
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
});

export default OverviewMap;