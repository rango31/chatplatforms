import React, { Component } from 'react';
import $ from "jquery";
import moment from 'moment';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import ReactDatatable from '@ashvin27/react-datatable';

class Vehicledetails extends Component {
    constructor(props)
    {
      super(props)

      this.state = {
        currencies:[],
        selectedcar:'',
        selectedcarbalance:0,
        selectedcarexempt:1,
        selectedcarduration:1,
        selectedcarinitrem:1,
        bookings:[],
        balance:0,
      }

      this.columns = [
        {
            key: "BookingId",
            text: "Receipt",
            sortable: true
        },{
          key: "Notes",
          text: "Notes",
          sortable: true
      
        },{
          key: "PrecinctName",
          text: "Precinct",
          sortable: true
      
        },{
          key: "Date",
          text: "Added",
          className: "name",
          sortable: false,
          cell: record => {
           
              return (
                moment( record.DateCreated).format("DD MMM YYYY HH:mm")
                );
                   
          }
      },{
          key: "Date",
          text: "Expiring",
          className: "name",
          sortable: false,
          cell: record => {
            let active = false;
            let now = new Date()
    
              moment(record.EndTime).isAfter(now) ? active = true : active=false
           
              return (
                <div className="stats-card" style={{margin:"-15px",left:"-100px"}}>
                  
                <div className={active ? "stats-icon change-success" : "stats-icon change-danger"}>{
                 record.Type === 3 ? <></>:  moment( record.StartTime).format("HH:mm")
          }
          </div><div className={"stats-icon change-success"}>{
                moment( record.StartTime).format("HH:mm")
          }
          </div>
          </div>
                );
                   
          }
      },{
          key: "Status",
          text: "Status",
          sortable: true
          }
       
    
    ];

    this.config = {
      page_size: 6,
      show_filter: true,
      show_pagination: true,
      show_length_menu: true,
      button: {
          excel: false,
          print: true,
          csv: true,
          extra: false
      }
  }


    }
    
    componentDidMount() {
      const self = this;
      const token = localStorage.getItem("token");

      const params = new URLSearchParams(window.location.search);
      const reg = params.get("reg");
  
      if (this.state.selectedcar !== reg) {
        this.setState({selectedcar:reg})
        self.getBookings(token);
      }
    }

    componentDidUpdate(){
      const self = this;
      const token = localStorage.getItem("token");

      const params = new URLSearchParams(window.location.search);
      const reg = params.get("reg");
  
      if (this.state.selectedcar !== reg) {
        this.setState({selectedcar:reg})
        self.getBookings(token);
      }

     // 
    }

    getbalancetime(){
  
      let carbookings = this.state.bookings.filter(item => (new Date()) < (new Date(item.EndTime)));
  
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
                         rtime = (rtime + ((dif/1000)))/60;
                         orgtime = (orgtime + (ele.Validity * 3600))/60;
                     }catch(ex){
                         console.log(ex);
                     }
                         
                    // alert(lasttime + ":lt , " + orgtime + ":org," + rtime + ":rtime");
     
                     if(!orgtime){
                         orgtime = 0;
                     }
     
                     if(rtime < 0){
                         rtime = 0;
                     }

                     alert(rtime + ":rtime , " + orgtime + ":orgtime");
  
      this.setState(
        {
          selectedcarduration:orgtime,
          selectedcarinitrem:rtime
        })
  
    }

    getBookings = async (token) => {
      const params = new URLSearchParams(window.location.search);
      const reg = params.get("reg");

      let self = this;
      $.ajax({
      type: 'get',
      url: '/api/vehiclebookings/'+reg,
       beforeSend: function (xhr) {
           xhr.setRequestHeader('Authorization', "Bearer " + token);
       },
       success: async function (data) {
          if (data.status === 200) {
            if (!data.data){
              return;
            }
            let balance;

            if(data.data.length > 0){

             balance = data.data[0].Balance
            }else{
              balance = 0;
            }

      
           await self.setState({ bookings:data.data , balance});

           //self.getbalancetime();
      
             $('#loader').hide();
           }else{
             $('#loader').hide();
           }
         },error: function (xhr, error) {
           //alert(xhr.status);
       },
       })
      }
    
render(){

    const { bookings } = this.state;

   
  
    return(
     

            <div className="connect-container align-content-stretch d-flex flex-wrap">
                <div className="container-fluid">
               
        <div className="card-body">
          <div className="row ">
            
            <div className="col-md-8" style={{padding:"20px"}}>
                {/*
                  <CountdownCircleTimer
                  isPlaying
                  size={100}
                  strokeWidth={3}
                  initialRemainingTime={(this.state.selectedcarinitrem).toFixed(0)}
                  duration={(this.state.selectedcarduration).toFixed(0)}
                  colors={[
                    ['#00FF00', 0.3],
                    ['#FFFF00', 0.5],
                    ['red', 0.2],
                  ]}
                >
                {({ remainingTime }) => (remainingTime).toFixed(0)}
              </CountdownCircleTimer>
                */ }
              </div>
              <div className="col-md-4" style={{padding:"10px"}}>
            
                <h2 style={{margin:"30px"}} className='float-right'><small>Arrears : </small>{this.state.balance.toFixed(2)} ZWL</h2>
                
                </div>
         
                  
                  </div>
                  <div>
                  <div className="table-responsive table-house">
                    <ReactDatatable
                      className="table table-hover table-striped "
                      tHeadClassName=""
                      config={this.config}
                      onRowClicked={this.rowClickedHandler}
                      records={bookings}
                      columns={this.columns}
                      extraButtons={this.extraButtons}
                      />
                      </div>
                  </div>
              </div>
        
          
                
                </div>
                </div>
    )
    }
}

export default Vehicledetails;