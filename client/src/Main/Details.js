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

class Details extends Component {
  constructor(props)
  {
    super(props)

    this.state = {
      tasks:[],
      bookings:[],
      vehicles:[],
      zones:[],
      precincts:[],
      selectedid:0,
      logging:false,
      payrate:0.00,
      totalowing:0.00,
      lastthirty:{change:0,amount:0,status:"flat"},
      lastseven:{change:0,amount:0,status:"flat"},
      today:{change:0,amount:0,status:"flat"},
      bookings_count:0,
      online:0,
      currentconnectedbrowsers:0,
      currentconnectedphones:0,

    };

    this.config = {
      page_size: 5,
      show_filter: false,
      show_pagination: false,
      show_length_menu: false,
      button: {
          excel: false,
          print: false,
          csv: false,
          extra: false
      }
  }

    this.columns = [
      {
          key: "Channel",
          text: "Channel",
          sortable: true
      },{
        key: "Target",
        text: "Target",
        sortable: true
    },{
      key: "Change",
      text: "Change",
      className: "name",
      sortable: true,
      cell: record => {
       
          return (
            
            <div className="stats-card" style={{margin:"-15px",left:"-100px"}}>
            <div className={record.Change === 0 ? "stats-icon change-primary" : parseFloat( record.Change) > 0 ?  "stats-icon change-success" : "stats-icon change-danger"}>
              {record.Change}% 
              <i className="material-icons">{record.Change === 0? "trending_flat" :record.Change > 0 ? "trending_up":"trending_down"  }</i>
        
          </div>
          </div>
          
             
          );
               
      }
  },{
    key: "Collected",
    text: "Collected",
    sortable: true
},{
  key: "Status",
  text: "Status",
  sortable: true
}
     

  ];
    
    this.updatestatus = this.updatestatus.bind(this);
    this.updatetaskstatusactive = this.updatetaskstatusactive.bind(this);
    this.updatetaskstatusdone = this.updatetaskstatusdone.bind(this);
    this.logcar = this.logcar.bind(this);
    this.gettarget = this.gettarget.bind(this);
    this.getTasks = this.getTasks.bind(this);
    this.getStats = this.getStats.bind(this);

  }

  changeview(e){
  }

updatetaskstatusactive(e){
 
  this.updatestatus(e.target.id, "active")
}

updatetaskstatusdone(e){
  
  this.updatestatus(e.target.id, "done")
}

updatestatus(id , status){
  let self = this;

  var token = localStorage.getItem("token");

$.ajax({
  type: 'put',
  data: { "id": id,"status": status },
  ContentType: "application/json",
  url: '/api/updatetaskstatus',
    beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', "Bearer " + token);
    },
    success: function (data) {
        if (data.status === 200) {
          self.getTasks(token);
          
           alert(data.message)
        }else{
          alert(data.message)

        }
      },error: function (xhr, error) {
        alert(error)
       
    },
    })
  
}

logcar(e){
  e.preventDefault();
  var token = localStorage.getItem("token");

  $('.logmsg').html("<h6 style='color:lightgrey'>processing</h6>");
  $('.loader').show()
                
  $.ajax({
      type: 'POST',
      url: '/api/logcar',
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', "Bearer " + token);
    },
      data: { "regnumber": e.target.regnumber.value,"status": e.target.status.value ,"hrs":e.target.hrs.value,"bay":e.target.bayid.value},
      ContentType: "application/x-www-form-urlencoded",
      success: function (data) {

          if (data.success === true) {

              $('.logmsg').html("<h6 style='color:lightgreen'>" + data.message + "</h6>");

          
          } else {
              $('.logmsg').html("<h6 style='color:red'>" + data.message + "</h6>");
             // document.getElementById("loader").style.display = "none";
             
          }
      },
      error: function (xhr, error) {
        
         // document.getElementById("loader").style.display = "none";

          $('.logmsg').html("<h6 style='color:red'>Error:" +  xhr.status + "</h6>");
         // document.getElementById("loader").style.display = "none";
      },
  });

}

gettarget = () => {
  var target = this.state.precincts.reduce((a, item) => 
  { 
    return a + (item.Target) 
  },0).toFixed(2)

  return target;
}

getTasks = (token) => {
    let self = this;
  $.ajax({
 type: 'get',
 url: '/api/tasks',
   beforeSend: function (xhr) {
       xhr.setRequestHeader('Authorization', "Bearer " + token);
   },
   success: function (data) {
       if (data.status === 200) {

           self.setState({
             tasks:data.data,          
           })

         $('#loader').hide();

           
       }else{
        // alert(data.message);
         $('#loader').hide();

       }
     },error: function (xhr, error) {
       //alert(xhr.status);
      
   },
   })
}

