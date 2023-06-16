import React, { Component } from 'react';
import $ from "jquery";
import { Link } from 'react-router-dom';

class Fof extends Component {
  componentDidMount(){
    document.body.style.zoom = "85%";
    $(window).on("load", function () {
      setTimeout(function () {
          $("body").addClass("no-loader");
      }, 400);
  });
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
          <div className="container d-flex align-content-stretch flex-wrap">
            <div className="row">
              <div className="col d-flex align-content-stretch flex-wrap" >
                <div className="error-page-image" />
                <div className="error-page-text">
                  <h3>Oops.. This parking space is taken..</h3>
                  <p>It seems that the page you are looking for no longer exists.<br />We will try our best to fix this soon.</p>
                  <div className="error-page-actions">
                    <Link to="/help" className="btn btn-secondary">Help Center</Link>
                    <Link to="./" className="btn btn-primary">Homepage</Link>
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

export default Fof;