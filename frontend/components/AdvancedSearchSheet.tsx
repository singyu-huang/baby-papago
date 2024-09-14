import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import amenitiesData from '../mock/api/amenities/getAllAmenities.json';

const spaceTypeLabels = {
  nursing_room: '哺乳室',
  family_restroom: '親子廁所',
  accessible_restroom: '無障礙廁所',
};

const spaceSizeLabels = {
  spacious: '寬敞',
  medium: '適中',
  narrow: '狹窄',
};

const accessMethodLabels = {
  open_access: '自由進出',
  registration_required: '需登記',
  staff_assistance: '需專人開鎖',
};

/**
 * AdvancedSearchSheetProps 定義傳遞給 AdvancedSearchSheet Component的屬性
 * 
 * @property {string[]} snapPoints - 定義 BottomSheet 的高度斷點
 * @property {React.RefObject<BottomSheet>} bottomSheetRef - 引用 BottomSheet，用於控制開啟和關閉
 * @property {boolean} isSheetOpen - 用來判斷 BottomSheet 是否處於開啟狀態
 * @property {() => void} handleBottomSheetClose - 關閉 BottomSheet 時呼叫的回調函式
 */
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
  const [selectedSpaceTypes, setSelectedSpaceTypes] = useState<string[]>([]);
  const [selectedAccessMethods, setSelectedAccessMethods] = useState<string[]>([]);
  const [facilitySearch, setFacilitySearch] = useState('');
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [filteredAmenities, setFilteredAmenities] = useState<string[]>([]);
  const [selectedSpaceSizes, setSelectedSpaceSizes] = useState<string[]>([]);

  const backendSpaceTypes: Array<keyof typeof spaceTypeLabels> = ['nursing_room', 'family_restroom', 'accessible_restroom'];
  const backendSpaceSizes: Array<keyof typeof spaceSizeLabels> = ['spacious', 'medium', 'narrow'];
  const backendAccessMethods: Array<keyof typeof accessMethodLabels> = ['open_access', 'registration_required', 'staff_assistance'];

  /**
   * toggleSpaceType 切換選中的空間類型
   * @param {string} type - 空間類型的字串（例如 "nursing_room", "family_restroom"）
   */
  const toggleSpaceType = (type: string) => {
    setSelectedSpaceTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  /**
   * toggleAccessMethod 切換選中的進入方式
   * @param method - 進入方式字串（例如 "open_access", "registration_required"）
   */
  const toggleAccessMethod = (method: string) => {
    setSelectedAccessMethods((prev) =>
      prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]
    );
  };

  /**
   * toggleSpaceSize 切換選中的空間大小
   * @param size - 空間大小的字串（例如 "spacious", "medium", "narrow"）
   */
  const toggleSpaceSize = (size: string) => {
    setSelectedSpaceSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  /**
   * 在設備搜尋框按下「Enter」鍵後，觸發設備搜尋
   */
  const handleFacilitySearch = () => {
    const exactMatch = filteredAmenities.find(
      (amenity) => amenity.toLowerCase() === facilitySearch.toLowerCase()
    );

    // 當找到相符的設備名稱時，新增到選中的設備清單中
    if (exactMatch && !selectedFacilities.includes(exactMatch)) {
      setSelectedFacilities((prev) => [...prev, exactMatch]);
      // 清空搜尋欄位，並清空篩選結果
      setFacilitySearch('');
      setFilteredAmenities([]);
    }
  };

  /**
   * 移除選中的設備標籤
   * @param {string} tag - 要移除的設備標籤
   */
  const removeFacilityTag = (tag: string) => {
    setSelectedFacilities((prev) => prev.filter((f) => f !== tag));
  };

  /**
   * 將選中的設備標籤加入到已選列表中
   * @param {string} amenity - 要加入的設備名稱
   */
  const addAmenityTag = (amenity: string) => {
    if (!selectedFacilities.includes(amenity)) {
      setSelectedFacilities((prev) => [...prev, amenity]);
    }
    setFacilitySearch('');
    setFilteredAmenities([]);
  };

  /**
   * 依照設備搜尋欄輸入的內容，過濾設備列表，並且排除已選擇的設備
   * 當 facilitySearch 或 selectedFacilities 改變時觸發過濾
   */
  useEffect(() => {
    if (facilitySearch.trim()) {
      const filtered = amenitiesData.data
        .filter((amenity) =>
          amenity.toLowerCase().includes(facilitySearch.toLowerCase()) &&
          !selectedFacilities.includes(amenity)
        );
      setFilteredAmenities(filtered);
    } else {
      setFilteredAmenities([]);
    }
  }, [facilitySearch, selectedFacilities]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      enablePanDownToClose={true}
      snapPoints={filteredAmenities.length > 5 ? ['100%'] : ['50%', '90%']}
      onClose={handleBottomSheetClose}
      keyboardBehavior="fillParent"
      keyboardBlurBehavior="restore"
    >
      <BottomSheetView style={styles.bottomSheetContent}>
        {/* 空間類型 */}
        <Text style={styles.sectionTitle}>空間類型</Text>
        <View style={styles.selectionContainer}>
          {backendSpaceTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.optionButton,
                selectedSpaceTypes.includes(type) && styles.optionButtonSelected,
              ]}
              onPress={() => toggleSpaceType(type)}
            >
              <Text style={styles.optionButtonText}>{spaceTypeLabels[type]}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 進入方式 */}
        <Text style={styles.sectionTitle}>進入方式</Text>
        <View style={styles.selectionContainer}>
          {backendAccessMethods.map((method) => (
            <TouchableOpacity
              key={method}
              style={[
                styles.optionButton,
                selectedAccessMethods.includes(method) && styles.optionButtonSelected,
              ]}
              onPress={() => toggleAccessMethod(method)}
            >
              <Text style={styles.optionButtonText}>{accessMethodLabels[method]}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 空間大小 */}
        <Text style={styles.sectionTitle}>空間大小</Text>
        <View style={styles.selectionContainer}>
          {backendSpaceSizes.map((size) => (
            <TouchableOpacity
              key={size}
              style={[
                styles.optionButton,
                selectedSpaceSizes.includes(size) && styles.optionButtonSelected,
              ]}
              onPress={() => toggleSpaceSize(size)}
            >
              <Text style={styles.optionButtonText}>{spaceSizeLabels[size]}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 設備 */}
        <Text style={styles.sectionTitle}>設備</Text>
        <View>
          <View style={styles.inputContainer}>
            {selectedFacilities.map((facility) => (
              <View key={facility} style={styles.tagInInput}>
                <Text style={styles.tagTextInInput}>{facility}</Text>
                <TouchableOpacity onPress={() => removeFacilityTag(facility)}>
                  <Text style={styles.removeTagButtonInInput}>X</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TextInput
              style={styles.textInput}
              placeholder={selectedFacilities.length > 0 ? '' : '輸入設備名稱...'}
              value={facilitySearch}
              onChangeText={setFacilitySearch}
              onSubmitEditing={handleFacilitySearch}
            />
          </View>

          {filteredAmenities.length > 0 && (
            <FlatList
              style={styles.suggestionsList}
              data={filteredAmenities}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.amenityItem}
                  onPress={() => addAmenityTag(item)}
                >
                  <Text>{String(item)}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => String(item)}
            />
          )}
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  selectionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    margin: 5,
  },
  optionButtonSelected: {
    backgroundColor: '#d32f2f',
  },
  optionButtonText: {
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    borderRadius: 5,
    minHeight: 40,
  },
  tagInInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    margin: 3,
    borderRadius: 10,
  },
  tagTextInInput: {
    marginRight: 5,
    fontSize: 14,
  },
  removeTagButtonInInput: {
    color: '#d32f2f',
    fontWeight: 'bold',
  },
  textInput: {
    flex: 1,
    padding: 5,
    fontSize: 16,
  },
  suggestionsList: {
    maxHeight: 150,
    marginTop: 0,
    zIndex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  amenityItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default AdvancedSearchSheet;