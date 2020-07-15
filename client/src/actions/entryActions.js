// LAST CHECK ON 9:27 PM - 15/07/2020

import axios from 'axios';
import t from './types';
import {api_URL} from '../config.json';
import * as g from './globalActions';
import * as an from './appNavActions';

export const entry_check_session = () => dispatch => {
    dispatch (g.global_loading(true));
    axios({
        method: 'POST',
        url: api_URL+'check_session'
    })
    .then(({data}) => {
        let profile_data = {
            full_name: data.profile._json.first_name+' '+data.profile._json.last_name,
            email: data.profile._json.email,
            fb_id: data.profile._json.id,
            twitterTag: data.profile.twitterTag,
            facebook_save: data.profile.facebook_save,
            twitter_save: data.profile.twitter_save
        }
        dispatch({
            type: t.APP_USER_PROFILE,
            payload: profile_data
        })
        dispatch({
            type: t.APP_SET_HISTORICAL_DATA,
            payload: data.analysis
        })
        dispatch({
            type: t.ENTRY_LOGGED_IN,
            payload: true
        })
        dispatch (g.global_loading(false));
    })
    .catch(error => {
        dispatch (g.global_loading(false));
    })
}

export const entry_login = () => dispatch => {
    dispatch (g.global_loading(false,'Logging In'));
    axios({
        method: 'get',
        url: api_URL+'login'
    })
    .then(data => {
        console.log(data.data)
        dispatch({
            type: t.ENTRY_USER_INFO,
            payload: data
        })
        dispatch({
            type: t.ENTRY_LOGGED_IN,
            payload: true
        })
        dispatch (g.global_loading(false,''));
    })
    .catch(error => {
        dispatch (g.global_loading(false,''));
    })
}

export const entry_logout = () => dispatch => {
    dispatch(an.appnav_sidemenu_open(false));
    dispatch(g.global_loading(true,'Logging out'));
    axios({
        method: 'GET',
        url: api_URL+'logout'
    })
    .then(x => {
        dispatch(g.global_loading(false));
        dispatch({
            type: t.ENTRY_LOGGED_IN,
            payload: false
        })
    })
    .catch(x => {
        dispatch(g.global_loading(false));
        dispatch(g.global_error('There was an error trying to log you out'));
    })
}
