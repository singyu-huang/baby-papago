import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard } from 'react-native';
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
 * AdvancedSearchSheetProps 定義傳遞給 AdvancedSearchSheet Component 的屬性
 * 
 * @property {string[]} snapPoints - 定義 BottomSheet 的高度斷點
 * @property {React.RefObject<BottomSheet>} bottomSheetRef - 引用 BottomSheet，用於控制開啟和關閉
 * @property {boolean} isSheetOpen - 用來判斷 BottomSheet 是否處於開啟狀態
 * @property {() => void} handleBottomSheetClose - 關閉 BottomSheet 時呼叫的回調函式
 */
interface AdvancedSearchSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet>;
  isSheetOpen: boolean;
  handleBottomSheetClose: () => void;
  setAdvancedFilters: (filters: any) => void;
  isSubmitting: boolean;
}

const AdvancedSearchSheet: React.FC<AdvancedSearchSheetProps> = ({
  bottomSheetRef,
  handleBottomSheetClose,
  setAdvancedFilters,
  isSubmitting
}) => {
  // 預設選中 哺乳室、親子廁所、無障礙廁所
  const [selectedSpaceTypes, setSelectedSpaceTypes] = useState<string[]>([
    'nursing_room', 'family_restroom', 'accessible_restroom'
  ]);
  // 預設選中 自由進出、需登記、需專人開鎖
  const [selectedAccessMethods, setSelectedAccessMethods] = useState<string[]>([
    'open_access', 'registration_required', 'staff_assistance'
  ]);
  // 預設選中 寬敞、適中、狹窄
  const [selectedSpaceSizes, setSelectedSpaceSizes] = useState<string[]>([
    'spacious', 'medium', 'narrow'
  ]);
  // 預設不選任何設備
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [facilitySearch, setFacilitySearch] = useState('');
  const [filteredAmenities, setFilteredAmenities] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [snapPoints, setSnapPoints] = useState<string[]>(['50%', '80%', '100%']);

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
    setSelectedFacilities((prev) => {
      const updatedFacilities = prev.filter((f) => f !== tag);

      // 當選中的設備少於 10 個時，清除錯誤訊息
      if (updatedFacilities.length < 10) {
        setErrorMessage('');
      }

      return updatedFacilities;
    });
  };

  /**
   * 將選中的設備標籤加入到已選列表中
   * @param {string} amenity - 要加入的設備名稱
   */
  const addAmenityTag = (amenity: string) => {
    if (selectedFacilities.length >= 10) {
      // 設定錯誤訊息
      setErrorMessage('最多只能選擇 10 個設備');
      return;
    }

    setErrorMessage(''); // 如果新增成功則清除錯誤訊息
    if (!selectedFacilities.includes(amenity)) {
      setSelectedFacilities((prev) => [...prev, amenity]);
    }
    setFacilitySearch('');
    setFilteredAmenities([]);
  };

  /**
   * getFilteredAmenities 函數用於返回過濾後的設備列表
   * 
   * 根據當前的搜尋狀態決定要顯示的設備：
   * - 如果 `filteredAmenities` 為空，則返回所有可用的設備（`amenitiesData.data`）
   * - 如果 `filteredAmenities` 不為空，則返回符合搜尋條件的設備
   * 
   * 同時，過濾掉已選中的設備（`selectedFacilities`）
   * 以防止重複顯示已選中的設備標籤
   * 
   * @returns {string[]} - 經過過濾後的設備列表。
   */
  const getFilteredAmenities = () => {
    return (filteredAmenities.length === 0 ? amenitiesData.data : filteredAmenities)
      .filter((amenity) => !selectedFacilities.includes(amenity));
  };

  useEffect(() => {
    const filters = {
      spaceTypes: selectedSpaceTypes,
      accessMethods: selectedAccessMethods,
      spaceSizes: selectedSpaceSizes,
      facilities: selectedFacilities,
    };
    setAdvancedFilters(filters);
  }, [selectedSpaceTypes, selectedAccessMethods, selectedSpaceSizes, selectedFacilities]);

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

  /**
   * 監聽鍵盤顯示與隱藏事件，並根據鍵盤狀態動態更新 snapPoints
   */
  useEffect(() => {
    bottomSheetRef.current?.close();
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      if (!isSubmitting) {
        bottomSheetRef.current?.snapToIndex(0);
      }
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      if (!isSubmitting) {
        bottomSheetRef.current?.snapToIndex(0);
      }
    });

    // 移除事件監聽
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, [isSubmitting]);

/**
 * resetAllOptions 用於重置所有選項狀態，將使用者選取的空間類型、進入方式、空間大小與設施清空為預設值
 */  const resetAllOptions = () => {
    setSelectedSpaceTypes(['nursing_room', 'family_restroom', 'accessible_restroom']);
    setSelectedAccessMethods(['open_access', 'registration_required', 'staff_assistance']);
    setSelectedSpaceSizes(['spacious', 'medium', 'narrow']);
    setSelectedFacilities([]);
    setErrorMessage('');
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      style={styles.bottomSheet}
      index={-1}
      enablePanDownToClose={true}
      snapPoints={snapPoints}
      onClose={handleBottomSheetClose}
      keyboardBehavior="interactive"
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
              <Text style={[
                styles.optionButtonText,
                selectedSpaceTypes.includes(type) && styles.optionButtonSelectedText,
              ]}>{spaceTypeLabels[type]}</Text>
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
              <Text style={[
                styles.optionButtonText,
                selectedAccessMethods.includes(method) && styles.optionButtonSelectedText,
              ]}>{accessMethodLabels[method]}</Text>
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
              <Text style={[
                styles.optionButtonText,
                selectedSpaceSizes.includes(size) && styles.optionButtonSelectedText,
              ]}>{spaceSizeLabels[size]}</Text>
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

          {/* 錯誤訊息 */}
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}


          {/* 顯示推薦的標籤 */}
          <View style={styles.recommendedTagsContainer}>
            {getFilteredAmenities()
              .slice(0, 10)
              .map((amenity) => (
                <TouchableOpacity
                  key={amenity}
                  style={styles.recommendedTag}
                  onPress={() => addAmenityTag(amenity)}
                >
                  <Text>{amenity}</Text>
                </TouchableOpacity>
              ))}
          </View>
        </View>

        {/* 清除重選和確定按鈕 */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={resetAllOptions}
          >
            <Text style={styles.buttonText}>重置</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => {
              handleBottomSheetClose();
            }}
          >
            <Text style={styles.buttonText}>確定</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // iOS 陰影效果
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    // Android 陰影效果
    elevation: 15,
  },
  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
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
    backgroundColor: '#e685b5',
  },
  optionButtonText: {
    color: '#000000',
  },
  optionButtonSelectedText: {
    color: '#ffffff',
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
    backgroundColor: '#e685b5',
    padding: 10,
    margin: 3,
    borderRadius: 10,
  },
  tagTextInInput: {
    color: '#ffffff',
    marginRight: 5,
    fontSize: 14,
  },
  removeTagButtonInInput: {
    color: '#ffffff',
    fontWeight: 'bold',
    paddingHorizontal: 5,
    minWidth: 15,
    textAlign: 'center',
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
  recommendedTagsContainer: {
    marginVertical: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  recommendedTag: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    margin: 5,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingBottom: 20,
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#565e64',
    padding: 15,
    marginRight: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#e685b5',
    padding: 15,
    marginLeft: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdvancedSearchSheet;