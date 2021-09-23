import React, { useEffect } from 'react';
import MainStack from './src/navigators/MainStack'
import { StateProvider } from './src/contexts/StateContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default () => (

    <StateProvider>
        <SafeAreaProvider>
            <MainStack />
        </SafeAreaProvider>
    </StateProvider>
)


