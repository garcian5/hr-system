import React, { Component } from 'react';
import axios from 'axios';

export default class DeptByComp extends Component {
  state = {
    company: {},
    departments: [],
    employees: [],
    empsWimg: [],
    empCount: 0,
    deptCount: 0,

    invalidCompId: false,
    firstMounted: true
  }

  componentDidMount () {
    const compId = this.props.history.location.state;
    axios.get(process.env.REACT_APP_DATABASE_PATH + 'employee/by-comp_id/' + compId)
      .then(res => {
        this.setState({
          company: res.data.comp,
          departments: res.data.depts,
          employees: res.data.emps
        })
      })
  }

  componentDidUpdate () {
    // set false after initial mount
    if (this.state.firstMounted) this.setState({firstMounted: false})
  }

  render() {
    if (this.state.firstMounted) {
      return (
        <div>
          <h1>Loading...</h1>
        </div>
      )
    } else if (this.state.departments.length <= 0) {
      return (
        <div>
          <h1>There are no Departments and Employees in this Company yet.</h1>
        </div>
      )
    } else if (this.state.departments.length > 0 && this.state.employees.length <= 0) {
      return (
        <div>
          <h1>There are no employees in this Company.</h1>
        </div>
      )
    } else {
      return (
        <div>
          {this.props.history.location.state}
        </div>
      )
    }
  }
}
