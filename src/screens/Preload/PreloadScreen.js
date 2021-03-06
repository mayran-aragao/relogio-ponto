import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import api from '../../api'
import { useStateValue } from '../../contexts/StateContext'
import {
     Container,
     
} from './Style' 

const PreloadScreen = () => {
    const navigation = useNavigation()
    const [context, dispatch] = useStateValue()

    useEffect(()=> {
        const checkLogin = async () => {
            let token = await api.getToken();
            if(token) {
                let result= await api.validadeToken()
                if(result.error === '') {
                    navigation.reset({
                        index:1,
                        routes:[{name: 'Tab'}]
                    })                    
                } else {
                    dispatch({ type:'setToken', payload: { token:''}})
                    dispatch({ type:'user', payload: { user:''}})
                    navigation.reset({
                        index:1,
                        routes:[{name: 'Login'}]
                    })
                }

            } else {
                dispatch({ type:'user', payload: { user:''}})
                navigation.reset({
                    index:1,
                    routes:[{name: 'Login'}]
                })
            }
        }

        checkLogin()
    },[])

    
    return (
        <Container >
            <ActivityIndicator color="#5597c8" size="large"/>
        </Container>
    );
}

export default PreloadScreen;