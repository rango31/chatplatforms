import React, { Component } from 'react';
import $ from "jquery";
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ReactDatatable from '@ashvin27/react-datatable';
import { Whatsappcontainer } from '../components/whatsapp/Whatsappcontainer';

class Home extends Component {
  constructor(props)
  {
    super(props)

    this.state = {
     data:[],
     selected:[],
     method:"add"
    };
    

    this.columns = [
      {
          key: "Message",
          text: "Message",
          sortable: true
      },{
        key: "From",
        text: "From",
        sortable: true
    },
    {
      key: "DateReceived",
      text: "DateReceived",
      sortable: true
  }
  ];

  this.config = {
      page_size: 20,
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
  this.getdata = this.getdata.bind(this);
  this.addmenu = this.addmenu.bind(this);

  }


  rowClickedHandler = (event, data, rowIndex) => {
    
    this.setState({selected:data,method:"update"})
    $('.mailbox-item').toggleClass('show');
    $('body').toggleClass('mailbox-item-show');
}

 getdata = async (token) => {
  $.ajax({
    type: 'get',
    url: '/api/messages',
      beforeSend: function (xhr) {
          xhr.setRequestHeader('Authorization', "Bearer " + token);
      },
      success: function (data) {
          if (data.status === 200) {
          
              this.setState({
                data:data.data,          
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

 addorupdatedata = async(event) => {
  event.preventDefault();
  var token = localStorage.getItem("token");

 var url = "/api/addfaq";
 var method = "POST"; 

 if(this.state.method === "update"){
    url = "/api/updatefaq";
    method = "PUT"; 
 }

  $.ajax({
   type: method,
   url: url,
   data: $('#dataform').serialize(),
   ContentType: "application/x-www-form-urlencoded",
   beforeSend: function (xhr) {
     xhr.setRequestHeader('Authorization', "Bearer " + token);
   },
   success: function (data) {

       if (data.success === true) {
         this.getdata(token);

           $('#msg').html("<h6 style='color:lightgreen'>" + data.message + "</h6>");

       } else {

          $('#msg').html("<h6 style='color:red'>" + data.message + "("+data.error+")" + "</h6>");
           
       }
   }.bind(this),
   error: function (xhr, error) {
     $('#msg').html("<h6 style='color:red'>" + xhr.status + "</h6>");
   },
});
}

 deldata = async(token) => {
  alert("del");
  $.ajax({
    type: 'POST',
    url: '/api/delsupplier',
    data: $('#dataform').serialize(),
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', "Bearer " + token);
    },
    ContentType: "application/x-www-form-urlencoded",
    success: function (data) {

        if (data.success === true) {

            $('#msg').html("<h6 style='color:lightgreen'>" + data.message + "</h6>");

        } else {
            $('#msg').html("<h6 style='color:red'>" + data.message + "</h6>");
            
        }
    },
    error: function (xhr, error) {
       alert(error)
    },
});
 }

  
componentDidMount(){
  var self = this;
  var token = localStorage.getItem("token");
  var userid = localStorage.getItem("userid");

  $('.mailbox-item-overlay').on('click', function () {
    $('.mailbox-item').toggleClass('show');
    $('body').toggleClass('mailbox-item-show');
});

  this.getdata(token);
 
}

render(){

  var {selected,method} = this.state;

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
                                            <div className="row stats-row">  
            </div>
              <h4>Messages <button className="float-right btn btns-sm btn-outline-primary" onClick={this.addmenu}>Add Whatsapp Account</button></h4><br/>
                <div className="table-responsive table-house">
      <ReactDatatable
        className="table table-hover table-striped "
        tHeadClassName=""
        config={this.config}
        onRowClicked={this.rowClickedHandler}
        records={this.state.data}
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
      {
        <Whatsappcontainer />
      }

    </div>

  </div>
  <div className="mailbox-compose-overlay" />
  <div className="mailbox-item-overlay" />
</div>

    )
}

}

export default Home;