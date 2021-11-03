import AsyncStorage from "@react-native-async-storage/async-storage";

// const baseURL = 'https://pontomobile.armazemparaiba.com.br/'
const baseURL = 'http://172.16.45.121:3003'

function timeout(ms, promise) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            reject(new Error("timeout"))
        }, ms)
        promise.then(resolve, reject)
    })
}

const request = async (method, endpoint, params, token = null) => {
    method = method.toLowerCase()
    let fullUrl = `${baseURL}${endpoint}`
    let body = null

    switch (method) {
        case 'get':
            let queryString = new URLSearchParams(params).toString()
            fullUrl += `?${queryString}`
            break
        case 'post':
        case 'put':
        case 'delete':
            body = JSON.stringify(params)
            break
    }

    let headers = { 'Content-Type': 'application/json', 'Accept': 'application/json', }
    if (token) {
        headers.Authorization = `Bearer ${token}`
    }
    let json = timeout(7000, fetch(fullUrl, { method, headers, body })).then(async (response) => {
        let json = await response.json()
        return json
    }).catch(async (error) => {
        let json = { error: "Request timeout" }
        return json
    })

    return json
}

export default {
    getToken: async () => {
        return await AsyncStorage.getItem('token')
    },
    getOtilio: async () => {
        let json = await request('get', 'users/paulootilio')
        return json
    },
    getUser: async () => {
        return await AsyncStorage.getItem('user')
    },
    getNotification: async () => {
        return await AsyncStorage.getItem('notifications')
    },
    getPhoto: async () => {
        return await AsyncStorage.getItem('photo')
    },
    validadeToken: async () => {
        let token = await AsyncStorage.getItem('token')
        let json = await request('post', '/validar', {}, token)
        return json
    },
    login: async (email, password) => {
        let json = await request('post', '/signin', { email, password })
        return json
    },
    register: async (email, matricula, password) => {
        let json = await request('post', '/signup', { email, matricula, password })
        return json
    },
    logout: async () => {
        await AsyncStorage.removeItem('token')
        await AsyncStorage.removeItem('user')
        await AsyncStorage.removeItem('register')
    },
    getRegister: async (startDate, endDate, matricula) => {
        let token = await AsyncStorage.getItem('token')
        let json = await request('post', '/buscar_periodo', { startDate, endDate, matricula }, token)
        return json
    },
    getNsr: async (dt_ponto, nr_rep) => {
        let token = await AsyncStorage.getItem('token')
        let json = await request('post', '/buscar_nsr', { dt_ponto, nr_rep }, token)
        return json
    },
    saveRegister: async (dado) => {
        let token = await AsyncStorage.getItem('token')
        let json = await request('post', '/salvar_ponto', dado, token)
        return json
    },
    save_photo: async (photo, matricula) => {
        let token = await AsyncStorage.getItem('token')
        let json = await request('post', '/add_photo', { photo, matricula }, token)
        return json
    },
    take_photo: async (matricula) => {
        let token = await AsyncStorage.getItem('token')
        let json = await request('post', '/take_photo', { matricula }, token)
        return json
    },
    change_password: async (currentPassword, newPassword, matricula) => {
        let token = await AsyncStorage.getItem('token')
        let json = await request('post', '/change_password', { currentPassword, newPassword, matricula }, token)
        return json
    }
}


