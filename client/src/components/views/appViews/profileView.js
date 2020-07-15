import React from 'react'

import { Container, TextField } from '@material-ui/core';
import {connect} from 'react-redux';

import ViewTitle from '../../applicationComponents/ViewTitle';

function ProfileView(props) {

    return (
        <Container>
           <ViewTitle title="My Profile"/>
            <TextField fullWidth value={props.full_name} label="Full Name" variant="outlined"/>
            <div className="space-1rem"></div>
            <TextField fullWidth value={props.email} label="Email" variant="outlined" />
            <div className="space-1rem"></div>
            <TextField fullWidth value={props.fb_id} label="Facebook ID" variant="outlined" />
            <div className="space-1rem"></div>
        </Container>
    )
}

const mstp = (state) => {
    return ({
        full_name: state.app.profile?state.app.profile.full_name?state.app.profile.full_name: '[missing]': '[missing]',
        email: state.app.profile?state.app.profile.email?state.app.profile.email: '[missing]': '[missing]',
        fb_id: state.app.profile?state.app.profile.fb_id?state.app.profile.fb_id: '[missing]': '[missing]',
    });
}

export default connect(mstp,null)(ProfileView);