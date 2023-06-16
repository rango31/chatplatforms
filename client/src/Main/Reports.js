import React, { Component } from 'react';
import $ from "jquery";
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { io } from "socket.io-client";
import { Chart } from "react-google-charts";


class Reports extends Component {
  constructor(props)
  {
    super(props)

   // -17.82545263288703, 31.04918560295001

    this.state = {
     
      bays:[],
      tasks:[],
      bookings:[],
      dates:[],
      hrs:[],
      vehicles:[],
      filtering:false,
      payrate:0.00,
      totalowing:0.00,
      lastthirty:{change:0,amount:0,status:"flat"},
      lastseven:{change:0,amount:0,status:"flat"},
      today:{change:0,amount:0,status:"flat"},
      bookings_count:0,
      days:[],
      paymentmethods:[],
      timeline:[],
      precinctbookings:[],
      zonebookings:[],
      plowtop:[]
    };

    this.getZoneCollected = this.getZoneCollected.bind(this);
    this.getStats = this.getStats.bind(this);
  
  }

stopfiltering = () => {
  this.setState({filtering:false})
}

showfilter = () => {
  $('.mailbox-item').toggleClass('show');
    $('body').toggleClass('mailbox-item-show');
}

filter = (e) => {
e.preventDefault();
alert();
var bookings = this.state.bookings;
console.log(e);

  this.setState({filtering:true,bookings:bookings})
  
}

getZoneCollected = (zone, zonebookings) => {

  let total = 0.00;

  if(!zonebookings){return 0.00}

 zonebookings.forEach(zb => {
   
  if(zb[0] === zone){
    total = zb[1];
  } 

 });

 return total.toFixed(2);
}

getPrecinctCollected = (precinct, precinctbookings) => {

  let total = 0.00;

  if(!precinctbookings){return 0.00}

  precinctbookings.forEach(pb => {
   
    if(pb[0] === precinct){
      total = pb[1];
    } 

 });

 return total.toFixed(2);
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

        console.log(data.data);
        let { tasks ,vehicles , payrate , totalowing , lastthirty , lastseven , today,bookings_count,bookings ,dates , precinctbookings , zonebookings} = (data.data[0]);

        var timeline = dates.timeline;
        var hrs = dates.hrs;
        var days = dates.days;
        var paymentmethods = dates.paymentmethods;

        self.setState({tasks:tasks,
          dates:dates,hrs:hrs, 
          vehicles:vehicles,
          bookings:bookings,
          totalowing:totalowing ,
            payrate:payrate,
            refreshing:false,
            lastthirty:lastthirty,
            lastseven:lastseven,
            today:today,
            bookings_count:bookings_count,
            timeline:timeline,
            days:days,paymentmethods:paymentmethods,precinctbookings:precinctbookings,zonebookings:zonebookings
            
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
    var userid = localStorage.getItem("userid");

    self.getStats(token);

    $('.mailbox-item-overlay').on('click', function () {
      $('.mailbox-item').toggleClass('show');
      $('body').toggleClass('mailbox-item-show');
  });

 
  let current = `ws://${window.location.href.split('//')[1].split('/')[0]}`;
  let newport = 1000;
  let oldport = current.split(':')[2];
  current = current.replace(oldport,newport);

  const socket = io.connect(current, {
    query: {token ,"from":'browser'}
  });
  
  socket.on("broadcast", msg => {
    
    if(this.state.filtering){

    }else{
     // var { tasks , bookings,vehicles} = ((JSON.parse(msg))[0]);
     try{
      var { tasks ,vehicles , payrate , totalowing , lastthirty , lastseven , today,bookings_count,bookings ,dates , precinctbookings , zonebookings} = ((JSON.parse(msg))[0]);

      var m = [];
     // try{
        var timeline = dates.timeline;
        var hrs = dates.hrs;
        var days = dates.days;
        var paymentmethods = dates.paymentmethods;
        
        
        
        /*
  
      }catch(ex)
      {
         console.log(ex);
      }
      */
  
      m = JSON.parse(JSON.stringify( m));
  
      //console.log(markers);
  
   
    this.setState({tasks:tasks,markers:m,
      dates:dates,hrs:hrs, 
      vehicles:vehicles,
      bookings:bookings,
      totalowing:totalowing ,
         payrate:payrate,
         refreshing:false,
         lastthirty:lastthirty,
         lastseven:lastseven,
         today:today,
         bookings_count:bookings_count,
         timeline:timeline,
         days:days,paymentmethods:paymentmethods,precinctbookings:precinctbookings,zonebookings:zonebookings
         
    })
  }catch(ex){

  }
    //console.log(JSON.parse(this.state.bays));
    }
  });
   
  }

render(){
  const { lastseven,lastthirty,today,bookings_count,timeline,days,paymentmethods,precinctbookings ,zonebookings} = this.state;

  let {precinct_bookings,ptoplow,plowtop} = precinctbookings;
  
  ptoplow ? ptoplow = ptoplow: ptoplow = ["nothing to show"] ;
  plowtop ? plowtop = plowtop:plowtop = ["nothing to show"];

  let {zone_bookings,ztoplow,zlowtop} = zonebookings;
  
  ztoplow ? ztoplow = ztoplow: ztoplow = ["nothing to show"] ;
  zlowtop ? zlowtop = zlowtop:zlowtop = ["nothing to show"];

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
      <div className="card-body">
   <h2>Statistics {//<button className="float-right btn btn-sm btn-outline-primary" onClick={this.showfilter}>Filter</button>
   }</h2><br/>
                  </div> 
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
           <span className={lastthirty.status === "flat"? "stats-change change-primary" :lastthirty.status === "up" ? "stats-change stats-change-success":"stats-change stats-change-danger"}> {lastthirty.status === "up" ? "+"+lastthirty.change.toFixed(0)+"%":lastthirty.status === "flat" ?lastthirty.change.toFixed(2)+"%" :"-"+lastthirty.change.toFixed(2)+"%" } </span>
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
 <div className="row stats-row">
                           
   <div className='col-md-12'>

      <div className="row">
      <div className="col-lg-12">
      <div className="card savings-card">
        <div className="card-body">
          <h5 className="card-title">Bookings Per Hour<span className="card-title-helper">Overall</span></h5>
          <Chart
  width={'100%'}
  height={'35vh'}
  chartType="LineChart"
  loader={<div>Loading Chart</div>}
  data={timeline}
  options={{
    curveType: 'function' ,
    hAxis: {
      title: 'Time',
    },
    vAxis: {
      title: 'Qty (Bookings)',
    },
    series: {
      1: { curveType: 'function' }
    },
  }}
  rootProps={{ 'data-testid': '2' }}
/>
        </div>
      </div>
          
      </div>
      <div className="col-lg-2">
     
        <div className="card top-products" style={{height:"50vh" , overflowY: "auto"}}>
          <div className="card-body">
            <h5 className="card-title">Top Perfoming Zones<span className="card-title-helper">Today</span></h5>
        
            <div className="top-products-list">
            { ztoplow ? ztoplow.map((item) =>{ return(<div><hr/><div className="product-item"> <h5>{item} <span className='float-right'>${this.getZoneCollected(item,this.state.zonebookings['zone_bookings'])}</span></h5></div></div>)  }) : null }
            </div>
          </div>
        </div>
   </div>
   <div className="col-lg-2">
     
        <div className="card top-products" style={{height:"50vh" , overflowY: "auto"}}>
          <div className="card-body">
            <h5 className="card-title">Low Perfoming Zones<span className="card-title-helper">Today</span></h5>
        
            <div className="top-products-list">
            { zlowtop ? zlowtop.map((item) =>{ return(<div><hr/><div className="product-item"> <h5>{item} <span className='float-right'>${this.getZoneCollected(item,this.state.zonebookings['zone_bookings'])}</span></h5></div></div>)  }) : null }
            </div>
          </div>
        </div>
   </div>
   <div className="col-lg-4">
     
     <div className="card top-products" style={{height:"50vh" , overflowY: "auto"}}>
       <div className="card-body">
         <h5 className="card-title">Top Perfoming Precincts<span className="card-title-helper">Today</span></h5>
     
         <div className="top-products-list">
           
            { ptoplow ? ptoplow.map((item) =>{ return(<div><hr/><div className="product-item"> <h5>{item} <span className='float-right'>${this.getPrecinctCollected(item,this.state.precinctbookings['precinct_bookings'])}<span/></span></h5></div></div>)  }) : null }
            </div>
       </div>
     </div>
</div>
<div className="col-lg-4">
  
     <div className="card top-products" style={{height:"50vh" , overflowY: "auto"}}>
       <div className="card-body">
         <h5 className="card-title">Low Perfoming Precincts<span className="card-title-helper">Today</span></h5>
     
         <div className="top-products-list">
            { plowtop ? plowtop.map((item) =>{ return(<div><hr/><div className="product-item"> <h5>{item} <span className='float-right'>${this.getPrecinctCollected(item,this.state.precinctbookings['precinct_bookings'])}<span/></span></h5></div></div>)  }) : null }
            </div>
       </div>
     </div>
</div>

    
      
    <div className="col-lg-4">
      <div className="card savings-card">
        <div className="card-body">
          <h5 className="card-title">Payment Methods<span className="card-title-helper">Overall</span></h5>
          <Chart
            width={'100%'}
            height={'30vh'}
            chartType="PieChart"
            loader={<div>Loading Chart</div>}
            data={paymentmethods}
            options={{
              title: '',
              // Just add this option
              is3D: true,
            }}
            rootProps={{ 'data-testid': '2' }}
          />
        </div>
      </div>
          
      </div>
      <div className="col-lg-4">
      <div className="card savings-card">
        <div className="card-body">
          <h5 className="card-title">Tasks<span className="card-title-helper">Overall</span></h5>
          <Chart
             width={'100%'}
             height={'30vh'}
            chartType="PieChart"
            loader={<div>Loading Chart</div>}
            data={[
              ['Precinct', 'Tasks Status'],
              ['New', this.state.tasks.filter(item => item.Status === "new").length],
              ['In progress', this.state.tasks.filter(item => item.Status ==="active").length],
              ['Complete', this.state.tasks.filter(item => item.Status==="complete").length],
              
            ]}
            options={{
              title: '',
              slices: {0: {color: 'red'},1: {color: 'orange'}, 2: {color: 'green'}},
              is3D: true,
            }}
            rootProps={{ 'data-testid': '2' }}
          />
        </div>
      </div>
          
      </div>
   
      <div className="col-lg-4">
      <div className="card savings-card">
        <div className="card-body">
          <h5 className="card-title">Average Bookings per day<span className="card-title-helper">Overal</span></h5>
          <Chart
            width={'100%'}
            height={'30vh'}
            chartType="PieChart"
            loader={<div>Loading Chart</div>}
            data={days}
            options={{
              title: '',
              // Just add this option
              is3D: true,
            }}
            rootProps={{ 'data-testid': '2' }}
          />
        </div>
      </div>
          
      </div>
     
        </div>
        </div>
    
        </div>
        <div className="row stats-row">
            <div className='col-md-12'>
              <div className="row">
              <div className="col-lg-12">
      <div className="card savings-card">
        <div className="card-body">
          <h5 className="card-title">Zone Bookings<span className="card-title-helper">Today</span></h5>
          <Chart
            width={'100vw'}
            height={'100vh'}
            chartType="PieChart"
            loader={<div>Loading Chart</div>}
            data={zone_bookings}
            options={{
              title: 'Breakdown of bookings per zone',
              // Just add this option
              is3D: true,
            }}
            rootProps={{ 'data-testid': '2' }}
          />
        </div>
      </div>
          
      </div>
      <div className="col-lg-12">
      <div className="card savings-card">
        <div className="card-body">
          <h5 className="card-title">Precinct Bookings<span className="card-title-helper">Today</span></h5>
          <Chart
            width={'100%'}
            height={'100vh'}
            chartType="PieChart"
            loader={<div>Loading Chart</div>}
            data={precinct_bookings}
            options={{
              title: 'Breakdown of bookings per Precinct',
              // Just add this option
              is3D: true,
            }}
            rootProps={{ 'data-testid': '2' }}
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
    <div className="mailbox-item">
  <div className="mail-container">
    <div className="mail-header">
      <div className="mail-title">
        Filter
        <img id="loader" style={{ display: "block" }} src="./assets/images/loader.gif" />
        <p id="msg"></p>
      </div>
    </div>
 
    
            <form className='col-md-6' onSubmit={()=> this.filter()}>
           
              <div className="form-group">
                  <label htmlFor="exampleInputEmail1">From</label>
                  <input type="date" className="form-control"  name="from" placeholder="From" />
                  
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">To</label>
                  <input type="date" className="form-control"  name="to"  placeholder="to" />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">City</label>
                  <select className="form-control" name="city">
                  <option>All</option>
                   <option>City 1</option>
                 </select>
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Zone</label>
                 <select className="form-control" name="zone">
                 <option>All</option>
                   <option>zone 1</option>
                 </select>
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Precinct</label>
                  <select className="form-control" name="precinct">
                   <option>All</option>
                   <option>Precinct 1</option>
                 </select>
                </div>
              
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Marshall</label>
                  <select className="form-control" name="marshall">
                   <option>All</option>
                   <option>Marshal 1</option>
                 </select>
                </div>
                </form>
           
    
    <div className="mail-actions" style={{bottom:"100px"}}>
    <button  onClick={()=>{$('#sbt').trigger('click');}} className="btn btn-xl btn-primary"> Filter</button>
      <button  onClick={()=>{$('#sbt').trigger('click');}} className="btn btn-success"> Reset</button>
      <button onClick={()=> this.showfilter()} className="btn btn-danger">Cancel</button>
    </div>
  
  </div>
</div>
  </div>
  <div className="mailbox-compose-overlay" />
  <div className="mailbox-item-overlay" />
</div>


          
    )
}

}

export default Reports;