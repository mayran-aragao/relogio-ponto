import React, { useEffect } from 'react';
import styled from 'styled-components/native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';

const Container = styled.SafeAreaView`
    margin: 10px;
`;
const Div = styled.View`
    width: 100%;
    flex-direction: row;
    align-items: flex-end;
    background-color: #ccc;
`;
const Texto = styled.Text`
    font-size: 16px;
    padding: 10px;
`;
const DivFlat = styled.View`
    flex: 1;
    align-content: flex-end;
`;

export default (props) => {
        moment.locale("pt")
    return (
        <Container>
            <Div>
                <Icon name="md-checkmark-circle" size={40} color="#B30506" />
                <Texto>{moment(props.data.dt_ponto, "YYYY-MM-DD").format('dddd,DD,MMM')}</Texto>
                <Texto>{(props.data.hr_ponto).replace(".", ":")}</Texto>
            </Div>
        </Container>
    )
}