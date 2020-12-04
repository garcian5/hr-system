import React, { Component } from 'react'

export default class DeptByComp extends Component {
  state = {
    departments: [],
    employees: [],
    empsWimg: [],
    empCount: 0,
    deptCount: 0
  }

  componentDidMount () {

  }

  render() {
    return (
      <div>
        <button 
          title='Back to Employees'
          className="back-btn"
          onClick={() => this.props.history.push('/companies')}>
          <ion-icon name="arrow-back-outline"></ion-icon>
        </button>
        {this.props.history.location.state}
      </div>
    )
  }
}
