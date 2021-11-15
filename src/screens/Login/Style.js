import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
    flex: 1;
    background-color: #F5F5F5;
    justify-content: center;
    align-items: center;
`;
export const ScrollKeyboardDismiss = styled.ScrollView`
`;

export const Header = styled.View`
    width: 100%;
    justify-content: center;
    align-items: center;
    bottom:50px;
`;

export const DivLogin = styled.View`
    width: 90%;
    background-color: #fff;
    border-radius: 5px;
    padding: 20px;
`;
export const Texto = styled.Text`
    color: #5597c8;
    font-weight: bold;
    padding: 10px;
    font-size: 23px;
`;
export const TextoBotao = styled.Text`
    color: #fff;
    padding: 10px;
    font-size: 20px;
`;
export const TextoBlock = styled.Text`
    color: #800000;
    padding: 10px;
    font-size: 20px;
`;
export const Menu = styled.View`
    width: 90%;
    flex-direction: row;
    padding-left: 20px;
    margin-bottom: 10px;
    justify-content: space-around;
    background-color: #ccc;
`;

export const MenuItem = styled.TouchableHighlight`
    padding:20px;
    flex-direction: row;
    align-items: center;
    border-bottom-width: ${props => props.active ? '1px' : '0px'};
    border-bottom-color: #5597c8;
`;

export const MenuItemText = styled.Text`
    color: ${props => props.active ? '#5597c8' : '#ccc'};
    font-size: 17px;
    padding-left: 5px;
`;

export const BotaoLogar = styled.TouchableHighlight`
    height:50px ;
    margin: 20px;
    border-radius: 25px;
    background-color: #B30506;
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
export const Footer = styled.View`
    position: absolute;
    bottom: 10px;
`;

export const FooterText = styled.Text`
    color: #5597c8;
    font-size: 10px;
`;
export const FooterImage = styled.Image`
    width: 40px;
    height: 40px;

`;
export const Div = styled.View`
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
`;
export const DivImage = styled.View`
    position: absolute;
    bottom: 20px;
    width: 80px;
    height: 80px;
    border-radius: 40px;
    justify-content: center;
    align-items: center;
`;
export const Image = styled.Image`
    width: 60px;
    height: 60px;
`;
