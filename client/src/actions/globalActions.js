// LAST CHECK ON 9:28 PM - 15/07/2020

import t from './types';

export const global_loading = (loading, loading_message='') => {
    return ({
        type: t.GLOBAL_LOADING,
        payload: {loading, loading_message}
    })
}

export const global_error = (error_message=null, timeout=2000) => dispatch => {
    dispatch ({
        type: t.GLOBAL_ERROR,
        payload: error_message
    })
    setTimeout(() => {
        dispatch ({
            type: t.GLOBAL_ERROR,
            payload: null
        })
    },timeout)
}

export const global_success = (success_message=null, timeout=2000) => dispatch => {
    dispatch ({
        type: t.GLOBAL_SUCCESS,
        payload: success_message
    })
    setTimeout(() => {
        dispatch ({
            type: t.GLOBAL_SUCCESS,
            payload: null
        })
    },timeout)
}