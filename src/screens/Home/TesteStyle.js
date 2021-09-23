import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
flex: 1;
background-color: #FFFdFd;
`;
export const ClockView = styled.View`
justify-content: center;
align-items: center;
padding: 10px;
`;
export const ListView = styled.View`
flex: 1;
justify-content: center;
align-items: center;
padding: 10px;
`;
export const Div = styled.View`
padding: 10px;
flex-direction: row;
`;
export const PontoView = styled.View`
justify-content: center;
align-items: center;
`;
export const TimeView = styled.View`
background-color: #363636;
border-radius: 10px;
justify-content: center;
align-items: center;
`;
export const Header = styled.View`
background-color:#FFFdFd ;
padding: 10px;
flex-direction: row;
justify-content: space-between;
`;
export const Texto = styled.Text`
font-size: 16px;
color: #5597c8;
padding: 10px;
`;
export const TextoBlock = styled.Text`
    color: #800000;
    padding: 10px;
    font-size: 20px;
`;
export const Aviso = styled.Text`
font-size: 16px;
color: grey;
padding: 10px;
`;
export const TextoHora = styled.Text`
font-size: 50px;
color: #fff;
padding: 10px;
`;
export const Ponto = styled.Text`
font-size: 50px;
font-weight: bold;
color: #363636;
`;

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
export const RegisterList = styled.ScrollView`
    flex: 1;
`;
