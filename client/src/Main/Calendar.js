import React, { Component } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { io } from "socket.io-client";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

class Calendar extends Component {
  constructor(props)
  {
    super(props)

    this.state = {
      events:[]
    };
    

  }
  
  componentDidMount(){
   
  }

render(){

    return(


       <div className="body">
           <div className="loader">
    <div className="spinner-grow text-primary" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  </div>
  <div className="connect-container align-content-stretch d-flex flex-wrap">
  <Sidebar/>
    <div className="page-container">
    <Navbar/>
      <div className="page-content">
      <div className="main-wrapper">
      <div className="row">
    <div className="col-lg-12" >
      <div className="card savings-card ">
        <div className="card-body" style={{height:'113vh'}}>
       
        <FullCalendar
                                    plugins={[dayGridPlugin]}
                                    initialView="dayGridMonth"
                                    events={this.state.events}
                                    height={1250}
                                />
          </div>
</div>

</div>
</div>
 
</div>
      </div>
   
    </div>
  </div>
</div>
    )
}

}

export default Calendar;