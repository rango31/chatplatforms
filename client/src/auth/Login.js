import React, { Component } from 'react';
import $ from "jquery";
import { Link } from 'react-router-dom';

class Login extends React.PureComponent {
  constructor(props)
  {
    super(props)

    const nexturl = this.props.location.routefrom ? `/${this.props.location.routefrom}` : `/`;

    this.state = {
      d:props.authed,
      nexturl: nexturl,
    }

  }

    componentDidMount() {
        var _self = this;
        document.body.style.zoom = "100%";

        $(window).on("load", function () {
          setTimeout(function () {
              $("body").addClass("no-loader");
          }, 400);
      });
        $('#login').on("submit", function (event) {
           
            event.preventDefault();
            $('#msg').html("Signing in, Please wait ...");
            document.getElementById("loginbtn").style.display = "none";
            document.getElementById("loader").style.display = "block";
            $.ajax({
                type: 'POST',
                url: '/api/login',
                data: $('#login').serialize(),
                ContentType: "application/x-www-form-urlencoded",
                success: function (data) {

                    if (data.success === true) {

                        $('#msg').html("<h6 style='color:lightgreen'>" + data.message + "</h6>");

                        localStorage.setItem(`token`, data.token);

                        var data = JSON.stringify(data);
                        var nd = JSON.parse(data);

                       // alert(data)

                       
                        localStorage.setItem(`fullname`, nd.user.FirstName + " " + nd.user.LastName);
                        localStorage.setItem(`userid`, nd.user.UserId);
                        localStorage.setItem(`role`, nd.user.RoleId);

                        _self.props.history.push({
                            pathname: _self.state.nexturl,
                            from: "login"
                        })
                    } else {
                        $('#msg').html("<h6 style='color:red'>" + data.message + "</h6>");
                        document.getElementById("loader").style.display = "none";
                        document.getElementById("loginbtn").style.display = "block";
                    }
                },
                error: function (xhr, error) {
                  
                    document.getElementById("loader").style.display = "none";
                    document.getElementById("loginbtn").style.display = "block";
                    $('#msg').html("<h6 style='color:red'>Error:" +  xhr.status + "</h6>");
                    document.getElementById("loader").style.display = "none";
                    document.getElementById("loginbtn").style.display = "block";
                },
            });
        });
     
    }
render(){

    return(

        <div className="auth-page sign-in" >
        <div className="loader">
          <div className="spinner-grow text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
        <div className="connect-container align-content-stretch d-flex flex-wrap" >
          <div className="container-fluid" >
            <div className="row">
              <div className="col-lg-5">
                <div className="auth-form">
                  <div className="row">
                    <div className="col">
                      
                      <div className="logo-box">
                      <img src="./assets/images/now-logo.png" style={{height:"50px"}}></img><br/><br/>
                   
                      <h6 id="msg">Welcome, Please sign in ! {this.state.d}</h6>
                      <img id="loader" style={{ display: "none" }} src="./assets/images/loader.gif" />
                      </div>
                      <form id="login">
                        <div className="form-group">
                          <input type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp" required aria-required placeholder="Enter email" />
                          <input type="text" id="from" name="from" required aria-required placeholder="from" defaultValue="web" hidden />
                      
                        </div>
                        <div className="form-group">
                          <input type="password" className="form-control" name="password" id="password" placeholder="Password" required aria-required/>
                        </div>
                        <button type="submit" id="loginbtn" className="btn btn-danger btn-xl btn-submit">Sign In</button>
                        <div className="auth-options">
                          <div className="custom-control custom-checkbox form-group">
                            <input type="checkbox" className="custom-control-input" id="exampleCheck1" />
                            <label className="custom-control-label" htmlFor="exampleCheck1">Remember me</label>
                          </div>
                          <Link to="/register" className="forgot-link">Register</Link>
                          <Link to="/forgotpassword" className="forgot-link">Forgot Password?</Link>
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

export default Login;