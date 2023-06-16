import React, { Component } from 'react';
import Details from './Details';
import Assetreport from '../reports/Assetreport';
import Customercarereport from '../reports/Customercarereport';

class Maindash extends Component {
  constructor(props)
  {
    super(props)

    this.state = {
     role: localStorage.getItem('role'),
    };
  }

    renderDash(role) {
        switch(role) {
            case '9':
            return <Assetreport/>;
            case '4':
            return <Customercarereport/>;
            default:
            return <Details/>;
        }
    }

    render(){

        return( this.renderDash(this.state.role))
    }
}

export default Maindash;