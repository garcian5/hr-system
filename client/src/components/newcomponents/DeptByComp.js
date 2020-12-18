import React, { Component } from 'react';
import axios from 'axios';

export default class DeptByComp extends Component {
  state = {
    departments: [],
    employees: [],
    empsWimg: [],
    empCount: 0,
    deptCount: 0,

    invalidCompId: false
  }

  componentDidMount () {
    const compId = this.props.history.location.state;    
  }

  render() {    
    return (
      <div>
        {this.props.history.location.state}
      </div>
    )
  }
}
