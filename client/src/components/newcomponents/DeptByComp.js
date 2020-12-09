import React, { Component } from 'react';
import axios from 'axios';
// in new system design
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
    if (!compId || compId === undefined) {
      this.setState({ invalidCompId: true });
    } else {      
      axios.get(process.env.REACT_APP_DATABASE_PATH + 'image/by-company/' + compId)
        .then(res => {
          this.setState({
            departments: res.data.depts,
            employees: res.data.emps,
            empsWimg: res.data.empsWimg,
            deptCount: res.data.deptCount,
            empCount: res.data.empCount
          })
        })
    }
  }

  render() {
    console.log(this.state.empsWimg, '\n', this.state.employees)
    if (this.state.invalidCompId) {
      return (
        <div>
          <button 
            title='Back to Employees'
            className="back-btn"
            onClick={() => this.props.history.push('/companies')}>
            <ion-icon name="arrow-back-outline"></ion-icon>
          </button>
          <h1>Invalid Company Id.</h1>
          <p>Please go back and try again.</p>
        </div>
      )
    }
    // if no departments
    if (this.state.departments.length <= 0) {
      return (
        <div>
          <h1>There are no Departments and Employees in this Company.</h1>
        </div>
      )
    }

    let renderEmpsWImg;
    let renderEmps;
    
    if (this.state.empsWimg.length > 0) {
      renderEmpsWImg = this.state.empsWimg.map(emp =>(
        <tr key={emp._id}>          
          <td>
            {emp.employee_id.emp_name}
          </td>
          <td>
            {emp.employee_id.emp_email}
          </td>
          <td>
            {emp.employee_id.emp_contact_no}
          </td>
          <td>
            {emp.employee_id.emp_address}
          </td>
          {/* <td>
            {emp.employee_id.interview_date ? emp.interview_date.substring(0, 10) : 'N/A'}
          </td>
          <td>
            {emp.employee_id.hire_date ? emp.hire_date.substring(0, 10) : 'N/A'}
          </td>
          <td>
            {emp.employee_id.start_date ? emp.start_date.substring(0, 10) : 'N/A'}
          </td>
          <td>
            {emp.employee_id.termination_date ? emp.termination_date.substring(0, 10) : 'N/A'}
          </td> */}
        </tr>
      ))
    } else renderEmpsWImg = [];
    if (this.state.employees.length > 0) {
      renderEmps = this.state.employees.map(emp =>(
        <tr key={emp._id}>          
          <td>
            {emp.emp_name}
          </td>
          <td>
            {emp.emp_email}
          </td>
          <td>
            {emp.emp_contact_no}
          </td>
          <td>
            {emp.emp_address}
          </td>
          <td>
            {emp.interview_date ? emp.interview_date.substring(0, 10) : 'N/A'}
          </td>
          <td>
            {emp.hire_date ? emp.hire_date.substring(0, 10) : 'N/A'}
          </td>
          <td>
            {emp.start_date ? emp.start_date.substring(0, 10) : 'N/A'}
          </td>
          <td>
            {emp.termination_date ? emp.termination_date.substring(0, 10) : 'N/A'}
          </td>
        </tr>
      ))
    } else renderEmps = [];
    
    return (
      <div>
        <button 
          title='Back to Employees'
          className="back-btn"
          onClick={() => this.props.history.push('/companies')}>
          <ion-icon name="arrow-back-outline"></ion-icon>
        </button>
        {this.props.history.location.state}
        <table className="center">
          <tbody>
            <tr>
              <th>Employee Name</th>
              <th>Employee Email</th>
              <th>Employee Contact Number</th>
              <th>Employee Address</th>
              <th>Interview Date</th>
              <th>Hire Date</th>
              <th>Start Date</th>
              <th>Termination Date</th>
            </tr>
            {renderEmpsWImg}
          </tbody>
        </table>
        <table className="center">
          <tbody>
            <tr>
              <th>Employee Name</th>
              <th>Employee Email</th>
              <th>Employee Contact Number</th>
              <th>Employee Address</th>
              <th>Interview Date</th>
              <th>Hire Date</th>
              <th>Start Date</th>
              <th>Termination Date</th>
            </tr>
            {renderEmps}
          </tbody>
        </table>
      </div>
    )
  }
}
