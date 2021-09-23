import React, {createContext, useContext, useReducer} from 'react'

import UserReducer from '../reducers/UserReducer'

const initialState = {
    user: UserReducer()
}
const MainReducer = (state,action) => ({
    user: UserReducer(state.user, action)
})

export const StateContext = createContext();

export const StateProvider = ({children}) => {
    const [state,dispatch] = useReducer(MainReducer,initialState)

    return (
        <StateContext.Provider value={[state,dispatch]}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateValue = () => useContext(StateContext)