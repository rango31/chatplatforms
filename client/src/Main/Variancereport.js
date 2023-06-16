import React, { Component } from 'react';
import $ from "jquery";
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { io } from "socket.io-client";
import ReactDatatable from '@ashvin27/react-datatable';
import moment from 'moment';

class Variancereport extends Component {
  constructor(props)
  {
    super(props)

    this.state = {
     cashups:[],
     selected:[],
     method:"add",
     todaya:"",
     selecteddate:moment().format("YYYY-MM-DD"),
     shiftboookings:[], 
     collectedzwl:0,
     collectedusd:0,
     payrate:0 ,
     loading:false    
    };
    

    this.columns = [
      {
          key: "CashUpId",
          text: "Cashup #",
          sortable: true
      }, {
        key: "FirstName",
        text: "First Name",
        sortable: true
    },{
      key: "LastName",
      text: "Last Name",
      sortable: true
  },{
    text: "-",
    sortable: false,
    cell: record => { return ("-");
    }
  },{
      text: "ZWL Declared",
      sortable: false,
      cell: record => { return (record.TotalZw.toFixed(2).toString()+ "ZWL");
      }
    },{
      text: "ZWL D/Sys",
      sortable: false,
      cell: record => { return (record.ZwlDevice ? record.ZwlDevice.toFixed(2).toString() + "ZWL D" : record.SysTotalZw.toFixed(2).toString()+ "ZWL S");
      }
    },{
      text: "Var(ZWL)",
      sortable: false,
      cell: record => { return (((record.ZwlDevice ? record.ZwlDevice : record.SysTotalZw) - record.TotalZw).toFixed(2));
      }
    },{
      text: "-",
      sortable: false,
      cell: record => { return ("-");
      }
    },{
        text: "USD Declared",
        sortable: false,
        cell: record => { return (record.TotalUsd.toFixed(2).toString()+ "USD");
        }
      },{
          text: "USD D/Sys",
          sortable: false,
          cell: record => { return (record.UsdDevice ? record.UsdDevice.toFixed(2).toString() + "USD D" : record.SysTotalUsd.toFixed(2).toString()+ "USD S");
          }
        },{
          text: "Var(USD)",
          sortable: false,
          cell: record => { return (((record.UsdDevice ? record.UsdDevice : record.SysTotalUsd) - record.TotalUsd).toFixed(2));
          }
        }
     

  ];

  this.columns2 = [
    {
        key: "BookingId",
        text: "Receipt",
        sortable: true
    },{
      key: "VehicleReg",
      text: "Vehicle",
      sortable: true
  
    },{
      key: "Notes",
      text: "Notes",
      sortable: true
  
    },{
      key: "Date",
      text: "Added",
      className: "name",
      sortable: false,
      cell: record => {
       
          return (
            <div className="stats-card" style={{margin:"-15px",left:"-100px"}}>
            <div className="stats-icon change-success">{ moment( record.DateCreated).format("HH:mm") }
      </div>
      </div>
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
            moment( record.EndTime).format("HH:mm")
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

  this.extraButtons = [
      {
          className: "btn-outline btn-primary buttons-pdf",
          title: "print",
          children: [
              <span>
                  <i className="material-icons">print</i>
              </span>
          ]
      },
      {
          className: "btn btn-primary buttons-excel",
          title: "excel",
          children: [
              <span>
                  <i className="material-icons">keyboard_arrow_down</i>
              </span>
          ]
      },

  ]

  this.config = {
      page_size: 10,
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

  this.rowClickedHandler = this.rowClickedHandler.bind(this);
  this.getcashups = this.getcashups.bind(this);
  this.getcollected = this.getcollected.bind(this);
  this.getshiftbookings = this.getshiftbookings.bind(this);
  this.getpayrate = this.getpayrate.bind(this);
  this.addmenu = this.addmenu.bind(this);
  this.handleChange = this.handleChange.bind(this);

  }
  
  rowClickedHandler = (event, data, rowIndex) => {
    var token = localStorage.getItem("token");
    this.getshiftbookings(token,data.ShiftId);

    this.setState({selected:data,method:"update"})
    $('.mailbox-item').toggleClass('show');
    $('body').toggleClass('mailbox-item-show');
}

getshiftbookings = async (token,shiftid) => {
  this.setState({
    shiftboookings:[], 
    collectedzwl:0.00,
    collectedusd:0.00,
    payrate:0.0 ,
    loading:true        
  })
  $.ajax({
    type: 'get',
    url: '/api/shiftbookings/'+shiftid,
      beforeSend: function (xhr) {
          xhr.setRequestHeader('Authorization', "Bearer " + token);
      },
      success: async function (data) {
          if (data.status === 200) {

            let {usd,zwl} = this.getcollected(data.data);
            let payrate = this.getpayrate(data.data);
            
              this.setState({
                shiftboookings:data.data, 
                collectedzwl:zwl,
                collectedusd:usd,
                payrate:payrate ,
                loading:false        
              })
              
          }else{
            alert(data.message);
            this.setState({loading:false})
  
          }
        }.bind(this),error: function (xhr, error) {
          this.setState({loading:false})
          alert(xhr.status);
         
      },
      })
 }

 getcollected =  (bookings) =>{
  var zwl =  bookings.reduce((h, item) => 
  {
   
   if(item.Status.toLowerCase() === "paid" && item.Currency.toLowerCase() === "zwl"){ 
    return h + (item.AmountDue) 
      }else{
        return h;
      }
     },0).toFixed(2)

     var usd = bookings.reduce((h, item) => 
  {
   
   if(item.Status.toLowerCase() === "paid" && item.Currency.toLowerCase() === "usd"){ 
    return h + (item.AmountDue) 
      }else{
        return h;
      }
     },0).toFixed(2)

     return ({"usd":usd,"zwl":zwl});
 }

 getpayrate = (bookings) => {
    
  var rate  = bookings.reduce((a, item) => 
  {
  
      var paid = bookings.filter(item => (item.Status).toLowerCase() === "paid" && item.Type != 3).length;
      var unpaid = bookings.filter(item => (item.Status).toLowerCase() === "unpaid").length;
  
      return (paid / (paid + unpaid)) * 100;
  
  },0).toFixed(1)

  return rate;
      
}

 getcashups = async (token, dt) => {
   
  if(dt === undefined){ dt = moment().format('YYYY-MM-DD') } 

  $.ajax({
    type: 'get',
    url: '/api/variance?date=' + dt,
      beforeSend: function (xhr) {
          xhr.setRequestHeader('Authorization', "Bearer " + token);
      },
      success: function (data) {
          if (data.status === 200) {
          
              this.setState({
                cashups:data.data.reverse() ,          
              })

            $('#loader').hide();

          }else{
            alert(data.message);
            $('#loader').hide();
  
          }
        }.bind(this),error: function (xhr, error) {
          alert(xhr.status);
         
      },
      })
 }

 addmenu = async () => {
    this.setState({selected:[],method:"add"})

    $('.mailbox-item').toggleClass('show');
    $('body').toggleClass('mailbox-item-show');

 }

handleChange = (ev)=> {
  const token = localStorage.getItem("token");
  if (!ev.target['validity'].valid) return;
  const dt= ev.target['value'];
  this.setState({selecteddate:dt});
  this.getcashups(token, dt);
}

componentDidMount(){
  var self = this;
  var token = localStorage.getItem("token");
  var userid = localStorage.getItem("userid");

  $('.mailbox-item-overlay').on('click', function () {
    $('.mailbox-item').toggleClass('show');
    $('body').toggleClass('mailbox-item-show');
   // self.getcashups(token);
});

  this.getcashups(token);

}

render(){

  var {selected, method} = this.state;

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
          <div className="col-lg">
            <div className="card card-transactionsm">
                <div className="card-body">
                  <h4>Variance Report for : {moment(this.state.selecteddate).format("dddd D MMMM YYYY")}<input className='float-right form-control' style={{width:'200px'}} onChange={this.handleChange} defaultValue={this.state.selecteddate} type='date'></input></h4><br/>
                    <div className="table-responsive table-house">
      <ReactDatatable
        className="table table-hover table-striped "
        tHeadClassName=""
        config={this.config}
        onRowClicked={this.rowClickedHandler}
        records={this.state.cashups}
        columns={this.columns}
        extraButtons={this.extraButtons}
        />
        </div>
   
   </div>
 </div>
</div>
</div>
</div>
      
      </div>
   
    </div>
    <div className="mailbox-item">
  <div className="mail-container">
    <div className="mail-header">
      <div className="mail-title">
        Shift Variance Report
        <img id="loader" style={{ display: "block" }} src="./assets/images/loader.gif" />
        <p id="msg"></p>
      </div>
    </div>

    <form id="dataform" onSubmit={this.addorupdatedata}>
    <div className="mail-text">
      
          <table style={{borderRadius:"5px"}} className="table table-hover table-bordered table-sm mb-0 ">
            <tbody>
            <tr > <td style={{ width: "18%" , padding:"7px" }}>First Name </td> <td style={{padding:"5px" }} > <input type="text" name="deviceid" hidden className="form-control" defaultValue={selected.ShiftId} /><input type="text" required name="serialnumber" className="form-control" disabled defaultValue={selected.FirstName} /></td>  </tr>
            <tr > <td style={{ width: "18%" , padding:"7px" }}><small>Last Name </small></td> <td style={{padding:"5px" }}> <input type="text" name="mac" defaultValue={selected.LastName} disabled className="form-control"  /></td>  </tr>
            <tr > <td style={{ width: "18%" , padding:"7px" }}><small>Zone</small></td> <td style={{padding:"3px" }}> <input type="text" name="devicenumber" defaultValue={selected.ZoneName} disabled className="form-control"  /></td>  </tr>
            <tr > <td style={{ width: "18%" , padding:"7px" }}><small>Precinct</small></td> <td style={{padding:"5px" }}> <input type="text" name="devicenumber" defaultValue={selected.PrecinctName} disabled className="form-control"  /></td>  </tr>
            <tr > <td style={{ width: "18%" , padding:"7px" }}><small>Cashup Time</small></td> <td style={{padding:"5px" }}> <input type="text" name="devicenumber" defaultValue={ selected.DateCreated} className="form-control" disabled /></td>  </tr>
            <tr > <td style={{ width: "18%" , padding:"7px" }}><small>System (At Cashup)</small></td> <td style={{padding:"5px" }}><table><tbody><tr><td>{selected.SysTotalZw} ZWL</td><td>{selected.SysTotalUsd} USD</td></tr></tbody></table></td>  </tr>
            <tr > <td style={{ width: "18%" , padding:"7px" }}><small>Device (At Cashup)</small></td> <td style={{padding:"5px" }}><table><tbody><tr><td>{selected.ZwlDevice ? selected.ZwlDevice:'N/A'} ZWL</td><td>{selected.UsdDevice ? selected.UsdDevice:'N/A'} USD</td></tr></tbody></table></td>  </tr>      
            <tr > <td style={{ width: "18%" , padding:"7px" }}><small>System (Now)</small></td> <td style={{padding:"5px" }}><table><tbody><tr><td>{this.state.collectedzwl} ZWL</td><td>{this.state.collectedusd} USD</td><td>{this.state.payrate} % Payrate</td><td>{this.state.shiftboookings.length} Bookings</td></tr></tbody></table></td>  </tr>
            <tr > <td style={{ width: "18%" , padding:"7px" }}><small>Declared</small></td> <td style={{padding:"5px" }}><table><tbody><tr><td>{selected.TotalZw} ZWL</td><td>{selected.TotalUsd} USD</td></tr></tbody></table></td>  </tr>
            <tr > <td style={{ width: "18%" , padding:"7px" }}><small>Variance</small></td> <td style={{padding:"5px" }}><table><tbody><tr><td>{(selected.SysTotalZw - selected.TotalZw).toFixed(2)} ZWL</td><td>{selected.SysTotalUsd - selected.TotalUsd} USD</td></tr></tbody></table></td>  </tr>
            </tbody>
        </table>
      <br />
      <p></p>
      <div className="mail-title">
        Shift Bookings
        {this.state.loading ?<img id="loader" src="./assets/images/loader.gif" />: null}
      </div>
      <br />
      <div className="table-responsive table-house">
      <ReactDatatable
        className="table table-hover table-striped "
        tHeadClassName=""
        config={this.config2}
        onRowClicked={this.rowClickedHandler}
        records={this.state.shiftboookings}
        columns={this.columns2}
        />
        </div>
    

      <p>
   
      </p>
    </div>
    <button id="sbt" hidden type="submit">submit</button>
    </form>
  
  
  </div>
</div>

  </div>
  <div className="mailbox-compose-overlay" />
  <div className="mailbox-item-overlay" />
</div>


          
    )
}

}

export default Variancereport;