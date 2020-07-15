import React, {useEffect, useState} from 'react'

import { FormControlLabel, Container, Checkbox, Button } from '@material-ui/core';

import ViewTitle from '../../applicationComponents/ViewTitle';

import {connect} from 'react-redux';
import * as actions from '../../../actions';

function SettingView(props) {

    const [facebookCheck, setFacebookCheck] = useState(false);
    const [twitterCheck, setTwitterCheck] = useState(false);
    
    useEffect(() => {
        setFacebookCheck(props.facebookCheck == true)
        setTwitterCheck(props.twitterCheck == true)
    },[])
    console.log(props)

    return (
        <Container>
            <ViewTitle title="Setting"/>
            <FormControlLabel
                control={<Checkbox checked={facebookCheck} onChange={(e) => setFacebookCheck(!facebookCheck)} color="primary" />}
                label="Save and search Facebook posts"
            />
            <FormControlLabel
                control={<Checkbox checked={twitterCheck} onChange={(e) => setTwitterCheck(!twitterCheck)} color="primary" />}
                label="Save and search Twitter posts"
            />
            <div className='space-1rem'></div>
            <Button
                onClick={()=> props.app_update_save_setting(facebookCheck,twitterCheck)}
                disabled={facebookCheck == props.facebookCheck && twitterCheck == props.twitterCheck}
                color='primary'
                size="large"
                variant="contained"
                fullWidth
            >Save settings</Button>
        </Container>

    )
}

const mstp = (state) => {
    return ({
        twitterCheck: state.app.profile?state.app.profile.twitter_save == true:false,
        facebookCheck: state.app.profile?state.app.profile.facebook_save == true:false,
    });
}

export default connect(mstp,actions)(SettingView);
