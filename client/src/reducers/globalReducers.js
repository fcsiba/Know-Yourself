import t from '../actions/types';

const INITIAL_STATE = {
    loading: false,
    loading_message: 'Checking Session',
    error_message: null,
    success_message: null
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case t.GLOBAL_LOADING:
            return {...state, loading: action.payload.loading, loading_message: action.payload.loading_message}
        case t.GLOBAL_ERROR:
            return {...state, error_message: action.payload}
        case t.GLOBAL_SUCCESS:
            return {...state, success_message: action.payload}
        default:
            return state;
    }
}