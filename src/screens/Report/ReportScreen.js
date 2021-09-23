import React, { Component } from 'react';
import { StatusBar, Platform, TouchableHighlightBase } from 'react-native';
import { Divider, Button,Overlay } from 'react-native-elements';
import { ActivityIndicator } from 'react-native'
import moment from 'moment'
import Alerta from 'react-native-awesome-alerts';
import api from '../../api'
import Lista from '../../components/Lista'
import CustomModal from '../../components/CustomModal';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {
    Container,
    LoadingArea,
    Div,
    RegisterList,
    Header,
    Descritivo,
    ModalDiv,
    ModalLabel,
    ModalView,
    ModalText,
    ModalScroll,
} from './Style'
import CalendarPicker from 'react-native-calendar-picker'

export default class Calendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedStartDate: null,
            selectedEndDate: null,
            loading: false,
            registros: null,
            showAlert: false,
            error: null,
            modalVisible: false,
            horarios: null,
            daySelected: null,
        };
        this.onDateChange = this.onDateChange.bind(this);
    }

    onDateChange(date, type) {
        if (type === 'END_DATE') {
            this.setState({
                selectedEndDate: date,
            });
        } else {
            this.setState({
                selectedStartDate: date,
                selectedEndDate: null,
            });
        }
    }
    search = async (startDate, endDate) => {
        const user = JSON.parse(await api.getUser())
        if (user) {
            if (startDate && endDate) {
                let init = moment(startDate).format('YYYY-MM-DD')
                let end = moment(endDate).format('YYYY-MM-DD')
                let matricula = user.matricula
                this.setState({ loading: true });
                const res = await api.getRegister(init, end, matricula)
                if (res.error) {
                    this.setState({ error: res.error });
                    this.setState({ showAlert: true });
                    this.setState({ loading: false });
                } else {
                    let registro = (res).slice(0).reverse()
                    this.setState({ loading: false });
                    this.setState({ registros: registro });
                }
            } else {
                this.setState({ error: "Selecione uma data!" });
                this.setState({ showAlert: true });
                this.setState({ loading: false });
            }
        } else {
            this.setState({ error: "Aconteceu um erro inesperado, faça login novamente!" });
            this.setState({ showAlert: true });
            this.setState({ loading: false });
        }
    }
    viewReport = (item) => {
        // let dias =[...new Set(b.map(a=>a.dt_ponto))]     exemplo
        // registros.filter(a => a.dt_ponto == dias[0])

        let hr_pontos = (this.state.registros.filter(a => a.dt_ponto == item)).slice(0).reverse()
        this.setState({ horarios: hr_pontos })
        this.setState({ daySelected: moment(item, 'YYYY-MM-DD').format('DD/MM/YYYY') })
        this.setState({ modalVisible: true })
    }

    render() {
        const { selectedStartDate, selectedEndDate, loading, registros, showAlert, error, modalVisible, horarios, daySelected } = this.state;
        const maxDate = moment(new Date()).format('YYYY-MM-DD');
        const startDate = selectedStartDate
        const endDate = selectedEndDate
        return (
            <Container>
                {horarios &&
                    <Overlay overlayStyle={{height:240}} isVisible={modalVisible} onBackdropPress={() => this.setState({ modalVisible: false })}>
                        <Divider orientation="horizontal" />
                        <ModalDiv>
                            <Icon name="time-outline" size={25} color="black" />
                            <ModalLabel>HORÁRIOS</ModalLabel>
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
                    <Div>
                        <CalendarPicker
                            startFromMonday={true}
                            allowRangeSelection={true}
                            allowBackwardRangeSelect={true}
                            maxDate={maxDate}
                            previousTitle="Anterior"
                            nextTitle="Próximo"
                            selectYearTitle="Selecione um ano "
                            selectMonthTitle="Selecione um mês "
                            weekdays={['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom']}
                            months={['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']}
                            selectedDayColor="#5597c8"
                            selectedDayTextColor="#FFFFFF"
                            onDateChange={this.onDateChange}
                        />
                    </Div>
                }
                {registros &&
                    <>
                        <Header>
                            <Descritivo>Loja: {registros[0].cd_empresa}</Descritivo>
                        </Header>
                        <RegisterList
                            showsVerticalScrollIndicator={false}
                            data={[...new Set(registros.map(a => a.dt_ponto))]}
                            renderItem={({ item }) => <Lista data={item} lista={registros} viewAction={() => this.viewReport(item)} />}
                            keyExtractor={item => item}
                        />
                    </>
                }
                {!registros &&
                    <Div style={{ flex: 1, justifyContent: 'flex-end' }}>
                        <Divider orientation="horizontal" />
                        <Button
                            // ViewComponent={LinearGradient}
                            // linearGradientProps={{
                            //     colors: ['rgba(0,0,0,0.8)', "#B30506"],
                            // }}
                            type="outline"
                            title="Buscar registros"
                            titleStyle={{ color: "#5597c8" }}
                            containerStyle={{ width: "100%", padding: 10 }}
                            buttonStyle={{ borderColor: "#5597c8" }}
                            onPress={() => this.search(startDate, endDate)}
                        />
                    </Div>
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
                            onPress={() => this.setState({ registros: null, selectedStartDate: null, selectedEndDate: null })}
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
                        onCancelPressed={() => this.setState({ showAlert: false })}
                        onConfirmPressed={() => this.setState({ showAlert: false })}
                        contentContainerStyle={{ width: "100%" }}
                        actionContainerStyle={{ justifyContent: "space-around" }}
                        cancelButtonStyle={{ height: 35, width: "100%", justifyContent: 'center', alignItems: "center" }}
                        confirmButtonStyle={{ height: 35, width: "100%", justifyContent: 'center', alignItems: "center" }}
                    />
                }
            </Container>
        );
    }
}