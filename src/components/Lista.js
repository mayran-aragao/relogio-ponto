import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import moment from 'moment'
import Icon from 'react-native-vector-icons/Ionicons';
import { Button } from 'react-native-elements';

const Container = styled.TouchableHighlight`
    border: 0.4px solid #5597c8;
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


    return (
        <Button
            onPress={props.viewAction}
            type="outline"
            title={
                <Div>
                    <Texto>{moment(props.data, "YYYY-MM-DD").format('DD/MM/YYYY')}</Texto>
                    <Texto>Horários ....</Texto>
                    <Icon name="calendar-outline" size={20} color="#5597c8"></Icon>
                </Div>
            }
            containerStyle={{ width: "100%", paddingLeft: 10, paddingRight: 10, marginBottom: 10, paddingBottom:10 }}
            buttonStyle={{ borderColor: "#5597c8",borderBottomColor:"#5597c8", borderBottomWidth:2, borderTopStartRadius:15,borderTopEndRadius:15 }}
        />
    )
}