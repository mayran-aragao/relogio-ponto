import { set } from 'react-native-reanimated';
import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
    flex: 1;
    background-color: #FFFdFd;
`;
export const Div = styled.View``;
export const LoadingArea = styled.View`
    position:absolute;
    left:0;
    top:0;
    right:0;
    bottom:0;
    background-color: rgba(0,0,0,0.5);
    justify-content: center;
    align-items: center;
`;

export const RegisterList = styled.FlatList`
    flex:1;
    padding-top: 20px;
`;
export const Header = styled.View`
    flex-direction: row;
    justify-content:space-between;
    padding: 5px;
    background-color: #5597c8;
`;
export const Descritivo = styled.Text`
    font-size: 16px;
    font-weight: bold;
    padding: 10px;
    color: #fff;
`;
export const ModalDiv = styled.View`
    flex-direction: row;
    justify-content: center;
    padding: 10px;
`;
export const ModalLabel = styled.Text`
    font-size: 16px;
    align-self: center;
    padding-left: 10px;
    color: #000;
`;
export const ModalView = styled.View`
    flex-direction: row;
    margin-top: 5px;
`;
export const ModalScroll = styled.ScrollView`
`;
export const ModalText = styled.Text`
    font-size: 16px;
`;
export const Div2 = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content:space-around;
    width: 100%;
    flex-wrap: wrap;

`;
export const Texto = styled.Text`
    font-size: 16px;
    padding: 10px;
    color: #000;
`;
