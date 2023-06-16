import React, { Component } from 'react';
import $ from "jquery";
import { withRouter,NavLink} from 'react-router-dom';

class Sidebar extends Component {
  constructor(props) {
    super(props);
   
    this.state = {
        Role: localStorage.getItem('role'),
        width: document.body.offsetWidth,
        sidebarheight: '127vh'
    }
}

  componentDidMount(){

    let self = this;
    let {width} = this.state;

    if(width >= 1920 ){
      document.body.style.zoom = "85%";
    }
    else if(width >= 1280 && width < 1600){
      document.body.style.zoom = "85%";
    } 
    else if(width >= 768 && width < 1024){
      document.body.style.zoom = "85%";
    }else{
      document.body.style.zoom = "85%";
    }

    window.addEventListener('resize', function(event) {
      let newwidth = document.body.offsetWidth
      if(newwidth >= 1920 ){
        document.body.style.zoom = "85%";
      }
      else if(newwidth >= 1280 && width < 1600){
        document.body.style.zoom = "85%";
      } 
      else if(newwidth >= 768 && width < 1024){
        document.body.style.zoom = "85%";
      }else{
        document.body.style.zoom = "85%";
      }
  
  }, true);
    
      var e, o;
      (e = $(".accordion-menu li:not(.open) ul"));
          (o = $(".accordion-menu li.active-page > a"));
          e.hide();
          $(".accordion-menu li a").on("click", function () {
              var e = $(this).next("ul"),
                  o = $(this).parent("li"),
                  a = $(".accordion-menu > li.open");
              if (e.length) return o.hasClass("open") ? (e.slideUp(200), o.removeClass("open")) : (a.length && ($(".accordion-menu > li.open > ul").slideUp(200), a.removeClass("open")), e.slideDown(200), o.addClass("open")), !1;
          });
          $(".active-page > ul").length && o.click();
          $("#sidebar-state").on("click", function () {
              $("body").toggleClass("compact-sidebar");
          });
          var o, a;
        
          $(".small-screens-sidebar-link a").on("click", function () {
              $("body").toggleClass("small-screen-sidebar-active");
              // event.stopPropagation();
          });
          $("#sidebar-close").on("click", function () {
              $("body").toggleClass("small-screen-sidebar-active");
          });
        
          $(".hide-horizontal-bar").on("click", function () {
              $("body").toggleClass("small-screen-sidebar-active");
          });
          $(".horizontal-bar-menu li:not(.open) ul").hide();
          $(".horizontal-bar-menu li a").on("click", function () {
              var e = $(this).next("ul");
                  o = $(this).parent("li");
                  a = $(".horizontal-bar-menu > ul > li.open");
              if (e.length) return o.hasClass("open") ? (e.slideUp(200), o.removeClass("open")) : (a.length && ($(".horizontal-bar-menu > ul > li.open > ul").slideUp(200), a.removeClass("open")), e.slideDown(200), o.addClass("open")), !1;
          });
          "dark" == localStorage.getItem("theme") && $("body").addClass("dark-theme");
          "dark" != localStorage.getItem("theme") && $("body").hasClass("dark-theme") && localStorage.setItem("theme", "dark");
          $("#dark-theme-toggle").on("click", function () {
              $("body").toggleClass("dark-theme");
              $("body").hasClass("dark-theme") ? localStorage.setItem("theme", "dark") : localStorage.setItem("theme", "light");
              //event.preventDefault();
          });
          
      $(window).on("load", function () {
          setTimeout(function () {
              $("body").addClass("no-loader");
          }, 400);
      });
  
  }
    render() {
      const { Role, sidebarheight} = this.state;

      return (

            <nav className="page-sidebar" style={{height:sidebarheight}}>
            <div className="logo-box"><a href="#" className="logo-text">City Parking</a><a href="#" id="sidebar-close"><i className="material-icons">close</i></a> <a href="#" id="sidebar-state"><i className="material-icons">adjust</i><i className="material-icons compact-sidebar-icon">panorama_fish_eye</i></a></div>
            <div className="page-sidebar-inner slimscroll">
              <ul className="accordion-menu">
                <li className="sidebar-title">
                  CP
                </li>
                 <li> <NavLink to="./" ><i className="material-icons-outlined">dashboard</i>Dashboard</NavLink></li>
                { Role === '3'  ? <li> <NavLink to="./map"><i className="material-icons-outlined">map</i>Map</NavLink></li>:null}
                { Role === '3'  ? <li> <NavLink to="./calendar"><i className="material-icons-outlined">calendar_today</i>Calendar</NavLink></li>:null}
                 {
                  Role === '3' ?
                <li>
                  <a href="#"><i className="material-icons">traffic</i>City Parker  <i className="material-icons has-sub-menu">add</i></a>
                  <ul className="sub-menu">
                   
                  { Role === '3'  ? <li><NavLink to="./tasks">Tasks</NavLink></li>  : null }

                  { Role === '3' || Role === '5' ? <li><NavLink to="./precincts">Precincts</NavLink></li>  : null }

                  { Role === 3 || Role === 4 || Role === 5 ? <li><NavLink to="./zones">Zones</NavLink></li>  : null }
                  
                  { Role === 3 || Role === 4 || Role === 5 ? <li><NavLink to="./vehicles">Vehicles</NavLink></li>  : null }

                  { Role === 3 || Role === 4 || Role === 5 ? <li><NavLink to="./shifts">Shifts</NavLink></li>  : null }

                  { Role === 3 || Role === 4 || Role === 5 ? <li><NavLink to="./transactions">Transactions</NavLink></li>  : null }

                  { Role === 3 || Role === 4 || Role === 5 ? <li><NavLink to="./duplicates">Duplicate Transactions</NavLink></li>  : null }

                  { Role === 3 || Role === 4 || Role === 5 ? <li><NavLink to="./failed">Failed Transactions</NavLink></li>  : null }
                  
                  { Role === 3 ? <li><NavLink to="./devices">Devices</NavLink></li>  : null }

                  { Role === 3 ? <li><NavLink to="./users">User Management</NavLink></li>  : null }

                  { Role === 4 ? <li> <NavLink to="./vehicles">Exemptions</NavLink></li>  : null }
                  
                  { Role === 4 ? <li>  <NavLink to="./customercare">Customer Care</NavLink></li>  : null }


                  {
                  // Role == 3 ? <li> <NavLink to="./roles">Roles</NavLink>  </li>: null }

                 // {// Role == 3 ? <li> <NavLink to="./deployment">Deployment Matrix</NavLink>  </li>: null 
                }
                    
                  </ul>
                </li>
              :null  
              }
                {
                  Role === '9' ? <li>
                  <a href="#"><i className="material-icons">view_in_ar</i>Asset Admin  <i className="material-icons has-sub-menu">add</i></a>
                  <ul className="sub-menu">
                   
                    <li>
                      <NavLink to="./companyassets">Assets</NavLink>
                    </li>
                    <li>
                      <NavLink to="./assettypes">Asset Types</NavLink>
                    </li>
                    <li>
                      <NavLink to="./suppliers">Suppliers</NavLink>
                    </li>
                    <li><NavLink to="./locations">Locations</NavLink></li>
                    <li><NavLink to="./rooms">Offices/Rooms</NavLink></li>
                    <li><NavLink to="./departments">Departments</NavLink></li>
                  
                    
                  </ul>
                </li> : null}
                {
                  Role === '4' ? <li>
                  <a href="#"><i className="material-icons">view_in_ar</i>Customer Care <i className="material-icons has-sub-menu">add</i></a>
                  <ul className="sub-menu">
                   
                    <li>
                      <NavLink to="./faq">F.A.Qs</NavLink>
                    </li>
                    <li>
                      <NavLink to="./bulksms">Bulk SMS'S</NavLink>
                    </li>
                  
                    
                  </ul>
                </li> : null}
                <li>
                  <a href="#"><i className="material-icons">equalizer</i>Reports  <i className="material-icons has-sub-menu">add</i></a>
                  <ul className="sub-menu">
                   
                  { Role === '3' ? <li><NavLink to="./reports">Overall Statistics</NavLink></li>:null}
                    { Role === '3' ? <li><NavLink to="./variancereport">Variance Report</NavLink></li>:null }
                   { Role === '9' ? <li><NavLink to="./assetreport">Asset Report</NavLink></li>:null }
                   { Role === '9' ? <li><NavLink to="./nbvreport">NBV Report</NavLink></li>:null }
                   { Role === '4' ? <li><NavLink to="./customercarereport">Customer Care Report</NavLink></li>:null }
                  
                  </ul>
                </li>
                
                { Role === '3' ? <li ><NavLink to="./settings"><i className="material-icons-outlined">settings</i>Settings</NavLink></li> : null }
                <img className="product-item-status product-item-success" style={{height:"125px"}} src="./assets/images/guide.gif"/>
              
              </ul>
            </div>
          </nav>
        )
    }
}
export default withRouter( Sidebar);