import React, { useEffect, useState, useRef, memo } from 'react';
import { TouchableHighlight, ActivityIndicator } from 'react-native';
import { Button, Avatar, Tooltip, Text, Input, Overlay, ListItem, Card } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'react-native-image-picker';
import { useStateValue } from '../../contexts/StateContext'
import Alerta from 'react-native-awesome-alerts';
import moment from 'moment';
import { PERMISSIONS, requestMultiple } from 'react-native-permissions'
import PushNotification from "react-native-push-notification";
import * as Animatable from 'react-native-animatable';
import {
    Container,
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
    const [passwordModal, setPasswordModal] = useState(false)
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [schedule, setSchedule] = useState(context.user.notifications ? JSON.parse(context.user.notifications) : [])
    const [sched, setSched] = useState('')
    const [sched2, setSched2] = useState('')
    const [sched3, setSched3] = useState('')
    const [sched4, setSched4] = useState('')

    const AvatarElement = useRef()
    const NameElement = useRef()
    const ButtonElement = useRef()
    const ItemElement = useRef()
    const DefineElement = useRef()
    const ChangeElement = useRef()

    useEffect(() => {
        AvatarElement.current.animate('fadeInLeft', 1500)
        NameElement.current.animate('fadeInLeft', 1300)
        ButtonElement.current.animate('fadeInLeft', 1100)
        ItemElement.current.animate('fadeInLeft', 1500)
        DefineElement.current.animate('fadeInLeft', 1600)
        ChangeElement.current.animate('fadeInLeft', 1700)
    }, [])

    useEffect(() => {
        take_photo()
        notificacao()
    }, [schedule]);

    const notificacao = () => {
        PushNotification.cancelAllLocalNotifications()
        let year = new Date().getFullYear()
        let month = new Date().getMonth() + 1
        let day = new Date().getDate()
        let hours = new Date().getHours()
        let minutes = new Date().getMinutes()

        schedule.map(a => {
            let now = moment(`${hours}:${minutes}`, "HH:mm").format("HH:mm")
            if (a < now) {
                let notif = new Date(`${year}/${month}/${day + 1} ${a}:02`)
                PushNotification.localNotificationSchedule({
                    channelId: "test-channel",
                    title: "Ponto digital",
                    message: "Está quase na hora de registrar o ponto", // (required)
                    date: notif, // in 60 secs
                });
            }
            if (a > now) {
                let notif = new Date(`${year}/${month}/${day} ${a}:02`)
                PushNotification.localNotificationSchedule({
                    channelId: "test-channel",
                    title: "Ponto digital",
                    message: "Está quase na hora de registrar o ponto", // (required)
                    date: notif, // in 60 secs
                });
            }

        })
    }

    const pickImage = async () => {
        requestMultiple([PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE, PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE]).then((statuses) => { });
        ImagePicker.launchImageLibrary({
            mediaTypes: 'photo',
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
                let obj = { matricula: user.matricula, base64: res.assets[0].base64 }

                if (save.error === '') {
                    dispatch({ type: 'setPhoto', payload: { photo: JSON.stringify(obj) } })
                } else {
                    setShow(true)
                    setError(res.error)
                }
            }
        });

    }


    const take_photo = async () => {
        let photo = JSON.parse(await api.getPhoto())

        if (photo?.matricula !== user.matricula || !photo) {

            let res = await api.take_photo(user.matricula)

            let obj = { matricula: user.matricula, base64: res.base64 }

            dispatch({ type: 'setPhoto', payload: { photo: JSON.stringify(obj) } })

            return setImage(res.base64)
        }
        return setImage(photo.base64)
    }

    const logout = async (e) => {
        setShowAlert(false)
        AvatarElement.current.animate('fadeOutLeft', 1000)
        NameElement.current.animate('fadeOutLeft', 1000)
        ButtonElement.current.animate('fadeOutLeft', 1000)
        ItemElement.current.animate('fadeOutLeft', 1000)
        DefineElement.current.animate('fadeOutLeft', 1000)
        await ChangeElement.current.animate('fadeOutLeft', 1000)
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

    const save_password = async () => {
        if (newPassword && confirmPassword && currentPassword) {
            if (newPassword == confirmPassword) {
                setLoading(true)
                let result = await api.change_password(currentPassword, newPassword, user.matricula)
                if (result.error === '') {
                    setLoading(false)
                    setShow(true)
                    setError(result.success)
                    setConfirmPassword('')
                    setCurrentPassword('')
                    setNewPassword('')
                    setPasswordModal(!passwordModal)
                } else {
                    setShow(true)
                    setError(result.error)
                    setLoading(false)
                }
            } else {
                setShow(!show)
                setError('A confirmação de senha não combina!')
            }
        } else {
            setShow(true)
            setError('Campos não preenchidos!')
        }
    }

    return (
        <Container >
            <Card containerStyle={{ backgroundColor: "#FFFdFd", margin: 0, width: "100%", borderWidth: 0 }} wrapperStyle={{ flexDirection: 'row', justifyContent: 'space-around' }}  >
                <Animatable.View
                    ref={AvatarElement}
                    useNativeDriver
                >
                    <Avatar
                        rounded
                        title={(user.nome).substring(0, 2)}
                        onPress={pickImage}
                        size={80}
                        source={{ uri: 'data:image/jpeg;base64,' + image }}
                        activeOpacity={0.7}
                        containerStyle={{ backgroundColor: "#5597c8" }}
                    />
                </Animatable.View>
                <Animatable.View
                    ref={NameElement}
                    useNativeDriver
                >
                    <TextoCard txcolor="#666">
                        Nome:
                    </TextoCard>
                    <TextoCard txcolor="#000">
                        {user.nome.trim().split(" ").length >= 3 ? user.nome.trim().split(" ").filter((e, i) => (i == 0 || i == 2)).join(' ') : user.nome.trim()}
                    </TextoCard>
                    <TextoCard txcolor="#666">
                        Função:
                    </TextoCard>
                    <TextoCard txcolor="#000">
                        {user.no_funcao.trim().length > 22 ? `${user.no_funcao.trim().substring(0, 3)} ${user.no_funcao.trim().split(' ').slice(1, 5).join(' ')}` : user.no_funcao.trim()}
                    </TextoCard>
                </Animatable.View>
                <Animatable.View
                    ref={ButtonElement}
                    useNativeDriver
                    style={{ alignItems: 'center', justifyContent: 'center' }}
                >
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
                </Animatable.View>
            </Card>
            <Animatable.View
                ref={ItemElement}
                useNativeDriver
            >
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
                                {schedule.map((item, i) => (
                                    <Text key={i} >{item}</Text>
                                ))
                                }
                            </ListItem.Content>
                        </ListItem>
                    }
                </ListItem.Accordion>
            </Animatable.View>
            <Animatable.View
                ref={DefineElement}
                useNativeDriver
            >
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
            </Animatable.View>
            <Animatable.View
                ref={ChangeElement}
                useNativeDriver
            >
                <ListItem
                    bottomDivider
                    Component={TouchableHighlight}
                    containerStyle={{}}
                    disabledStyle={{ opacity: 0.5 }}
                    onPress={() => { setPasswordModal(!passwordModal), setNewPassword(''), setCurrentPassword(''), setConfirmPassword('') }}
                    pad={20}
                >
                    <Icon
                        name="lock-closed-outline"
                        size={15}
                        color="#2689C3"
                    />
                    <ListItem.Content>
                        <ListItem.Title>
                            <Text>Redefinir senha</Text>
                        </ListItem.Title>
                    </ListItem.Content>
                </ListItem>
            </Animatable.View>
            <Overlay
                isVisible={passwordModal}
                onBackdropPress={() => setPasswordModal(!passwordModal)}
                overlayStyle={{ width: '85%' }}
            >
                <Input
                    editable={!loading}
                    autoCapitalize="none"
                    secureTextEntry={true}
                    value={currentPassword}
                    onChangeText={(m) => setCurrentPassword(m)}
                    placeholderTextColor="#ccc"
                    placeholder="Senha Atual"
                    returnKeyType="go"
                    leftIcon={<Icon name="lock-closed" color="grey" />}
                    containerStyle={{ width: "100%" }}
                />
                <Input
                    editable={!loading}
                    autoCapitalize="none"
                    secureTextEntry={true}
                    value={newPassword}
                    onChangeText={(m) => setNewPassword(m)}
                    placeholderTextColor="#ccc"
                    placeholder="Nova Senha"
                    returnKeyType="go"
                    leftIcon={<Icon name="lock-closed" color="grey" />}
                    containerStyle={{ width: "100%" }}
                />
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
                    containerStyle={{ width: "100%" }}
                />
                <Button
                    icon={
                        <Icon
                            name="save-outline"
                            size={15}
                            color="#5597c8"
                        />
                    }
                    containerStyle={{ marginTop: 10 }}
                    titleStyle={{ marginHorizontal: 5 }}
                    title="Salvar"
                    type="outline"
                    onPress={save_password}
                />
            </Overlay>
            <Overlay
                isVisible={visible}
                onBackdropPress={() => setVisible(!visible)}
            >
                <TimeView>
                    <Texto>Horário de Notificação</Texto>
                    <Tooltip
                        popover={<Text>(Funcionalidade em Teste) O aplicativo irá enviar uma notificação no horario definido abaixo.</Text>}
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
                                color="#5597c8"
                            />
                        }
                        titleStyle={{ marginHorizontal: 5 }}
                        title="Salvar"
                        type="outline"
                        onPress={save_notification}
                    />
                </DivHorario>
            </Overlay>

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
                    confirmButtonColor="#5597c8"
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


export default memo(ProfileScreen);