import React from 'react'

import {connect} from 'react-redux';
import * as actions from '../../actions'; 

import { Typography } from '@material-ui/core';


function SuccessMessage(props) {

    if (props.message == null){
        return null;
    }
    return (
        <a className="message-box success" onClick={() => props.global_success()}>
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
        message: state.global.success_message
    });
}

export default connect(mstp,actions)(SuccessMessage);