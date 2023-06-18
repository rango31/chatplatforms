import React, { Component } from 'react';
import $ from "jquery";
import { Link } from 'react-router-dom';

class Register extends Component {

    
    componentDidMount() {
        var _self = this;
        document.body.style.zoom = "85%";
        $(window).on("load", function () {
          setTimeout(function () {
              $("body").addClass("no-loader");
          }, 400);
      });
        $('#register').on("submit", function (event) {
           
            event.preventDefault();
            $('#msg').html("Registering, Please wait ...");
            document.getElementById("rgbtn").style.display = "none";
            document.getElementById("loader").style.display = "block";
            $.ajax({
                type: 'POST',
                url: '/api/register',
                data: $('#register').serialize(),
                ContentType: "application/x-www-form-urlencoded",
                success: function (data) {

                    if (data.success === true) {

                        $('#msg').html("<h6 style='color:lightgreen'>" + data.message + "</h6>");

                        _self.props.history.push({
                            pathname: "/login",
                            from: "register"
                        })
                    } else {
                        $('#msg').html("<h6 style='color:red'>" + data.message + "</h6>");
                        document.getElementById("loader").style.display = "none";
                        document.getElementById("rgbtn").style.display = "block";
                    }
                },
                error: function (xhr, error) {
                  
                    document.getElementById("loader").style.display = "none";
                    document.getElementById("rgbtn").style.display = "block";
                    $('#msg').html("<h6 style='color:red'>Error:" +  xhr.status + "</h6>");
                    document.getElementById("loader").style.display = "none";
                    document.getElementById("rgbtn").style.display = "block";
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
              <h6 id="msg">Please register for an Account!</h6>
                      <img id="loader" style={{ display: "none" }} src="./assets/images/loader.gif" />
              </div>
                <form autoComplete="off" id="register">
                  <div className="form-group">
                    <input type="email" className="form-control" autoComplete="off" name="email" id="email1" required aria-required placeholder="Enter email" />
                  </div>
                  <div className="form-group">
                    <input type="text" className="form-control" id="fullname" placeholder="Fullname" name="fullname" required aria-required />
                  </div>
                  <div className="form-group">
                    <input type="password" className="form-control"  name="password" required aria-required placeholder="Password" />
                  </div>
                  <div className="form-group">
                    <input type="password" className="form-control"  name="vpassword" required aria-required placeholder="Verify Password" />
                  </div>
                  <button type="submit" id="rgbtn" className="btn btn-primary btn-block btn-submit">Sign Up</button>
                  <div className="auth-options">
                   
                    <Link to="./login" className="forgot-link">Already have an account?</Link>
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

export default Register;