import React, { useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

interface AdvancedSearchSheetProps {
  snapPoints: string[];
  bottomSheetRef: React.RefObject<BottomSheet>;
  isSheetOpen: boolean;
  handleBottomSheetClose: () => void;
}

const AdvancedSearchSheet: React.FC<AdvancedSearchSheetProps> = ({
  snapPoints,
  bottomSheetRef,
  handleBottomSheetClose,
}) => {
  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      enablePanDownToClose={true}
      snapPoints={snapPoints}
      onClose={handleBottomSheetClose}
    >
      <BottomSheetView style={styles.bottomSheetContent}>
        <Text style={styles.bottomSheetText}>進階搜尋區塊</Text>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheetContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSheetText: {
    fontSize: 16,
    color: '#000',
  },
});

export default AdvancedSearchSheet;