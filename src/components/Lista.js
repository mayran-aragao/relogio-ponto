import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import moment from 'moment'
import Icon from 'react-native-vector-icons/Ionicons';
import { Button } from 'react-native-elements';
import { StatusBar, FlatList, Image, Animated, Text, View, Dimensions, StyleSheet, TouchableOpacity, Easing, SafeAreaViewBase, SafeAreaView } from 'react-native';

const Container = styled.TouchableHighlight`
    /* border: 0.4px solid #5597c8; */
    height: auto;
    border-radius: 5px;
    margin: 5px;
`;
const Div = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content:space-around;
    width: 100%;
    flex-wrap: wrap;

`;
const Texto = styled.Text`
    font-size: 16px;
    padding: 10px;
    color: #000;
`;

export default (props) => {
    const scrollY = React.useRef(new Animated.Value(0)).current
    const inputRange = [
        -1,
        0,
        70 * props.index,
        70 * (props.index*2)
    ]
    const scale = scrollY.interpolate({
        inputRange,
        outputRange:[1,1,1,0]
    })
    return (
            <Button
                onPress={props.viewAction}
                type="clear"
                title={
                    <Div>
                        <Texto>{moment(props.data, "YYYY-MM-DD").format('DD/MM/YYYY')}</Texto>
                        <Texto>Horários ....</Texto>
                        <Icon name="calendar-outline" size={20} color="#5597c8"></Icon>
                    </Div>
                }
                containerStyle={{
                    padding: 10,
                    marginBottom:20,
                    backgroundColor: '#FFFdFd',
                    borderRadius:12,
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 10,
                    },
                    shadowOpacity: 0.3,
                    shadowRadius: 20,
                    elevation: 15,
                }}
                
            />
    )
}