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

      document.body.style.zoom = "85%";
 
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
      const { sidebarheight} = this.state;

      return (

            <nav className="page-sidebar" style={{height:sidebarheight}}>
            <div className="logo-box"><a href="#" className="logo-text">Chat Platforms</a><a href="#" id="sidebar-close"><i className="material-icons">close</i></a> <a href="#" id="sidebar-state"><i className="material-icons">adjust</i><i className="material-icons compact-sidebar-icon">panorama_fish_eye</i></a></div>
            <div className="page-sidebar-inner slimscroll">
              <ul className="accordion-menu">
                <li className="sidebar-title">
                  CP
                </li>
                 <li> <NavLink to="./" ><i className="material-icons-outlined">dashboard</i>Dashboard</NavLink></li>
                <img className="product-item-status product-item-success" style={{height:"125px"}} src="./assets/images/guide.gif"/>
              
              </ul>
            </div>
          </nav>
        )
    }
}
export default withRouter( Sidebar);