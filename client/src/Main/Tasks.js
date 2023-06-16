import React, { Component } from 'react';
import $ from "jquery";
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ReactDatatable from '@ashvin27/react-datatable';

class Tasks extends Component {
  constructor(props)
  {
    super(props)

    this.state = {
     tasks:[]
    };
    

    this.columns = [
      {
          key: "TaskId",
          text: "Task Id",
          sortable: true
      },{
        key: "Description",
        text: "Description",
        sortable: true
    },{
    key: "FirstName",
    text: "User",
    sortable: true
},{
    key: "Status",
    text: "Status",
    sortable: true
},
     

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
          print: false,
          csv: true,
          extra: false
      }
  }

  this.rowClickedHandler = this.rowClickedHandler.bind(this);

  }


  rowClickedHandler = (event, data, rowIndex) => {
  
}
  
componentDidMount(){
  var self = this;
  var token = localStorage.getItem("token");
  var userid = localStorage.getItem("userid");

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
            alert(data.message);
            $('#loader').hide();
  
          }
        },error: function (xhr, error) {
          alert(xhr.status);
         
      },
      })
 
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
          <div className="col-lg">
                                        <div className="card card-transactionsm">
                                            <div className="card-body">
                                                <div className="table-responsive table-house">
      <ReactDatatable
        className="table table-hover table-striped "
        tHeadClassName=""
        config={this.config}
        onRowClicked={this.rowClickedHandler}
        records={this.state.tasks}
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
  </div>
</div>


          
    )
}

}

export default Tasks;