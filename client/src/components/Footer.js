import React, { Component } from 'react';

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
        Year: 2022
    }
}
componentDidMount() {
    var y = new Date().getFullYear();
    this.setState({
        Year: y
    })
}
render(){
    return(
      <div className="page-footer">
      <div className="row">
        <div className="col-md-12">
          <span className="footer-text">{this.state.Year} © Chat|<small>Platforms</small></span>
        </div>
      </div>
    </div>

    )
}
}
export default Footer;