getStats = (token) => {
  let self = this;
$.ajax({
type: 'get',
url: '/api/stats',
 beforeSend: function (xhr) {
     xhr.setRequestHeader('Authorization', "Bearer " + token);
 },
 success: function (data) {
    if (data.status === 200) {
      if (!data.data){
        return;
      }
      let { tasks ,vehicles , payrate , totalowing , lastthirty , lastseven , today,bookings_count, devices} = (data.data[0]);
      let online = 0;
      devices.forEach(element => {
        if(moment().diff(element.LastUpdate, 'minutes') < 6){
          online = online + 1;
        }
      })

     self.setState({
       tasks:tasks,
        vehicles,
        totalowing:totalowing ,
        payrate:payrate,
        refreshing:false,
        lastthirty:lastthirty,
        lastseven:lastseven,
        today:today,
        bookings_count:bookings_count,
        online:online
       })

       $('#loader').hide();

         
     }else{
      // alert(data.message);
       $('#loader').hide();

     }
   },error: function (xhr, error) {
     //alert(xhr.status);
    
 },
 })
}

formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});
  
  componentDidMount(){
    var self = this;
    var token = localStorage.getItem("token");
    
    this.getTasks(token)
    this.getStats(token);

    $.ajax({
    type: 'get',
    url: '/api/precincts',
      beforeSend: function (xhr) {
          xhr.setRequestHeader('Authorization', "Bearer " + token);
      },
      success: function (data) {
          if (data.status === 200) {
          
            
              self.setState({
                precincts:data.data,          
              })

            // alert( self.gettarget());

            $('#loader').hide();

              
          }else{
          //  alert(data.message);
            $('#loader').hide();
  
          }
        },error: function (xhr, error) {
          //alert(xhr.status);
          
      },
      })
      
    let current = `ws://${window.location.href.split('//')[1].split('/')[0]}`;
    let newport = 3001;
    let oldport = current.split(':')[2];
    current = current.replace(oldport,newport);

    const socket = io.connect(current, {
      query: {token ,"from":'browser'}
    });
    

    socket.on("broadcast", msg => {

 try{
        var { tasks ,vehicles , payrate , totalowing , lastthirty , lastseven , today,bookings_count , devices , currentconnectedbrowsers , currentconnectedphones } = ((JSON.parse(msg))[0]);

        let online = 0;
      devices.forEach(element => {
        if(moment().diff(element.LastUpdate, 'minutes') < 6){
          online = online + 1;
        }
      })

       // alert(payrate);

      this.setState({
        tasks:tasks,
         vehicles,
         totalowing:totalowing ,
         payrate:payrate,
         refreshing:false,
         lastthirty:lastthirty,
         lastseven:lastseven,
         today:today,
         bookings_count:bookings_count,
         online:online,
         currentconnectedbrowsers,
         currentconnectedphones
        })
      }catch(ex){

      }
          
    });

    //this.loadmarkers();
  }

