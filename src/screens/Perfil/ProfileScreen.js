import React, { useEffect, useState } from 'react';
import { TouchableHighlight, Platform, ActivityIndicator } from 'react-native';
import { Button, Avatar, Tooltip, Text, Input, Overlay, ListItem, Card } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'react-native-image-picker';
import { useStateValue } from '../../contexts/StateContext'
import Alerta from 'react-native-awesome-alerts';
import moment from 'moment';
import { check, PERMISSIONS, RESULTS, request, requestMultiple } from 'react-native-permissions'
import {
    Container,
    ListView,
    Div,
    Texto,
    LoadingArea,
    TimeView,
    DivHorario,
    TextoCard
} from './Style'
import api from '../../api';




const ProfileScreen = ({ navigation }, props) => {

    const [showAlert, setShowAlert] = useState(false);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [context, dispatch] = useStateValue()
    const [user, setUser] = useState(JSON.parse(context.user.user))
    const [image, setImage] = useState();
    const [expanded, setExpanded] = useState(false)
    const [visible, setVisible] = useState(false)

    const [schedule, setSchedule] = useState(context.user.notifications ? JSON.parse(context.user.notifications) : [])
    const [sched, setSched] = useState('')
    const [sched2, setSched2] = useState('')
    const [sched3, setSched3] = useState('')
    const [sched4, setSched4] = useState('')


    useEffect(() => {
        if (!image)
            take_photo()
    }, []);

    const pickImage = async () => {
        requestMultiple([PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE, PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE]).then((statuses) => { });
        ImagePicker.launchImageLibrary({
            mediaTypes: 'photo',
            // maxWidth: 500,
            // maxHeight: 250,
            quality: 1,
            includeBase64: true
        }, async (res) => {
            if (res.didCancel) {
                setError('cancelado')
            }
            if (res.errorMessage) {
                setError(res.errorMessage)
            }
            if (res.assets) {
                setImage(res.assets[0].base64)
                let save = await api.save_photo(res.assets[0], user.matricula)
                if (save.error === '') {
                    dispatch({ type: 'setPhoto', payload: { photo: res.assets[0].base64 } })
                } else {
                    setShow(true)
                    setError(res.error)
                }
            }
        });
        
    }


    const take_photo = async () => {
        let res = await api.take_photo(user.matricula)
        setImage(res.base64)
    }

    const logout = async (e) => {
        setShowAlert(false)
        await api.logout();
        navigation.reset({
            index: 1,
            routes: [{ name: 'Login' }]
        })
        return
    }

    const save_notification = () => {
        if (sched == 'Invalid date' || sched2 == 'Invalid date' || sched3 == 'Invalid date' || sched4 == 'Invalid date') {
            setError('Entrada invalida')
            setShow(!show)
            return
        }
        setSchedule([sched, sched2, sched3, sched4].sort())
        dispatch({ type: 'setNotifications', payload: { notifications: JSON.stringify([sched, sched2, sched3, sched4].sort()) } })
        setVisible(!visible)
    }



    return (
        <Container >
            <Card containerStyle={{ backgroundColor: "#FFFdFd", margin: 0, width: "100%", borderWidth: 0 }} wrapperStyle={{ flexDirection: 'row', justifyContent: 'space-around' }}  >
                <Avatar
                    rounded
                    title={(user.nome).substring(0, 2)}
                    onPress={pickImage}
                    size={80}
                    source={{ uri: 'data:image/jpeg;base64,' + image }}
                    // source={{ uri: image }}
                    activeOpacity={0.7}
                    containerStyle={{ backgroundColor: "grey" }}
                />
                <Div>
                    <TextoCard txcolor="#666" >Nome:</TextoCard>
                    <TextoCard txcolor="#000" >{user.nome.split(" ").length >= 3 ? user.nome.split(" ").filter((e, i) => (i == 0 || i == 2)).join(' ') : user.nome}</TextoCard>
                    <TextoCard txcolor="#666">Função:</TextoCard>
                    <TextoCard txcolor="#000">{user.no_funcao.length > 22 ? `${user.no_funcao.substring(0, 3)} ${user.no_funcao.split(' ').slice(1, 5).join(' ')}` : user.no_funcao}</TextoCard>
                </Div>
                <ListView>
                    <Button
                        title="Logout"
                        type="clear"
                        icon={<Icon name="log-out-outline" size={15} color='red' />}
                        titleStyle={{ color: 'red', fontSize: 14 }}
                        containerStyle={{ width: "100%" }}
                        iconPosition="top"
                        buttonStyle={{ borderColor: 'red', }}
                        onPress={() => setShowAlert(true)}
                    />
                </ListView>

            </Card>



            <>
                <ListItem.Accordion
                    bottomDivider
                    content={
                        <>
                            <Icon name="time-outline" size={15} color="#2689C3" style={{ paddingRight: 20 }} />
                            <ListItem.Content>
                                <ListItem.Title>Horário cadastrado</ListItem.Title>
                            </ListItem.Content>
                        </>
                    }
                    isExpanded={expanded}
                    onPress={() => setExpanded(!expanded)}
                >
                    {schedule == "" &&
                        <ListItem
                            containerStyle={{ backgroundColor: '#eee' }}
                            disabledStyle={{ opacity: 0.5 }}
                            pad={20}
                        >
                            <Icon
                                name="document-outline"
                                size={15}
                                color="#000"
                            />
                            <ListItem.Content style={{ flexDirection: 'row', justifyContent: 'center' }} >
                                <Text >Horário não cadastrado</Text>
                            </ListItem.Content>
                        </ListItem>
                    }
                    {schedule != "" &&
                        <ListItem
                            containerStyle={{ backgroundColor: '#eee' }}
                            disabledStyle={{ opacity: 0.5 }}
                            pad={20}
                        >
                            <Icon
                                name="finger-print-outline"
                                size={15}
                                color="#000"
                            />
                            <ListItem.Content style={{ flexDirection: 'row', justifyContent: 'space-around' }} >
                                {/* <ListItem.Title style={{paddingRight:10}}> */}
                                {schedule.map((item, i) => (
                                    <Text key={i} >{item}</Text>
                                ))
                                }
                                {/* </ListItem.Title> */}
                            </ListItem.Content>
                        </ListItem>
                    }

                </ListItem.Accordion>
            </>

            <ListItem
                bottomDivider
                Component={TouchableHighlight}
                containerStyle={{}}
                disabledStyle={{ opacity: 0.5 }}
                onPress={() => setVisible(!visible)}
                pad={20}
            >
                <Icon
                    name="settings-outline"
                    size={15}
                    color="#2689C3"
                />
                <ListItem.Content>
                    <ListItem.Title>
                        <Text>Definir notificações</Text>
                    </ListItem.Title>
                </ListItem.Content>
            </ListItem>
            <Overlay
                isVisible={visible}
                onBackdropPress={() => setVisible(!visible)}
            >
                <TimeView>
                    <Texto>Horário de Notificação</Texto>
                    <Tooltip
                        popover={<Text>O aplicativo por padrão irá enviar uma notificação 2 minutos antes de cada horario definido abaixo.</Text>}
                        containerStyle={{ width: "50%" }}
                        height={110}
                        width={150}
                        highlightColor="transparent"
                        overlayColor="rgba(250, 250, 250, 0.70)"
                    >
                        <Text>[?]</Text>
                    </Tooltip>
                </TimeView>
                <DivHorario>
                    <Input
                        containerStyle={{ width: "100%" }}
                        placeholder='Ex: 08:00'
                        maxLength={5}
                        leftIcon={<Icon name="time-outline" color="grey" size={20} />}
                        onChangeText={(e) => setSched(moment(e, "HH:mm").format("HH:mm"))}

                    />
                    <Input
                        containerStyle={{ width: "100%" }}
                        placeholder='Ex: 12:00'
                        maxLength={5}
                        leftIcon={<Icon name="time-outline" color="grey" size={20} />}
                        onChangeText={(e) => setSched2(moment(e, "HH:mm").format("HH:mm"))}
                    />
                    <Input
                        containerStyle={{ width: "100%" }}
                        placeholder='Ex: 13:00'
                        maxLength={5}
                        leftIcon={<Icon name="time-outline" color="grey" size={20} />}
                        onChangeText={(e) => setSched3(moment(e, "HH:mm").format("HH:mm"))}
                    />
                    <Input
                        containerStyle={{ width: "100%" }}
                        placeholder='Ex: 18:00'
                        maxLength={5}
                        leftIcon={<Icon name="time-outline" color="grey" size={20} />}
                        onChangeText={(e) => setSched4(moment(e, "HH:mm").format("HH:mm"))}
                    />
                    <Button
                        icon={
                            <Icon
                                name="save-outline"
                                size={15}
                                color="#2689C3"
                            />
                        }
                        titleStyle={{ marginHorizontal: 5 }}
                        title="Salvar"
                        type="outline"
                        onPress={save_notification}
                    />
                </DivHorario>
            </Overlay>


            {/* 
            <ListView>
                <Button
                    title="Logout"
                    type="outline"
                    titleStyle={{ color: 'red' }}
                    containerStyle={{ width: "100%" }}
                    buttonStyle={{ borderColor: 'red', }}
                    onPress={() => setShowAlert(true)}
                />
            </ListView> */}

            {loading &&
                <LoadingArea>
                    <ActivityIndicator size="large" color="#B30506" />
                </LoadingArea>
            }

            {showAlert &&
                <Alerta
                    show={showAlert}
                    showProgress={false}
                    title="Aviso!"
                    message="Deseja Sair?"
                    closeOnTouchOutside={true}
                    closeOnHardwareBackPress={false}
                    showCancelButton={true}
                    showConfirmButton={true}
                    confirmText="Sair"
                    cancelText="Não"
                    confirmButtonColor="#B30506"
                    onCancelPressed={() => setShowAlert(false)}
                    onConfirmPressed={() => logout()}
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
                    message={error}
                    closeOnTouchOutside={true}
                    closeOnHardwareBackPress={false}
                    showCancelButton={false}
                    showConfirmButton={true}
                    confirmText="Entendido"
                    confirmButtonColor="#B30506"
                    onConfirmPressed={() => setShow(false)}
                    contentContainerStyle={{ width: "100%" }}
                    actionContainerStyle={{ justifyContent: "space-around" }}
                    cancelButtonStyle={{ height: 35, width: "100%", justifyContent: 'center', alignItems: "center" }}
                    confirmButtonStyle={{ height: 35, width: "100%", justifyContent: 'center', alignItems: "center" }}
                />
            }

        </Container>
    );
}


export default ProfileScreen;