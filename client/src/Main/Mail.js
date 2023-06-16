import React, { Component } from 'react';
import $ from "jquery";
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ReactMapGL, { Marker } from 'react-map-gl';
import Geocoder from 'react-mapbox-gl-geocoder';
import { io } from "socket.io-client";



class Mail extends Component {
  constructor(props)
  {
    super(props)

   // -17.82545263288703, 31.04918560295001

    this.state = {
     
    };
    

  }
  
  componentDidMount(){

    const socket = io(`ws://${window.location.href.split('//')[1].split('/')[0]}`);

    socket.on("broadcast", msg => {
       // alert(msg);
        var d = [];
        var m = [];
        
        try{
        d = JSON.parse(msg);

        d.forEach(element => {
         var o = {}
         o['latitude'] = Number( element.Latitude);
         o['longitude'] = Number( element.Longitude);
         
        // console.log(o);

         m.push(o);


          
        });
    
        }catch(ex)
        {
           console.log(ex);
        }

        m = JSON.parse(JSON.stringify( m));

      // alert(JSON.stringify(m));

      console.log(m)

       this.setState({markers:m})

     
      //this.setState({bays:d,refreshing:false})
      //console.log(JSON.parse(this.state.bays));
          
    });

    socket.on("connection", (socket) => {
     alert("connected");
      });

      socket.onAny((eventName, ...args) => {
        // ...
        alert();
      });
   
  }

render(){
  const { viewport, tempMarker, markers } = this.state;

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
        <div className="row stats-row">
          
        
        </div>
 
</div>

      
      </div>
   
    </div>
  </div>
</div>


          
    )
}

}

export default Mail;