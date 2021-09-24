import React, { useEffect, useState, useRef, useReducer } from 'react';
import { StatusBar, Platform, ActivityIndicator, PermissionsAndroid } from 'react-native';
import { Divider, Button, ListItem, Overlay } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import { useStateValue } from '../../contexts/StateContext'
import Geolocation from 'react-native-geolocation-service';
import moment from 'moment-with-locales-es6'
import Alerta from 'react-native-awesome-alerts';
import JailMonkey from 'jail-monkey';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions'

import {
    Container,
    ClockView,
    TimeView,
    Div,
    Texto,
    TextoHora,
    PontoView,
    Ponto,
    ListView,
    Header,
    Aviso,
    LoadingArea,
    RegisterList,
    TextoBlock
} from './Style'
import api from '../../api';

const HomeScreen = ({ navigation }) => {
    moment.locale("pt")
    const [day, setDay] = useState('')
    const [month, setMonth] = useState('')
    const [year, setYear] = useState('')
    const [hours, setHours] = useState()
    const [minute, setMinute] = useState()
    const [seconds, setSeconds] = useState()
    const [menssage, setMenssage] = useState('')
    const [context, dispatch] = useStateValue()
    const [user, setUser] = useState(JSON.parse(context.user.user))
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [show, setShow] = useState(false);
    const [error, setError] = useState('');
    const [location, setLocation] = useState(null);
    const [register, setRegister] = useState([]);
    const [schedule, setSchedule] = useState(context.user.notifications ? JSON.parse(context.user.notifications) : [])
    const [isDevelopmentSettingsMode, setIsDevelopmentSettingsMode] = useState();
    const [block, setBlock] = useState(false)




    useEffect(() => {
        let verify = JailMonkey.canMockLocation()
        getMyLocation()
        chargeRegister()
        setBlock(verify)

        let data = new Date()
        let day = data.getDate()
        let month = data.getMonth() + 1
        let year = data.getFullYear()

        setYear(year)
        setDay((day < 10 ? "0" + day : day))

        switch (month) {
            case 1:
                return setMonth("Janeiro")
                break
            case 2:
                return setMonth("Fevereiro")
                break
            case 3:
                return setMonth("Março")
                break
            case 4:
                return setMonth("Abril")
                break
            case 5:
                return setMonth("Maio")
                break
            case 6:
                return setMonth("Junho")
                break
            case 7:
                return setMonth("Julho")
                break
            case 8:
                return setMonth("Agosto")
                break
            case 9:
                return setMonth("Setembro")
                break
            case 10:
                return setMonth("Outubro")
                break
            case 11:
                return setMonth("Novembro")
                break
            case 12:
                return setMonth("Dezembro")
                break
        }
    }, [])

    useEffect(() => {

        const timerFunction = () => {
            let now = new Date();
            setHours(now.getHours())
            setMinute(now.getMinutes())
            setSeconds(now.getSeconds())
            chargeNotification()
        }
        let timer = setInterval(timerFunction, 1000);
        timerFunction();

        return () => clearInterval(timer);
    }, [])

    useEffect(() => {
        if (hours <= 11)
            return setMenssage("Bom dia, ")
        if (hours >= 12 && hours <= 17)
            return setMenssage("Boa tarde, ")
        if (hours >= 18)
            return setMenssage("Boa noite, ")
    }, [hours])

 


    const chargeRegister = async () => {
        let data = moment(new Date()).format('YYYY-MM-DD')
        const res = await api.getRegister(data, data, user.matricula)
        if (res.error) {
            return
        }
        dispatch({ type: 'setRegister', payload: { register: JSON.stringify(res) } })
        setRegister(res.slice(0).reverse())
    }
    const chargeNotification = async () => {
        const res = await api.getNotification()
        if (!res) {
            return
        }
        dispatch({ type: 'setNotifications', payload: { notifications: res } })
        setSchedule(JSON.parse(res))
    }

    const getMyLocation = async () => {

        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: "Ponto digital permissão de localização",
                    message: "Ponto digital precisa de sua localização, então você poderá registrar o ponto",
                    buttonNeutral: "Pergunte-me depois",
                    buttonNegative: "Negar",
                    buttonPositive: "Confirmar"
                }
            )
            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                setError('Permissão para acessar localização negada!');
                setShowAlert(true)
                return;
            }
            Geolocation.getCurrentPosition(
                info => {

                    let location = {
                        latitude: info.coords.latitude,
                        longitude: info.coords.longitude,
                        mock: info.mocked,
                        timestamp: info.timestamp
                    }
                    setLocation(location);
                },
                error => { console.log(error), setError(error.message), setLocation('') },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 1000,
                    showLocationDialog: true
                }
            )
        } else {
            Geolocation.getCurrentPosition(
                info => {
                    let location = {
                        latitude: info.coords.latitude,
                        longitude: info.coords.longitude,
                        mock: info.mocked,
                        timestamp: info.timestamp
                    }
                    setLocation(location);
                },
                error => setError(error.message),
                {
                    enableHighAccuracy: true,
                    timeout: 2000,
                    maximumAge: 100,
                    showLocationDialog: true
                }
            )
        }
    }

    const sendRegister = async () => {
        if (location) {
            if (location.latitude <= -5.123 && location.latitude >= -5.127 && location.longitude <= -42.803 && location.longitude >= -42.807 && location.mock == false) {
                setShow(false)
                setLoading(true)
                let data = new Date()
                let month = data.getMonth() + 1
                let nr_rep = ("00000000000000000" + user.matricula).slice(-17)
                let cd_empresa = user.cd_empresa
                let nr_cgc = user.cnpj
                let matricula = user.matricula
                let nr_pis = user.nr_pis
                let dt_ponto = `${year}-${month}-${day}`
                let hr_ponto = `${hours}.${minute < 10 ? "0" + minute : minute}`
                let res = await api.getNsr(moment(dt_ponto, "YYYY-MM-DD").format('YYYY-MM-DD'), nr_rep)
                if (res.error) {
                    setShowAlert(true)
                    setError(res.error)
                    setLoading(false)
                }
                let nsr = parseInt(res.nsr) + 1
                nsr = ("0000000000" + nsr.toString()).slice(-10)

                let cd_chave = `${year}${month}${day}${nr_rep}${nsr}${user.nr_pis}`
                let dado = { cd_chave, cd_empresa, nr_cgc, nr_rep, matricula, dt_ponto, hr_ponto, nsr, nr_pis, location }
                let response = await api.saveRegister(dado)
                if (response.error === '') {

                    setShowAlert(true)
                    setError(response.success)
                    setLoading(false)
                    chargeRegister()
                    return
                }
                setShowAlert(true)
                setError(response.error)
                setLoading(false)
                return
            } else {
                setShow(false)
                setShowAlert(true)
                setError("Você está fora da localização permitida")
                return setLoading(false)
            }


        } else {
            setShow(false)
            setShowAlert(true)
            setError('Localização invalida! Tente reiniciar a localização')
            setLoading(false)
        }

    }


    return (
        <Container >
            <StatusBar barStyle={Platform.OS == 'ios' ? 'dark-content' : 'light-content'} animated={true} backgroundColor="#5597c8" />
            <Header>
                <Texto >{menssage}{(user.nome.split(" ")[0])[0] + (user.nome.split(" ")[0]).substr(1).toLowerCase()}</Texto>
                <Texto >{day}, {month}, {year}</Texto>
            </Header>
            <ClockView>

                <Div>
                    <Div>
                        <TimeView>
                            <TextoHora >{hours < 10 ? "0" + hours : hours}</TextoHora>
                        </TimeView>
                    </Div>
                    <PontoView>
                        <Ponto >:</Ponto>
                    </PontoView>
                    <Div>
                        <TimeView>
                            <TextoHora >{minute < 10 ? "0" + minute : minute}</TextoHora>
                        </TimeView>
                    </Div>
                    <PontoView>
                        <Ponto >:</Ponto>
                    </PontoView>
                    <Div>
                        <TimeView>
                            <TextoHora >{seconds < 10 ? "0" + seconds : seconds}</TextoHora>
                        </TimeView>
                    </Div>
                </Div>

            </ClockView>

            <Div>
                <Button
                    type="outline"
                    title="Registrar ponto"
                    titleStyle={{ color: "#5597c8" }}
                    containerStyle={{ width: "100%", padding: 10 }}
                    buttonStyle={{ borderColor: "#5597c8" }}
                    // onPress={() => { getMyLocation(), setShow(true) }}
                    onPress={() => { notificacao() }}
                />
            </Div>

            <Divider orientation="horizontal" />
            {register == "" &&
                <ListView>
                    <Icon name="finger-print-outline" size={70} color="grey" />
                    <Aviso >Nenhum registro hoje</Aviso>
                </ListView>
            }
            {register != "" &&
                <RegisterList>
                    {register.map((item, index) => (

                        <ListItem key={index} bottomDivider>
                            <ListItem.Content style={{ alignItems: 'flex-start' }}>
                                <ListItem.Title>{moment(item.dt_ponto, "YYYY-MM-DD").format('dddd,DD,MMM')}</ListItem.Title>
                                <ListItem.Subtitle style={{ fontWeight: 'bold' }}>{(item.hr_ponto).replace(".", ":") + " Hrs"}</ListItem.Subtitle>
                            </ListItem.Content>
                            <Icon name="md-checkmark-circle" size={40} color="#5597c8" />
                        </ListItem>
                    ))
                    }
                </RegisterList>
            }
            {loading &&
                <LoadingArea>
                    <ActivityIndicator size="large" color="#5597c8" />
                </LoadingArea>
            }

            {block &&
                <LoadingArea>
                    <Overlay overlayStyle={{ justifyContent: 'center', alignItems: 'center' }}>
                        <TextoBlock>ALERTA</TextoBlock>
                        <TextoBlock style={{ fontSize: 16 }}>Detectamos algo de errado.</TextoBlock>
                        <TextoBlock style={{ fontSize: 16 }}>Retorne para o login!</TextoBlock>
                        <Button
                            title="Retornar"
                            icon={<Icon name="log-out-outline" size={15} color='white' />}
                            titleStyle={{ color: "#fff" }}
                            containerStyle={{ width: "100%", padding: 10, }}
                            buttonStyle={{ backgroundColor: "#B30506", }}
                            titleStyle={{ marginHorizontal: 5 }}
                            onPress={async () => {
                                await api.logout();
                                navigation.reset({
                                    index: 1,
                                    routes: [{ name: 'Login' }]
                                })
                            }}
                        />
                    </Overlay>
                </LoadingArea>
            }

            {showAlert &&
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
            {show &&
                <Alerta
                    show={show}
                    showProgress={false}
                    title="Aviso!"
                    message={"Deseja registrar o ponto?"}
                    closeOnTouchOutside={true}
                    closeOnHardwareBackPress={false}
                    showCancelButton={true}
                    showConfirmButton={true}
                    confirmText="Confirmar"
                    confirmButtonColor="#5597c8"
                    onCancelPressed={() => setShow(false)}
                    onConfirmPressed={() => { sendRegister() }}
                    contentContainerStyle={{ width: "100%" }}
                    actionContainerStyle={{ justifyContent: "space-around" }}
                    cancelButtonStyle={{ height: 35, width: "100%", justifyContent: 'center', alignItems: "center" }}
                    confirmButtonStyle={{ height: 35, width: "100%", justifyContent: 'center', alignItems: "center" }}
                />
            }



        </Container>
    );
}


export default HomeScreen;