render(){
  //alert( this.state.bays.filter(item => item.parkingStatus == 0).length)
  const { lastseven,lastthirty,today,bookings_count } = this.state;



  var channels = [
    {"Channel":"Onstreet Marshals","Target":this.gettarget(),"Change":today.change.toFixed(2),"Collected":this.formatter.format(today.amount),"Status":"Active"},
    {"Channel":"USSD - Econet","Target":"0.00","Change":"0","Collected":"0.00","Status":"InActive"},
    {"Channel":"USSD - NETONE","Target":"0.00","Change":"0","Collected":"0.00","Status":"InActive"}
  ]
  //this.loadmarkers();

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
   <div className="col-lg-3 col-md-12">
     <div className="card stats-card">
     <div className="card-body">
         <div className="stats-info">
           <h5 className="card-title"><small>{ this.formatter.format(lastthirty.amount)} <br/><small>USD{this.formatter.format(lastthirty.usdamount)} </small></small></h5>
           <p className="stats-text">last 30 days</p>
         </div>
         <div className={lastthirty.status === "flat"? "stats-icon change-primary" :lastthirty.status === "up" ? "stats-icon change-success":"stats-icon change-danger"  }>
           <i className="material-icons">{lastthirty.status === "flat"? "trending_flat" :lastthirty.status === "up" ? "trending_up":"trending_down"  }</i><br/>
           <span className={lastthirty.status === "flat"? "stats-change change-primary" :lastthirty.status === "up" ? "stats-change stats-change-success":"stats-change stats-change-danger"}> {lastthirty.status === "up" ? "+"+lastthirty.change.toFixed(0)+"%":lastthirty.status === "flat" ?lastthirty.change.toFixed(2)+"%" :lastthirty.change.toFixed(2)+"%" } </span>
         </div>
       </div>
     </div>
   </div>
   <div className="col-lg-3 col-md-12">
     <div className="card stats-card">
     <div className="card-body">
         <div className="stats-info">
           <h5 className="card-title"><small>{this.formatter.format(lastseven.amount)}<br/><small>USD{this.formatter.format(lastseven.usdamount)}</small></small></h5>
           <p className="stats-text">last 7 days</p>
         </div>
         <div className={lastseven.status === "flat"? "stats-icon change-primary" :lastseven.status === "up" ? "stats-icon change-success":"stats-icon change-danger"  }>
           <i className="material-icons">{lastseven.status === "flat"? "trending_flat" :lastseven.status === "up" ? "trending_up":"trending_down"  }</i><br/>
           <span className={lastseven.status === "flat"? "stats-change change-primary" :lastseven.status === "up" ? "stats-change stats-change-success":"stats-change stats-change-danger"}> {lastseven.status === "up" ? "+ "+lastseven.change.toFixed(0)+"  %":lastseven.status === "flat" ?lastseven.change.toFixed(2)+"%" :lastseven.change.toFixed(0)+"%" } </span>
         </div>
       </div>
     </div>
   </div>
   <div className="col-lg-3 col-md-12">
     <div className="card  stats-card">
     <div className="card-body">
         <div className="stats-info">
           <h5 className="card-title"><small>{this.formatter.format(today.amount)}<br/><small>USD{this.formatter.format(today.usdamount)} </small></small></h5>
           <p className="stats-text">Today</p>
         </div>
         <div className={today.status === "flat"? "stats-icon change-primary" :today.status === "up" ? "stats-icon change-success":"stats-icon change-danger"  }>
           <i className="material-icons">{today.status === "flat"? "trending_flat" :today.status === "up" ? "trending_up":"trending_down"  }</i><br/>
           <span className={today.status === "flat"? "stats-change change-primary" :today.status === "up" ? "stats-change stats-change-success":"stats-change stats-change-danger"}> {today.status === "up" ? "+ "+today.change.toFixed(0)+"  %":today.status === "flat" ?today.change.toFixed(2)+"%" : today.change.toFixed(0)+"%" } </span>
         </div>
       </div>
     </div>
   </div>
   <div className="col-lg-3 col-md-12">
     <div className="card stats-card">
       <div className="card-body">
         <div className="stats-info">
           <h5 className="card-title">{ this.formatter.format(this.state.totalowing) }
           <span className="stats-change "></span></h5>
          
           <small > - </small> 
           <p style={{paddingTop:"11px"}} className="stats-text">Total Owing</p>
         </div>
         <div className="stats-icon change-danger">
           <i className="material-icons">money_off</i>
         </div>
       </div>
     </div>
   </div>
 </div>

 
  

  <div className="row">
    <div className="col-lg-4">
     
      <div className="card top-products" style={{height:"72.5vh" , overflowY: "auto"}}>
        <div className="card-body">
          <h5 className="card-title">Running Tasks<span className="card-title-helper">{this.state.tasks.length}</span></h5>
          <Chart
            width={'350px'}
            height={'150px'}
            chartType="PieChart"
            loader={<div>Loading Chart</div>}
            data={[
              ['Precinct', 'Tasks Status'],
              ['New', this.state.tasks.filter(item => item.Status === "new").length],
              ['In progress', this.state.tasks.filter(item => item.Status ==="active").length],
              //['Completed', this.state.tasks.filter(item => item.Status==="complete").length],
              ['Unconfirmed', this.state.tasks.filter(item => item.Status==="done").length],
              
            ]}
            options={{
              title: '',
              slices: {0: {color: 'red'},1: {color: 'orange'}, 2: {color: 'green'}},
              is3D: true,
            }}
            rootProps={{ 'data-testid': '2' }}
          />
          <hr/>
          <div className="top-products-list">
          {this.state.tasks.filter((task)=> task.Status !== 'complete' ).map((item) =>{

            var id = item.TaskId;

                return(
                  <div>
                  <div data-tip="City Parking" data-for={id.toString()} className="product-item">
              <h5>{item.Description}</h5>
              
              {
                item.Status === "new"?
                <img className="product-item-status product-item-success" style={{height:"10px"}} src="./assets/images/red.png"/>
                :
                item.Status === "active"?
                <img className="product-item-status product-item-success" style={{height:"10px"}} src="./assets/images/orange.png"/>
                :
                item.Status === "complete"?
                <img className="product-item-status product-item-success" style={{height:"10px"}} src="./assets/images/green.png"/>
                :<img className="product-item-status product-item-success" style={{height:"10px"}} src="./assets/images/blue.png"/>
                
              }
              
            </div>
             <ReactTooltip delayHide={75} clickable={true} id={id.toString()} aria-haspopup='true' role='example'>
             <p>Task : {item.TaskId}</p>
             <button style={{margin:"10px"}} id={id} onClick={this.updatetaskstatusactive} className="btn btn-warning btn-sm ">Active</button>
             <button style={{margin:"10px"}} id={id} onClick={this.updatetaskstatusdone}x className="btn btn-success btn-sm">Done</button>
             <br/><br/>
             <h6>{item.Description}</h6>
             <br/>
              <ul>
              <li>{item.FirstName} {item.LastName} </li>
              <li>{item.PhoneNumber} </li>
              
            </ul>
           
             </ReactTooltip>
             </div>

                )
            }
                )}
            
          </div>
        </div>
      </div>
    </div>
    <div className="col-lg-8">
     
     <div className="card top-products" style={{height:"72.5vh",overflowY: "auto"}}>
       <div className="card-body">
         <h5 className="card-title">Collection Channels<span className="card-title-helper">Total Bookings : {bookings_count}</span></h5>
         <div className="row stats-row">
            <div className="col-lg-6 col-md-12">
            <Chart
              width={'100%'}
              height={'150px'}
              chartType="PieChart"
              loader={<div>Loading Chart</div>}
              data={[
                ['Channel', 'Count'],
                ['Onstreet Marshals',bookings_count],
                ['USSD - Econet', 0],
                ['USSD - Netone', 0]
                
              ]}
              options={{
                title: '',
                slices: {0: {color: 'red'},1: {color: 'orange'}, 2: {color: 'green'}},
                is3D: true,
              }}
              rootProps={{ 'data-testid': '2' }}
            />
            <hr/>
            </div>
            <div className="col-lg-3 col-md-12">
            <div className="card ">
       <div className="card-body">
         <div className="stats-info">
           <h5 className="card-title">
           
            <span className="stats-change stats-change-danger">
            {
               this.state.payrate
            }
            
            %</span></h5>
           <p className="stats-text">Pay Rate</p>
         </div>
         <div className="stats-icon change-danger">
           <i className="material-icons">star_rate</i>
         </div>
       </div>
     </div>
            <hr/>
            </div>
            <div className="col-lg-3 col-md-12">
            <div className="card ">
       <div className="card-body">
         <div className="stats-info">
           <h5 className="card-title">
           
            <span className="stats-change stats-change-danger">{this.state.currentconnectedphones}</span></h5>
           <p className="stats-text">Online Marshals</p>
         </div>
         <div className="stats-icon change-danger">
           <i className="material-icons">add_reaction</i>
         </div>
       </div>
     </div>
            <hr/>
            
            </div>
            </div>
         <div className="table-responsive table-house">
         
      <ReactDatatable
        className="table table-hover table-striped "
        tHeadClassName=""
        config={this.config}
        onRowClicked={this.rowClickedHandler}
        records={channels}
        columns={this.columns}
        extraButtons={this.extraButtons}
        />
        </div>
        
       </div>

     </div>
   </div>

   {
  /*
    <div className="col-lg-7">
    <ReactMapGL
              style={{borderRadius:"10px",boxShadow:"0px 0px 10px grey"}}
              mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
              mapStyle="mapbox://styles/mapbox/streets-v11"
              {...viewport}
              {...mapStyle}
              onViewportChange={(viewport) => this.setState({viewport})}
            >
               { tempMarker &&
                <Marker
                  longitude={tempMarker.longitude}
                  latitude={tempMarker.latitude}>
                  <div className=""><span></span></div>
                </Marker>
              }
              {
                this.state.markers.map((marker, index) => {
                  return(
                    <CustomMarker
                      key={`marker-${index}`}
                      index={index}
                      marker={marker}
                    />
                  )
                })
              }
            </ReactMapGL>

    </div>
*/
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

export default Details;