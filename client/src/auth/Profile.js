import React, { Component } from 'react';
import $ from "jquery";
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

class Profile extends Component {
  
    constructor(props){
        super(props)

        this.state={
           data:[],
           fullname:"cp"
        }
    }

    componentDidMount(){
      var self = this;
      var token = localStorage.getItem("token");
      var userid = localStorage.getItem("userid");
     var n = localStorage.getItem("fullname");

      this.setState({
          fullname:n 
      })
    
        $.ajax({
          type: 'get',
          url: '/api/profile',
          beforeSend: function (xhr) {
              xhr.setRequestHeader('Authorization', "Bearer " + token);
          },
          success: function (data) {
              if (data.status === 200) {
                 
                try{
                // alert(JSON.stringify(data.data));   
                //var i =  JSON.parse(data.data);
      
                    self.setState({
                      data:data.data[0],
                     
                    })
                  }catch(ex){
                   // alert(ex);
                  }

                  $('#ploader').hide();
              }else{
                $('#ploader').hide();
                $('#pmsg').html("<h6 style='color:red'>Error:" +  data.message + "</h6>");
      
              }
            },error: function (xhr, error) {
              $('#pmsg').html("<h6 style='color:red'>Error:" +  xhr.status + "</h6>");
              $('#ploader').hide();
             // alert(xhr.status);
             
          },
          })

          $('#changepassword').on("submit", function (event) {
            event.preventDefault();
            $('#loader').show()
  
            $.ajax({
              type: 'PUT',
              url: '/api/changepassword',
              data: $('#changepassword').serialize(),
              beforeSend: function (xhr) {
                  xhr.setRequestHeader('Authorization', "Bearer " + token);
              },
              ContentType: "application/json",
              success: function (data) {
  
                  if (data.success === true) {
                    //self.props.onUpdate();
  
                      $('#msg').html("<h6 style='color:lightgrey'>" + data.message + "</h6>");
                      $('#loader').hide();
                     
                  } else {
                      $('#msg').html("<h6 style='color:red'>" + data.message + "</h6>");
                      $('#loader').hide();
                     //alert(data.message);
                  }
              },
              error: function (xhr, error) {
                  $('#msg').html("<h6 style='color:red'>Error:" +  xhr.status + "</h6>");
                  $('#loader').hide();
                 // alert(xhr.status);
                 
              },
          });
          
  
        })

        $('#info').on("submit", function (event) {
          event.preventDefault();
          $('#ploader').show()

          $.ajax({
            type: 'PUT',
            url: '/api/updateprofile',
            data: $('#info').serialize(),
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', "Bearer " + token);
            },
            ContentType: "application/json",
            success: function (data) {

                if (data.success === true) {
                  //self.props.onUpdate();

                    $('#pmsg').html("<h6 style='color:lightgrey'>" + data.message + "</h6>");
                    $('#ploader').hide();
                   
                } else {
                    $('#pmsg').html("<h6 style='color:red'>" + data.message + "</h6>");
                    $('#ploader').hide();
                   //alert(data.message);
                }
            },
            error: function (xhr, error) {
                $('#pmsg').html("<h6 style='color:red'>Error:" +  xhr.status + "</h6>");
                $('#ploader').hide();
               // alert(xhr.status);
               
            },
        });
        

      })

    }

render(){

  
    return(

        <div className="app-profile">
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
                <div className="profile-header">
                  <div className="row">
                    <div className="col">
                      <div className="profile-img">
                        <img src="../../assets/images/now-logo.png"/>
                      </div>
                      <div className="profile-name">
                        <h3>{this.state.fullname}</h3>
                        <span>ChatPlatforms</span>
                      </div>
                      <div className="profile-menu">
                        <ul>
                          <li>
                            <Link to="./">Home</Link>
                          </li>
                         
                        </ul>
                        <div className="profile-status">
                          <i className="active-now" /> Active now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="profile-content">
                  <div className="row">
                    
                    <div className="col-md-8">
                      <div className="card" style={{paddingLeft:"150px",paddingTop:"100px",paddingBottom:"50px"}}>
                      <div>
              <h5 className="card-title">My Information</h5>
              <h6 id="pmsg"></h6>
              <img id="ploader" style={{ display: "block" }} src="../assets/images/loader.gif" />
              
            
              <form id="info" style={{textAlign:"left",width:"85%"}}>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">First Name</label>
                  <input type="text" className="form-control"  name="fullname"  defaultValue={this.state.data.FirstName} required aria-required placeholder="Full Name" />
                  
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Middle Name</label>
                  <input type="text" className="form-control"  name="middlename"  defaultValue={this.state.data.MiddleName} required aria-required placeholder="Full Name" />
                  
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Last Name</label>
                  <input type="text" className="form-control"  name="lastname"  defaultValue={this.state.data.LastName} required aria-required placeholder="Full Name" />
                  
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputPassword1">Email Address</label>
                  <input type="email" className="form-control" disabled name="email" defaultValue={this.state.data.Email} required aria-required placeholder="Email Address" />
                  
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputPassword1">Phone Number</label>
                  <input type="text" className="form-control" name="phone" defaultValue={this.state.data.PhoneNumber} required aria-required placeholder="Phone Number" />
                  
                </div>
               
                <button id="send" type="submit" className="btn btn-success float-right"> Update </button><br/><br/> 
              </form>
             
          
      </div>


                      </div>
                     
                    </div>
                    <div className="col-md-4">
                      <div className="card" style={{paddingLeft:"55px",paddingTop:"50px",paddingBottom:"10px"}}>
                      <div>
              <h5 className="card-title">Change password</h5>
              <h6 id="msg"></h6>
              <img id="loader" style={{ display: "none" }} src="../assets/images/loader.gif" />
              
            
              <form id="changepassword" style={{textAlign:"left",width:"85%"}}>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Old Password</label>
                  <input type="password" className="form-control" name="cpassword"  defaultValue="" required aria-required placeholder="Enter your current password" />
                  
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputPassword1">New Password</label>
                  <input type="password" className="form-control" name="npassword" defaultValue="" required aria-required placeholder="Enter new password" />
                  
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputPassword1">Verify Password</label>
                  <input type="password" className="form-control" name="vpassword" defaultValue="" required aria-required placeholder="enter new password again" />
                  
                </div>
               
                <button id="send" type="submit" className="btn btn-success float-right"> Submit </button><br/><br/> 
              </form>
             
          
      </div>


                      </div>
                      <div className="card">
                        <div className="card-body">
                          <h5 className="card-title">Contact Info</h5>
                          <ul className="list-unstyled profile-about-list">
                            <li><i className="material-icons">mail_outline</i><span>{this.state.data.Email}</span></li>
                            
                            <li><i className="material-icons">local_phone</i><span>{this.state.data.PhoneNumber}</span></li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Footer/>
          </div>
          {/* Javascripts */}
        </div></div>          
    )
}

}

export default Profile;