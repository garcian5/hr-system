import React, { Component } from 'react';
import axios from 'axios';

export default class Main extends Component {
  constructor () {
    super();
    this.state = {
      employees: null,
      isLoading: true
    }
  }

  componentDidMount () {
    axios.get(process.env.REACT_APP_DATABASE_PATH + 'employee/allemployees')
      .then(res => this.setState({
        employees: res.data.elems
      }))
      .catch(err => console.log(err))
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    // if the employee is populated and the component is still loading, stop the loading
    if (this.state.employees !== null && this.state.isLoading) {
      this.setState({
        isLoading: false
      })
    }
  }

  render() {
    /* const emps = this.state.employees.map(emp => (
      <div>

      </div>
    )) */
    if (this.state.isLoading) {
      return ( <div><h1>Loading...</h1></div> )
    } else {      
      return (
        <div>
          <h1>THIS IS MAIN</h1>
          {/* {emps} */}
        </div>
      )
    }
  }
}
