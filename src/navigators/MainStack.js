import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStateValue } from '../contexts/StateContext';
import TabNavigator from '../navigators/TabNavigator';
import LoginScreen from '../screens/Login/LoginScreen';
import PreloadScreen from '../screens/Preload/PreloadScreen';

const Stack = createNativeStackNavigator();

const App = () => {

    const [context, dispatch] = useStateValue();

    

    useEffect(() => {
        const recharge = async () => {
            const user = await AsyncStorage.getItem('user')
            const register = await AsyncStorage.getItem('register')
            const notifications = await AsyncStorage.getItem('notifications')

            if (register) {
                dispatch({ type: 'setRegister', payload: { register: register } })
            } else {
                dispatch({ type: 'setRegister', payload: { register: "" } })
            }

            if (notifications) {
                dispatch({ type: 'setNotifications', payload: { notifications: notifications } })
            } else {
                dispatch({ type: 'setNotifications', payload: { notifications: ""} })
            }

            if (user) {
                dispatch({ type: 'setUser', payload: { user: user } })
                return
            }
            dispatch({ type: 'setUser', payload: { user: "" } })
        }
        recharge()
    }, [])

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Preload" component={PreloadScreen} options={{
                    headerShown: false
                }} />
                <Stack.Screen name="Login" component={LoginScreen} options={{
                    headerShown: false
                }} />
                <Stack.Screen name="Tab" component={TabNavigator} options={{
                    headerShown: false
                }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;