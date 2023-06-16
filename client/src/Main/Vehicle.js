import React, { Component } from 'react';
import $ from "jquery";
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ReactMapGL, { Marker } from 'react-map-gl';
import Geocoder from 'react-mapbox-gl-geocoder';
import { io } from "socket.io-client";
import { Chart } from "react-google-charts";
import ReactTooltip from 'react-tooltip';
import moment from 'moment';
import ReactDatatable from '@ashvin27/react-datatable';
import Vehicledetails from '../components/Vehicledetails';

class Vehicle extends Component {
  constructor(props)
  {
    super(props)

    this.state = {
      selected:'details',
      selectedcar:'',

    };
    
    this.selectsettings = this.selectsettings.bind(this);
  }

  async getbookings(vehicle){
    var token = localStorage.getItem("token");
  
    $.ajax({
      type: 'get',
      url: '/api/vehiclebookings/'+vehicle,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', "Bearer " + token);
        },
        success: function (data) {
            if (data.status === 200) {

                this.setState({
                  bookings:data.data,     
                })
    
            }
          }.bind(this),
          error: function (xhr, error) {
           // alert(xhr.status);
           
        }
        } )
  }

  async getbalancetime(vehicle,balance,exempt){
    this.getbookings(vehicle);

    this.setState(
      {
        selectedcar:null,
      })

    var carbookings = this.state.bookings.filter(item => item.VehicleReg === vehicle);
    carbookings = carbookings.filter(item => (new Date()) < (new Date(item.EndTime)));

    var lasttime = new Date("12/12/12 12:34");
    var ele = [];

    if(carbookings.length > 1){
                   
      carbookings.forEach(element => {

          if(moment(element.EndTime).isAfter(lasttime)){
              console.log( element.EndTime +">" + lasttime);
              lasttime = element.EndTime;
              ele = element;
             
          }else{
              console.log( element.EndTime +"!>" + lasttime);
          }
          
      });

    }else if(carbookings.length === 1){
        lasttime = carbookings[0].EndTime
        ele = carbookings[0];
        // alert(lasttime);
    }else{
      //  alert();
        //no active bookings
        ele = [];
    }

                   //calculate remaining seconds
                   var rtime = 0;
                   var orgtime = 0; //in minutes
   
                   try{
                       var dif = new Date(lasttime).getTime() - new Date().getTime() ;
                       rtime = rtime + ((dif/1000));
                       
                       orgtime = orgtime + (ele.Validity * 3600);
                   
                   }catch(ex){
                       console.log();
                   }
                       
                  // alert(lasttime + ":lt , " + orgtime + ":org," + rtime + ":rtime");
   
                   if(!orgtime){
                       orgtime = 0;
                   }
   
                   if(rtime < 0){
                       rtime = 0;
                   }

    this.setState(
      {
        selectedcar:vehicle,
        selectedcarbalance:balance,
        selectedcarexempt:exempt,
        selectedcarduration:orgtime,
        selectedcarinitrem:rtime
      })

  }

    selectsettings(settings){
      this.setState({selected:settings});
    }

  
  componentDidMount(){
    var self = this;
    var token = localStorage.getItem("token");

    const params = new URLSearchParams(window.location.search);
    const reg = params.get("reg");

    if (this.state.selectedcar !== reg) {
      this.setState({ selectedcar: reg });
    }

  };

  componentDidUpdate(prevProps) {
   

    const params = new URLSearchParams(window.location.search);
    const reg = params.get("reg");

    if (this.state.selectedcar !== reg) {
      this.setState({ selectedcar: reg });
    }
  }

render(){
    const { selected } = this.state;

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
    <div className="col-lg-12">
     
      <div className="card top-products" style={{height:"90.5vh"}}>
        <div className="card-body">
          <h5 className="card-title">Details for : {this.state.selectedcar}<span className="card-title-helper">1</span></h5>
          <hr/>
            <div className="row">
          <div className="top-products-list col-md-1">
        
            <div onClick={()=>{this.selectsettings('details')}} className="product-item" style={{backgroundColor: selected === '' || selected === 'details'  ? '#f05154':'' }}>
              <h5>Details</h5>
            </div>
            <div onClick={()=>{this.selectsettings('exemption')}} className="product-item" style={{backgroundColor: selected === '' || selected === 'exemption'  ? '#f05154':'' }}>
              <h5>Exemption</h5>
            </div>
            <div className="product-item">
              <h5>...</h5>
            </div>
             
            
          </div>
          <div className=" col-md-11" style={{overflowY: "auto"}}>
            
              {
                {
                'details': <Vehicledetails vehicle={this.state.selectedcar}/>,
                }[selected]
              }
            </div>
            </div>
        </div>
      </div>
    </div>
 

   {
            }
   
  </div>

</div>

      
      </div>
   
    </div>
  </div>
</div>


          
    )
}

}

export default Vehicle;