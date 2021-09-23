import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
flex: 1;
background-color: #FFFdFd;
`;
export const TimeView = styled.View`
flex-direction: row;
align-items: center;
`;
export const ListView = styled.View`
align-items: center;
justify-content: center;
/* background-color: #000; */

`;
export const Div = styled.View`
justify-content: space-around;
padding-left: 10px;
`;
export const DivHorario = styled.View`
border-radius: 5px;
`;
export const Header = styled.View`
background-color:#B30506 ;
padding: 10px;
flex-direction: row;
justify-content: space-between;
`;
export const Texto = styled.Text`
font-size: 16px;
color: #000;
padding: 10px;
`;
export const TextoCard = styled.Text`
font-size: 13px;
color:${props=>props.txcolor};
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
export const Botao = styled.TouchableHighlight`
width: 100%;
height: 50px;
background-color: #B30506;
padding: 10px;
border: 1px solid #B30506;
border-radius: 25px;
justify-content: center;
align-items: center;

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