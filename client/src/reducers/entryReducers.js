import t from '../actions/types';

const INITIAL_STATE = {
    logged: false,   
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case t.ENTRY_LOGGED_IN:
            return {...state, logged: action.payload}
        case t.ENTRY_LOADING:
            return {...state, loading: action.payload}
        default:
            return state;
    }
}