import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/Home/HomeScreen';
import ReportScreen from '../screens/Report/ReportScreen';
import ProfileScreen from '../screens/Perfil/ProfileScreen';

const Tab = createBottomTabNavigator();

const App = () => {
    return (

        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Inicio') {
                        iconName = focused
                            ? 'home'
                            : 'home-outline';
                    } else if (route.name === 'Registros') {
                        iconName = focused ? 'finger-print' : 'finger-print-outline';
                    } else if (route.name === 'Perfil') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#5597c8',
                tabBarInactiveTintColor: 'grey',
            })}
        >
            <Tab.Screen name="Inicio" component={HomeScreen} options={{
                headerShown: false
            }} />
            <Tab.Screen name="Registros" component={ReportScreen} options={{
                headerShown: false
            }} />
            <Tab.Screen name="Perfil" component={ProfileScreen} options={{
                headerShown: false
            }} />
           
        </Tab.Navigator>

    );
}

export default App;