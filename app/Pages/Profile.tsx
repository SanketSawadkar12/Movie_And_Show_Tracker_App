import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Profile = () => {
  const navigation = useNavigation();

  const handleExitPress = () => {
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity onPress={handleExitPress} style={{ position: 'absolute', top: 20, left: 20 }}>
        <Ionicons name="arrow-back" size={30} color="black" />
      </TouchableOpacity>
      <Text>Welcome To Your Profile</Text>
    </View>
  );
};

export default Profile;
