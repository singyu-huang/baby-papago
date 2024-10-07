import { useState, useEffect } from 'react';

/**
 * useSpaceTypeDescriptions 用於抓取設施空間類型的描述
 * 
 * @returns {Object} 返回包含空間類型描述的物件，key 是空間類型名稱，value 是對應的描述
 * 
 * - 資料來自 /mock/api/amenities/getSpaceTypeDescriptions.json
 */
export const useSpaceTypeDescriptions = () => {
  const [descriptions, setDescriptions] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    try {
      const data = require('../mock/api/amenities/getSpaceTypeDescriptions.json');
      setDescriptions(data);
    } catch (error) {
      console.error('Error loading space type descriptions:', error);
    }
  }, []);

  return descriptions;
};