import React, { Component } from 'react';
import $ from "jquery";
import { Link } from 'react-router-dom';

class Fpassword extends Component {
    componentDidMount() {
      document.body.style.zoom = "85%";
      $(window).on("load", function () {
        setTimeout(function () {
            $("body").addClass("no-loader");
        }, 400);
    });

        $('#resetpassword').on("submit", function (event) {
            event.preventDefault();
            $('#msg').html("Resseting your password, ...");
            document.getElementById("rsbtn").style.display = "none";
            $('#loader').show();
           
            $.ajax({
                type: 'PUT',
                url: '/api/reset',
                data: $('#resetpassword').serialize(),
                ContentType: "application/x-www-form-urlencoded",
                success: function (data) {
                    if (data.success === true) {
                        
                        $('#msg').html("<h6 style='color:lightgreen'>" + data.message + "</h6>");
                        $('#loader').hide();
                    } else {
                        $('#msg').html("<h6 style='color:red'>" + data.message + "</h6>");
                        $('#loader').hide();
                      
                    }
                },
                error: function (xhr, error) {
                  
                    document.getElementById("loader").style.display = "none";
                    document.getElementById("rsbtn").style.display = "block";
                    $('#msg').html("<h6 style='color:red'>Error:" +  xhr.status + "</h6>");
                    document.getElementById("loader").style.display = "none";
                    document.getElementById("rsbtn").style.display = "block";
                },
            });
        });
     
    }

render(){

  
    return(
        <div className="auth-page sign-in">
        <div className="loader">
          <div className="spinner-grow text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
        <div className="connect-container align-content-stretch d-flex flex-wrap">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-5">
                <div className="auth-form">
                  <div className="row">
                    <div className="col">
                      <div className="logo-box">
                      <img src="./assets/images/now-logo.png" style={{height:"50px"}}></img><br/><br/>
                      <h6 id="msg">Reset your password</h6>
                      <img id="loader" style={{ display: "none" }} src="./assets/images/loader.gif" />
                      </div>
                      <form id="resetpassword">
                        <div className="form-group">
                          <input type="email" className="form-control" id="email" aria-describedby="emailHelp" required aria-required placeholder="Enter email" />
                        </div>
                        
                        <button type="submit" id="rsbtn" className="btn btn-primary btn-block btn-submit">Reset password</button>
                        <div className="auth-options">
                          
                          <Link to="/register" className="forgot-link">Register</Link>
                          <Link to="/login" className="forgot-link">Login</Link>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 d-none d-lg-block d-xl-block">
                  <center>
              <img src="../../assets/images/profile-bg.jpg" style={{height:"50vh",marginTop:"25vh",borderRadius:"10px",boxShadow:"10px 10px 20px lightgrey"}} alt="profile image" />
              </center>
              </div>
            </div>
          </div>
        </div>
      </div>
 
    )
}

}

export default Fpassword;