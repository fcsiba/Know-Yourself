import React from 'react'

import {connect} from 'react-redux';
import * as actions from '../../actions'; 

import { Typography } from '@material-ui/core';

function ErrorMessage(props) {

    if (props.message == null){
        return null;
    }
    return (
        <a className="message-box error" onClick={() => props.global_error()}>
            <div className="message-text">
                <Typography>
                    {props.message}
                </Typography>
            </div>
        </a>
    )
}

const mstp = (state) => {
    return ({
        message: state.global.error_message
    });
}

export default connect(mstp,actions)(ErrorMessage);