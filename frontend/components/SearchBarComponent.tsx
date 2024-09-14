import React from 'react';
import { SearchBar } from 'react-native-elements';
import { StyleSheet } from 'react-native';

interface SearchBarComponentProps {
    value: string;
    onChangeText: (value: string) => void;
    onPress: () => void;
    searchBarRef: React.RefObject<any>;
}

const SearchBarComponent: React.FC<SearchBarComponentProps> = ({
    value,
    onChangeText,
    onPress,
    searchBarRef,
}) => {
    return (
        <SearchBar
            ref={searchBarRef}
            placeholder="輸入地點"
            onChangeText={onChangeText}
            value={value}
            containerStyle={styles.searchBarContainer}
            inputContainerStyle={styles.searchBarInputContainer}
            inputStyle={styles.searchBarInput}
            onPress={onPress}
        />
    );
};

const styles = StyleSheet.create({
    searchBarContainer: {
        position: 'absolute',
        top: 40,
        width: '90%',
        alignSelf: 'center',
        backgroundColor: 'transparent',
        borderTopWidth: 0,
        borderBottomWidth: 0,
    },
    searchBarInputContainer: {
        backgroundColor: '#fff',
        borderRadius: 20,
        height: 45,
    },
    searchBarInput: {
        color: '#000',
    },
});

export default SearchBarComponent;