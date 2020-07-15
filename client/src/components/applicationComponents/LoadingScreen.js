import React from 'react'

import Lottie from 'react-lottie';

import {connect} from 'react-redux';
import * as actions from '../../actions'; 

import { Typography } from '@material-ui/core';

import * as animationData from '../../lottie/loader.json';

function LoadingScreen(props) {
    const defaultOptions = {
        loop: true,
        autoplay: true, 
        animationData: animationData.default,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
    };
    if (!props.loading){
        return null;
    }
    return (
        <div className="loading-screen">
            <div className="wrapper">
                <div className='text'>
                    <Typography variant='h6'>
                        {props.message == undefined? 'Loading': props.message}
                    </Typography>
                </div>
                <div className='animation'>
                    <Lottie
                        options={defaultOptions}
                    />
                </div>
            </div>
        </div>
    )
}

const mstp = (state) => {
    return ({
        loading: state.global.loading,
        message: state.global.loading_message
    });
}

export default connect(mstp,actions)(LoadingScreen);