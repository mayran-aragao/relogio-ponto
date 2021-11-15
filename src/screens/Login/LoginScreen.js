import React, { useEffect, useState, useRef } from 'react';
import { ActivityIndicator, StatusBar, Platform, ScrollView, View } from 'react-native'
import api from '../../api'
import { useStateValue } from '../../contexts/StateContext'
import Alerta from 'react-native-awesome-alerts';
import { Input, Button, Overlay, Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import JailMonkey from 'jail-monkey'
import PushNotification from 'react-native-push-notification'
import * as Animatable from 'react-native-animatable';
import {
    Container,
    Texto,
    MenuItem,
    MenuItemText,
    LoadingArea,
    FooterText,
    Image,
    TextoBlock,
    Div,
    DivImage,
} from './Style'


const LoginScreen = ({ navigation }) => {

    const [email, setEmail] = useState('')
    const [matricula, setMatricula] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [activeMenu, setActiveMenu] = useState('signin');
    const [error, setError] = useState('');
    const [block, setBlock] = useState(false)

    const [context, dispatch] = useStateValue()

    const LoginElement = useRef()
    const ButtonElement = useRef()
    const LogoElement = useRef()
    const FooterElement = useRef()

    useEffect(() => {
        LoginElement.current.animate('flipInY', 1500)
        ButtonElement.current.animate('flipInY', 1300)
        LogoElement.current.animate('flipInY', 1100)
        FooterElement.current.animate('flipInY', 1500)
        createChannels()
        JailMonkey.isDevelopmentSettingsMode().then((e) => {
            setBlock(false)
        })
    }, [])

    const createChannels = () => {
        PushNotification.createChannel({
            channelId: "test-channel",
            channelName: "Test Channel"
        })
    }

    const handleSignIn = async () => {
        if (password && email) {
            setLoading(true)
            const res = await api.login(email.trim(), password.trim())
            if (res.error === '') {
                setLoading(false)
                dispatch({ type: 'setToken', payload: { token: res.token } })
                dispatch({ type: 'setUser', payload: { user: JSON.stringify(res.user) } })
                LogoElement.current.animate('flipOutY', 1300)
                LoginElement.current.animate('flipOutY', 1300)
                ButtonElement.current.animate('flipOutY', 1300)
                await FooterElement.current.animate('flipOutY', 1300)
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
        if (email && matricula && password && confirmPassword) {
            if (password == confirmPassword) {
                setLoading(true)
                const res = await api.register(email.trim(), matricula.trim(), password.trim())
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
                setError('As senhas não combinam!')
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
                <Animatable.View
                    ref={LogoElement}
                    useNativeDriver
                    style={{ width: '100%', justifyContent: 'center', alignItems: 'center', bottom: 50 }}>
                    <DivImage >
                        <Image resizeMode="contain" source={require('../../essets/ti_logo.png')} />
                    </DivImage>
                    <Texto style={{ position: 'absolute' }}>Ponto Digital</Texto>
                </Animatable.View>
                <Animatable.View
                    ref={ButtonElement}
                    useNativeDriver
                    style={{ width: '90%', flexDirection: 'row', paddingLeft: 20, marginBottom: 10, justifyContent: 'space-around' }}
                >
                    {/* <Menu> */}
                    <MenuItem
                        active={activeMenu == 'signin'}
                        underlayColor="transparent"
                        onPress={() => {
                            setActiveMenu('signin');
                            setEmail('');
                            setMatricula('');
                            setPassword('');
                            setConfirmPassword('')
                        }}>
                        <>
                            <Icon name="log-in" color={activeMenu == 'signin' ? '#5597c8' : 'grey'} />
                            <MenuItemText active={activeMenu == 'signin'}>Login</MenuItemText>

                        </>
                    </MenuItem>
                    <MenuItem
                        active={activeMenu == 'signup'}
                        underlayColor="transparent"
                        onPress={() => {
                            setActiveMenu('signup');
                            setEmail('');
                            setMatricula('');
                            setPassword('');
                            setConfirmPassword('')
                        }}>
                        <>
                            <Icon name="person-add" color={activeMenu == 'signup' ? '#5597c8' : 'grey'} />
                            <MenuItemText active={activeMenu == 'signup'}>Cadastrar</MenuItemText>
                        </>
                    </MenuItem>
                    {/* </Menu> */}
                </Animatable.View>
                {/* <DivLogin> */}
                <Animatable.View
                    ref={LoginElement}
                    useNativeDriver
                    style={{ width: "90%", backgroundColor: "#fff", borderRadius: 5, padding: 20 }}
                >
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
                        {activeMenu == "signup" &&
                            <Input
                                editable={!loading}
                                autoCapitalize="none"
                                value={matricula}
                                onChangeText={(m) => setMatricula(m)}
                                placeholderTextColor="#ccc"
                                placeholder="Matricula"
                                keyboardType='numeric'
                                returnKeyType="go"
                                leftIcon={<Icon name="keypad-outline" color="grey" />}
                            />
                        }
                        <Input
                            editable={!loading}
                            autoCapitalize="none"
                            secureTextEntry={true}
                            value={password}
                            onChangeText={(m) => setPassword(m)}
                            placeholderTextColor="#ccc"
                            placeholder="Senha"
                            returnKeyType="go"
                            leftIcon={<Icon name="lock-closed" color="grey" />}
                        />

                        {activeMenu == "signup" &&
                            <Input
                                editable={!loading}
                                autoCapitalize="none"
                                secureTextEntry={true}
                                value={confirmPassword}
                                onChangeText={(m) => setConfirmPassword(m)}
                                placeholderTextColor="#ccc"
                                placeholder="Confirmação de senha"
                                returnKeyType="go"
                                leftIcon={<Icon name="lock-closed" color="grey" />}
                            />
                        }
                        {activeMenu == "signin" &&
                            <Button
                                title="Acessar"
                                titleStyle={{ color: "#fff" }}
                                containerStyle={{ width: "100%", padding: 10 }}
                                onPress={() => handleSignIn()}
                            />
                        }
                        {activeMenu == "signup" &&
                            <Button
                                title="Cadastrar"
                                titleStyle={{ color: "#fff" }}
                                containerStyle={{ width: "100%", padding: 10 }}
                                onPress={() => handleSignUp()}
                            />
                        }
                    </ScrollView>
                </Animatable.View>
                {/* </DivLogin> */}
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
                <Animatable.View
                    ref={FooterElement}
                    useNativeDriver
                    style={{ position: 'absolute', bottom: 10 }}
                >
                    <FooterText>Versão 1.0.1</FooterText>
                </Animatable.View>

            </Container >
        </ScrollView>
    );
}

export default LoginScreen;