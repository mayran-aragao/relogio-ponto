import React, { useRef, useState, useEffect } from 'react';
import { StatusBar, Animated, Dimensions, } from 'react-native';
import { Divider, Button, Overlay } from 'react-native-elements';
import { ActivityIndicator } from 'react-native'
import moment from 'moment'
import Alerta from 'react-native-awesome-alerts';
import api from '../../api'
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/Ionicons';
import {
    Container,
    LoadingArea,
    Div,
    Header,
    Descritivo,
    ModalDiv,
    ModalLabel,
    ModalView,
    ModalText,
    ModalScroll,
    Div2,
    Texto
} from './Style'
import CalendarPicker from 'react-native-calendar-picker'

const { width, height } = Dimensions.get('screen');


const Calendar = () => {
    const [selectedStartDate, setSelectedStartDate] = useState(null)
    const [selectedEndDate, setSelectedEndDate] = useState(null)
    const [loading, setLoading] = useState(false)
    const [registros, setRegistros] = useState(null)
    const [showAlert, setShowAlert] = useState(false)
    const [error, setError] = useState('')
    const [modalVisible, setModalVisible] = useState(false)
    const [horarios, setHorarios] = useState(null)
    const [daySelected, setDaySelected] = useState(null)

    const CalendarElement = useRef()
    const ButtonElement = useRef()


    useEffect(() => {
        CalendarElement.current.animate('fadeInLeftBig', 1500)
        ButtonElement.current.animate('fadeInLeftBig', 1500)
    }, [])


    const onDateChange = (date, type) => {
        if (type === 'END_DATE') {
            setSelectedEndDate(date)
        } else {
            setSelectedStartDate(date)
            setSelectedEndDate(null)
        }
    }
    const search = async (startDate, endDate) => {
        const user = JSON.parse(await api.getUser())
        if (user) {
            if (startDate && endDate) {
                let init = moment(startDate).format('YYYY-MM-DD')
                let end = moment(endDate).format('YYYY-MM-DD')
                let matricula = user.matricula
                setLoading(true)
                const res = await api.getRegister(init, end, matricula)
                if (res.error) {
                    setError(res.error)
                    setShowAlert(true)
                    setLoading(false)
                } else {
                    let registro = (res).slice(0).reverse()
                    setLoading(false)
                    setRegistros(registro)
                }
            } else {
                setError("Selecione uma data!")
                setShowAlert(true)
                setLoading(false)
            }
        } else {
            setError("Aconteceu um erro inesperado, fa??a login novamente!")
            setShowAlert(true)
            setLoading(false)
        }
    }

    const clearSearch = () => {
        setRegistros(null)
        setSelectedStartDate(null)
        setSelectedEndDate(null)
    }
    const viewReport = (item) => {

        let hr_pontos = (registros.filter(a => a.dt_ponto == item)).slice(0).reverse()
        setHorarios(hr_pontos)
        setDaySelected(moment(item, 'YYYY-MM-DD').format('DD/MM/YYYY'))
        setModalVisible(true)
    }

    const maxDate = moment(new Date()).format('YYYY-MM-DD');
    const startDate = selectedStartDate
    const endDate = selectedEndDate
    const scrollY = React.useRef(new Animated.Value(0)).current
    return (
        <Container>
            {horarios &&
                <Overlay overlayStyle={{ height: 240 }} isVisible={modalVisible} onBackdropPress={() => setModalVisible(false)}>
                    <Divider orientation="horizontal" />
                    <ModalDiv>
                        <Icon name="time-outline" size={25} color="black" />
                        <ModalLabel>HOR??RIOS</ModalLabel>
                        <ModalLabel>{daySelected}</ModalLabel>
                    </ModalDiv>
                    <Divider orientation="horizontal" />

                    <ModalScroll>
                        {horarios.map((item, index) => (
                            <ModalView key={index} style={{ justifyContent: 'space-between' }} >
                                <ModalView style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                    <ModalText style={{ marginBottom: 10 }}>{(item.hr_ponto).replace(".", ":") + " Hrs"}</ModalText>
                                </ModalView>

                                <ModalView style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Icon name="checkmark-outline" size={30} color="#5597c8" />
                                </ModalView>
                            </ModalView>
                        ))
                        }
                    </ModalScroll>
                </Overlay>
            }
            {!registros &&
                <Animatable.View
                    ref={CalendarElement}
                    useNativeDriver
                    style={{ paddingTop: 20 }}
                >
                    <CalendarPicker
                        startFromMonday={true}
                        allowRangeSelection={true}
                        allowBackwardRangeSelect={true}
                        maxDate={maxDate}
                        previousTitle="Anterior"
                        nextTitle="Pr??ximo"
                        selectYearTitle="Selecione um ano "
                        selectMonthTitle="Selecione um m??s "
                        weekdays={['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom']}
                        months={['Janeiro', 'Fevereiro', 'Mar??o', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']}
                        selectedDayColor="#5597c8"
                        selectedDayTextColor="#FFFFFF"
                        onDateChange={(data, type) => onDateChange(data, type)}
                    />
                </Animatable.View>
            }
            {registros &&
                <>
                    <Header>
                        <Descritivo>Loja: {registros[0].cd_empresa}</Descritivo>
                    </Header>
                    <Animated.FlatList
                        contentContainerStyle={{ paddingTop: StatusBar.currentHeight || 42, padding: 10 }}
                        showsVerticalScrollIndicator={false}
                        data={[...new Set(registros.map(a => a.dt_ponto))]}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                            { useNativeDriver: true }
                        )}
                        renderItem={({ item, index }) => {
                            const inputRange = [
                                -1,
                                0,
                                97 * index,
                                97 * (index + 2)
                            ]
                            const scale = scrollY.interpolate({
                                inputRange,
                                outputRange: [1, 1, 1, 0]
                            })
                            return <Animated.View style={{ transform: [{ scale }], marginBottom: 20, borderRadius: 12 }}>
                                <Button
                                    onPress={() => viewReport(item)}
                                    type="clear"
                                    title={
                                        <Div2>
                                            <Texto>{moment(item, "YYYY-MM-DD").format('DD/MM/YYYY')}</Texto>
                                            <Texto>Hor??rios ....</Texto>
                                            <Icon name="calendar-outline" size={20} color="#5597c8"></Icon>
                                        </Div2>
                                    }
                                    containerStyle={{
                                        padding: 10,
                                        backgroundColor: '#FFFdFd',
                                        borderRadius: 12,
                                        shadowColor: "#000",
                                        shadowOffset: {
                                            width: 0,
                                            height: 10,
                                        },
                                        shadowOpacity: 0.3,
                                        shadowRadius: 20,
                                        elevation: 15,
                                    }}

                                />
                            </Animated.View>
                        }}
                        keyExtractor={item => item}
                    />
                </>
            }
            {!registros &&
                <Animatable.View
                    ref={ButtonElement}
                    useNativeDriver
                    style={{ flex: 1, justifyContent: 'flex-end' }}
                >
                    <Divider orientation="horizontal" />
                    <Button
                        type="outline"
                        title="Buscar registros"
                        titleStyle={{ color: "#5597c8" }}
                        containerStyle={{ width: "100%", padding: 10 }}
                        buttonStyle={{ borderColor: "#5597c8" }}
                        onPress={() => search(startDate, endDate)}
                    />
                </Animatable.View>
            }

            {registros &&
                <Div style={{ justifyContent: 'flex-end' }}>
                    <Divider orientation="horizontal" />
                    <Button
                        title="Limpar busca"
                        type="outline"
                        titleStyle={{ color: '#5597c8' }}
                        containerStyle={{ width: "100%", padding: 10 }}
                        buttonStyle={{ borderColor: '#5597c8' }}
                        onPress={() => { clearSearch() }}
                    />
                </Div>
            }

            {loading &&
                <LoadingArea>
                    <ActivityIndicator size="large" color="#fff" />
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
        </Container>
    );
}
export default Calendar;