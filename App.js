import React, { Component } from 'react';

import 'react-native-gesture-handler';

// import components (screens) we want to navigate
import Start from './components/Start'
import Chat from './components/Chat'

// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Navigation
// Stack Navigation
// const Stack = createStackNavigator();

// Tab Navigation
const Tab = createBottomTabNavigator();

export default class App extends React.Component {
  // constructor(props){
  //   super(props);
  //   this.state = { text: "" };
  // }

  

  render() {
    return (
      <NavigationContainer>
        <Tab.Navigator initialRouteName="Start">
          <Tab.Screen name="Start" component={Start} />
          <Tab.Screen name="Chat" component={Chat} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}