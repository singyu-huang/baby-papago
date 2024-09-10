import AccessibleRestroomIcon from '../assets/icons/space_type/accessible_restroom.svg';
import FamilyRestroomIcon from '../assets/icons/space_type/family_restroom.svg';
import NursingRoomIcon from '../assets/icons/space_type/nursing_room.svg';

interface IconMap {
  [key: string]: React.ComponentType<any> | null;
}

const useIcons = (spaceType: string) => {
  const iconMap: IconMap = {
    nursing_room: NursingRoomIcon,
    family_restroom: FamilyRestroomIcon,
    accessible_restroom: AccessibleRestroomIcon,
  };

  return iconMap[spaceType] || null;
};

export default useIcons;