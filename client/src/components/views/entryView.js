import React, { Component } from 'react';
import {connect} from 'react-redux';
import * as actions from '../../actions'; 

import Lottie from 'react-lottie';
import * as animationData from '../../lottie/loginpage-lottie.json';

import { Button, Container, Typography } from '@material-ui/core';

import logo from '../../media/Logo.svg';

class EntryView extends Component {
    state = {loading_message: 'Checking Session'};

    render() {
        const defaultOptions = {
            loop: true,
            autoplay: true, 
            animationData: animationData.default,
            rendererSettings: {
              preserveAspectRatio: 'xMidYMid slice'
            }
          };
        return (
            <>
                <Container className="entry main-view">
                    <Container className="logo-holder">
                        <img src={logo} alt=""/>
                    </Container>
                    <Container className="text-holder">
                        <Typography variant='h2'>
                            Analyze 
                        </Typography>
                        <Typography variant='h4'>
                            Yourself now 
                        </Typography>
                    </Container>
                    <Container className="login-button-holder">
                        <Button
                            href="http://localhost:7000/login"
                            size="large"
                            variant="contained"
                            fullWidth
                            color='primary'>
                            Login With Facebook
                        </Button>
                    </Container>
                    <Container className="meta-holder">
                        <Lottie
                            options={defaultOptions}
                        />
                    </Container>
                </Container>
            </>
        );
    }
}
 

const mstp = (state) => {
    return ({
        logged: state.entry.logged
    });
}


export default connect(mstp,actions)(EntryView);