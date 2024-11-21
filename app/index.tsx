import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Home from './Pages/Home';
import List from './Pages/List';
import Profile from './Pages/Profile';
import MovieDetails from './Pages/Moviedetails';
import Icon from 'react-native-vector-icons/Ionicons';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const CustomHeader = ({ navigation }: any) => {
  return (
    <View style={styles.headerContainer}>

      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <MaterialIcons name="menu" size={28} color="black" />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>Cinemas</Text>

      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <MaterialIcons name="account-circle" size={28} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: { height: 60 },
      tabBarLabelStyle: { fontSize: 14 },
    }}
  >
    <Tab.Screen
      name="Home"
      component={Home}
      options={{
        tabBarIcon: ({ focused }) => (
          <Icon name="home" size={28} color={focused ? '#0163d2' : 'black'} />
        ),
      }}
    />
    <Tab.Screen
      name="My List"
      component={List}
      options={{
        tabBarIcon: ({ focused }) => (
          <Icon name="list" size={28} color={focused ? '#0163d2' : 'black'} />
        ),
      }}
    />
  </Tab.Navigator>
);
const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={TabNavigator}
        options={({ navigation }) => ({
          header: () => <CustomHeader navigation={navigation} />,
        })}
      />
      <Stack.Screen name="MovieDetails" component={MovieDetails} />

    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 60,
    backgroundColor: '#F8F5FF',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    alignItems: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
});

const index = () => {

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Drawer.Screen name="HomeTabs" component={StackNavigator} />
      <Drawer.Screen name="Profile" component={Profile} />
    </Drawer.Navigator>
  );
};


export default index
