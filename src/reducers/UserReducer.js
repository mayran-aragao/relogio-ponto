import AsyncStorage from "@react-native-async-storage/async-storage"

const initialState = {
    token:'',
    user:{},
    register:{},
    photo:'',
    notifications:[]
}

export default (state = initialState, action = {} ) => {
    let notifications = [...state.notifications]
    switch(action.type) {
        case 'setToken':
            AsyncStorage.setItem('token',action.payload.token)
            return {...state,token:action.payload.token}
        break
        case 'setUser':
            AsyncStorage.setItem('user',action.payload.user)
            return {...state, user:action.payload.user}
        break
        case 'setRegister':
            AsyncStorage.setItem('register',action.payload.register)
            return {...state, register:action.payload.register}
        break
        case 'setPhoto':
            AsyncStorage.setItem('photo',action.payload.photo)
            return {...state, photo:action.payload.photo}
        break
        case 'setNotifications':
            AsyncStorage.setItem('notifications',action.payload.notifications)
            return {...state, notifications:action.payload.notifications}
        break
    }
    return state
}