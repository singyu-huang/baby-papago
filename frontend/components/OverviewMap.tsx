import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import MapView, { Marker, Region, PROVIDER_GOOGLE } from 'react-native-maps';

interface Facility {
  facility_id: number;
  facility_name: string;
  address: string;
  space_type: string;
  latitude: number;
  longitude: number;
  IconComponent?: React.ComponentType<any> | null;
}

interface OverviewMapProps {
  region: Region | null;
  facilities: Facility[];
}

const OverviewMap: React.FC<OverviewMapProps> = ({ region, facilities }) => {
  // Move marker style logic here
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
  nursingRoomMarker: {
    backgroundColor: '#d63384',
    borderRadius: 25,
    padding: 10,
    borderWidth: 2,
    borderColor: '#f7d6e6',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
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
});

export default OverviewMap;