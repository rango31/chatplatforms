import React, { Component } from 'react';
import $ from "jquery";
import { Link, withRouter,Redirect, NavLink } from 'react-router-dom';
import jwt_decode from "jwt-decode";

class Navbar extends Component {
  constructor(props) {
    super(props);

    var loggedin = false;

        if (typeof localStorage.token === 'undefined' || localStorage.token === 'null' || localStorage.token === '') {
            loggedin = false;

        } else {
            const token = localStorage.getItem('token');
           
            var decoded = jwt_decode(token);

            if (decoded.exp < new Date().getTime() / 1000) {

                loggedin = false;
            } else {
                loggedin = true;
            }

        }

    this.state = {
        fullname: ""   ,
        isLoggedIn: loggedin,
        Role: localStorage.getItem('role'),
       }
}

  search(e) {

    e.preventDefault(); 

    var token = localStorage.getItem("token");
  
    $.ajax({
      type: 'get',
      url: `/api/searchvehicle?vehicle=${e.target.value}`,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', "Bearer " + token);
        },
        success: function (data) {
            if (data.status === 200) {
              this.setState(
                {
                    filtered: data.data
                }
            )
    
            if(e.target.value.length < 1){
                this.setState(
                    {
                        filtered: [] , 
                        selectedcar:null
                    
                    }
                )
    
            }
    
            }
          }.bind(this),
          error: function (xhr, error) {
           // alert(xhr.status);
           
        }
        } )
   
}

  componentDidMount(){
   
    this.checkLogin();
    const _self = this;
    const n = localStorage.getItem("fullname");

    this.setState({
        fullname:n 
    })

    $('#logout').on('click', function (event) {
      event.preventDefault();
      localStorage.clear();

      _self.props.history.push({
          pathname: "login",
          from: "user"
      })
  });
}

checkLogin (){

  if (!this.state.isLoggedIn) {
    let current = window.location.href;

    current = current.split('/')   ;
    const last = current[current.length - 1]

    this.props.history.push({
      pathname: "login",
      routefrom: last
    })
  }
}

render(){
  
    return(
        <div>
              <div className="page-header">
        <nav className="navbar navbar-expand">
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
          <ul className="navbar-nav">
            <li className="nav-item small-screens-sidebar-link">
              <a href="#" className="nav-link"><i className="material-icons-outlined">menu</i></a>
            </li>
            <li className="nav-item nav-profile dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <img src="../../assets/images/now-logo.png" alt="profile image" />
                <span>{this.state.fullname}</span><i className="material-icons dropdown-icon">keyboard_arrow_down</i>
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown" >
                { /* <Link className="dropdown-item" to="/calendar">Calendar<span className="badge badge-pill badge-info float-right">2</span></Link>*/}
                <Link className="dropdown-item" to="/profile">Profile</Link>
               
                <div className="dropdown-divider" />
                <a className="dropdown-item" id="logout" href="#">Log out</a>
              </div>
            </li>
            {
            /*
            <li className="nav-item">
              <Link to="./mail" className="nav-link"><i className="material-icons-outlined">mail</i></Link>
            </li>
            <li className="nav-item">
              <Link to="./notifications" className="nav-link"><i className="material-icons-outlined">notifications</i></Link>
            </li>
            */
            }
            <li className="nav-item">
              <a href="#" className="nav-link" id="dark-theme-toggle"><i className="material-icons-outlined">brightness_2</i><i className="material-icons">brightness_2</i></a>
            </li>
          </ul>
          {
            /*
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
             
              <li className="nav-item">
                <Link to="./tasks" className="nav-link">Tasks</Link>
              </li>
              
            </ul>
          </div>
          <div  className="navbar-search">
            <form>
              <div className="form-group">
                <input autoComplete="off"  data-toggle="dropdown" type="text" name="search" id="nav-search" onChange={this.search} placeholder="Search..." />
                <div className="dropdown-menu float-right row" aria-labelledby="navbarDropdown" style={{width:"93.5vw",marginLeft:"10px",backgroundColor:"rgba(216, 181, 25, 0.95)",padding:"20px"}}>
               <div className="row ">
                
                {this.state.filtered.slice(0,6).map((item) =>{
               
                  return(
                    
                    <div className="col-lg-2 col-xl-2" style={{color : item.Balance <= 0 || item.Exempt  === 1 ?'green':'red' }}>
                      <Link to={`./vehicle?reg=${item.VehicleReg}`} className="nav-link">
                      <div className="card file audio" >
                        <div className="card-header file-icon">
                          <i className="material-icons">{ item.Exempt ? 'verified':'departure_board'}</i>
                        </div>
                        <div className="card-body file-info" style={{color : item.Balance <= 0 || item.Exempt  === 1 ?'green':'red' }}>
                          <p>{item.VehicleReg}<small>{item.Exempt === 1 ? "(Exempt)" : ""}</small></p>
                          <span className="file-size">{item.Balance.toFixed(2)}<small>ZWL</small></span><br />
                          
                        </div>
                      </div>
                      </Link>
                    </div>

               )
           })
          }
      
          </div>
          {
            this.state.selectedcar?
          <div className="card savings-card">
        <div className="card-body">
          <div className="row ">
            
            <div className="col-md-2" style={{padding:"50px"}}>
           
                  <CountdownCircleTimer
                  isPlaying
                  size={170}
                  strokeWidth={2}
                  initialRemainingTime={this.state.selectedcarinitrem/60}
                  duration={this.state.selectedcarduration/60}
                  colors={[
                    ['#00FF00', 0.5],
                    ['#FFFF00', 0.3],
                    ['red', 0.2],
                  ]}
                >
                {({ remainingTime }) => remainingTime/60}
              </CountdownCircleTimer>
              </div>
              <div className="col-md-5" style={{padding:"30px"}}>
            
                <h2 style={{margin:"50px"}}><small>Balance : </small>{this.state.selectedcarbalance.toFixed(2)} ZWL</h2>
                
                </div>
         
          {
            this.state.selectedcar?
          <div className="col-md-5" style={{padding:"30px"}}>
            <h3>Parking History : {this.state.selectedcar}</h3>
            <hr/>
           
            {
            this.state.bookings.filter(item => item.VehicleReg === this.state.selectedcar).slice(0,5).map((item) =>{
               return(
                 <div>
                   {item.Notes} - {new Date(item.DateCreated).toDateString()} - <span className='float-right'>{item.Status}</span><br/>
                   {item.PrecinctName } | {item.FirstName} {item.LastName}
                   <hr/>
                   </div>
               )
            })
          }
            </div>
            :""
         }
                  
                  </div>
              </div>
              </div>
 :""
        }
              </div>
              </div>
            </form>
          </div>
          */
        }
        </nav>
      </div>
            </div>

    )
}
}
export default withRouter( Navbar);