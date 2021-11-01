import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StatusBar, Platform, Keyboard, TouchableWithoutFeedback, Pressable, ScrollView } from 'react-native'
import api from '../../api'
import { useStateValue } from '../../contexts/StateContext'
import Alerta from 'react-native-awesome-alerts';
import { Input, Button, Overlay, Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import JailMonkey from 'jail-monkey'
import PushNotification from 'react-native-push-notification'
import {
    Container,
    Header,
    DivLogin,
    Texto,
    Menu,
    MenuItem,
    MenuItemText,
    LoadingArea,
    Footer,
    FooterText,
    Image,
    TextoBlock,
    Div,
    DivImage,
    ScrollKeyboardDismiss

} from './Style'


const LoginScreen = ({ navigation }) => {

    const [email, setEmail] = useState('')
    const [matricula, setMatricula] = useState('')
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [activeMenu, setActiveMenu] = useState('signin');
    const [error, setError] = useState('');
    const [block, setBlock] = useState(false)

    const [context, dispatch] = useStateValue()

    useEffect(() => {
        createChannels()
        JailMonkey.isDevelopmentSettingsMode().then((e) => {
            setBlock(e)
        })
    }, [])

    const createChannels = () => {
        PushNotification.createChannel({
            channelId: "test-channel",
            channelName: "Test Channel"
        })
    }

    const handleSignIn = async () => {
        if (matricula && email) {
            setLoading(true)
            const res = await api.login(email, matricula)
            if (res.error === '') {
                setLoading(false)
                dispatch({ type: 'setToken', payload: { token: res.token } })
                dispatch({ type: 'setUser', payload: { user: JSON.stringify(res.user) } })
                navigation.reset({
                    index: 1,
                    routes: [{ name: 'Tab' }]
                })
            } else {
                setShowAlert(true)
                setError(res.error)
                setLoading(false)
            }
        } else {
            setShowAlert(true)
            setError('Campos não preenchidos!')
        }
    }

    const handleSignUp = async () => {
        if (email && matricula) {
            setLoading(true)
            const res = await api.register(email, matricula)
            if (res.error === '') {
                setLoading(false)
                setShowAlert(true)
                setError(res.success)

            } else {
                setShowAlert(true)
                setError(res.error)
                setLoading(false)
            }
        } else {
            setShowAlert(true)
            setError('Campos não preenchidos!')
        }
    }

    return (
        <ScrollView contentContainerStyle={{ flex: 1 }} scrollEnabled={false} keyboardDismissMode='on-drag' keyboardShouldPersistTaps='handled'>
            <Container >
                <StatusBar barStyle={Platform.OS == 'ios' ? 'dark-content' : 'dark-content'} animated={true} backgroundColor="#F5F5F5" />
                <Header>
                    <DivImage >
                        <Image resizeMode="contain" source={require('../../essets/ti_logo.png')} />
                    </DivImage>
                    <Texto style={{ position: 'absolute' }}>Ponto Digital</Texto>
                </Header>
                <Menu>
                    <MenuItem active={activeMenu == 'signin'} underlayColor="transparent" onPress={() => { setActiveMenu('signin'); setEmail(''); setMatricula('') }}>
                        <>
                            <Icon name="log-in" color={activeMenu == 'signin' ? '#5597c8' : 'grey'} />
                            <MenuItemText active={activeMenu == 'signin'}>Login</MenuItemText>

                        </>
                    </MenuItem>
                    <MenuItem active={activeMenu == 'signup'} underlayColor="transparent" onPress={() => { setActiveMenu('signup'); setEmail(''); setMatricula('') }}>
                        <>
                            <Icon name="person-add" color={activeMenu == 'signup' ? '#5597c8' : 'grey'} />
                            <MenuItemText active={activeMenu == 'signup'}>Cadastrar</MenuItemText>
                        </>
                    </MenuItem>
                </Menu>
                <DivLogin>
                    <ScrollView keyboardDismissMode='on-drag' keyboardShouldPersistTaps='handled' scrollEnabled={false}>
                        <Input
                            editable={!loading}
                            autoCapitalize="none"
                            autoCompleteType="email"
                            value={email}
                            onChangeText={(m) => setEmail(m)}
                            keyboardType="email-address"
                            placeholderTextColor="#ccc"
                            placeholder="E-mail"
                            leftIcon={<Icon name="mail" color="grey" />}
                        />
                        <Input
                            editable={!loading}
                            autoCapitalize="none"
                            secureTextEntry={true}
                            value={matricula}
                            onChangeText={(m) => setMatricula(m)}
                            placeholderTextColor="#ccc"
                            placeholder="Matricula"
                            returnKeyType="go"
                            leftIcon={<Icon name="lock-closed" color="grey" />}
                        />
                        {activeMenu == "signin" &&
                            <Button
                                // ViewComponent={LinearGradient}
                                // linearGradientProps={{
                                //     colors: ["#D67140", '#DE8349', "#CD7820"],
                                // }}
                                title="Acessar"
                                titleStyle={{ color: "#fff" }}
                                containerStyle={{ width: "100%", padding: 10 }}
                                // buttonStyle={{ backgroundColor: "#B30506" }}
                                onPress={() => handleSignIn()}
                            />
                        }
                        {activeMenu == "signup" &&
                            <Button
                                // ViewComponent={LinearGradient}
                                // linearGradientProps={{
                                //     colors: ['rgba(0,0,0,0.2)', "#D67140", '#DE8349', "#CD7820"],
                                // }}
                                title="Cadastrar"
                                titleStyle={{ color: "#fff" }}
                                containerStyle={{ width: "100%", padding: 10 }}
                                // buttonStyle={{ backgroundColor: "#B30506" }}
                                onPress={() => handleSignUp()}
                            />
                        }
                    </ScrollView>
                </DivLogin>
                {
                    loading &&
                    <LoadingArea>
                        <ActivityIndicator size="large" color="#fff" />
                    </LoadingArea>
                }

                {block &&
                    <LoadingArea>
                        <Overlay overlayStyle={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Div>
                                <Icon name="warning" color='#800000' size={25} />
                                <TextoBlock>ALERTA</TextoBlock>
                            </Div>
                            <TextoBlock style={{ fontSize: 16 }}>Modo Desenvolvedor Ativo!</TextoBlock>
                            <TextoBlock style={{ fontSize: 16 }}>Desative e Reinicie o aplicativo.</TextoBlock>
                        </Overlay>
                    </LoadingArea>
                }

                {
                    showAlert &&
                    <Alerta
                        show={showAlert}
                        showProgress={false}
                        title="Aviso!"
                        message={error}
                        closeOnTouchOutside={true}
                        closeOnHardwareBackPress={false}
                        showCancelButton={false}
                        showConfirmButton={true}
                        confirmText="OK"
                        confirmButtonColor="#5597c8"
                        onCancelPressed={() => setShowAlert(false)}
                        onConfirmPressed={() => setShowAlert(false)}
                        contentContainerStyle={{ width: "100%" }}
                        actionContainerStyle={{ justifyContent: "space-around" }}
                        cancelButtonStyle={{ height: 35, width: "100%", justifyContent: 'center', alignItems: "center" }}
                        confirmButtonStyle={{ height: 35, width: "100%", justifyContent: 'center', alignItems: "center" }}
                    />
                }
                <Footer>
                    {/* <FooterImage resizeMode="center" source={require('../../essets/ti_logo.png')} /> */}
                    <FooterText>Versão 1.0.0</FooterText>
                </Footer>

            </Container >
        </ScrollView>
    );
}

export default LoginScreen;