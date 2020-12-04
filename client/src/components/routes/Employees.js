import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default class Employees extends Component {
  constructor () {
    super();
    this.state = {
      employees: [],
      departments: [],
      dept_id: '',
      dept_name: '',
      doneFirstRender: false
    }
  }

  componentDidMount() {    
    const {state} = this.props.history.location;
    
    // get department
    axios.get(process.env.REACT_APP_DATABASE_PATH + 'department/getdept')
      .then(res => this.setState({
        departments: res.data.elems,
        // if we go back from i.e. updating employee or employee info,
        // set the id to the previous employee we viewed
        dept_id: res.data.elems.length <=0 ? '' : state !== undefined ? state.dept_id : res.data.elems[0]._id,
        dept_name: res.data.elems.length <=0 ? '' : state !== undefined ? res.data.elems.filter(dept => 
          dept._id === state.dept_id)[0].department_name : ''
      }))
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // check if first render is done
    // first render will have our state as undefined so we want to avoid doing
    // any get requests in our first render
    if (!this.state.doneFirstRender) {
      this.setState({doneFirstRender: true})
    }
    if (this.state.dept_id !== prevState.dept_id) {
      axios.get(process.env.REACT_APP_DATABASE_PATH + 'employee/department/' + this.state.dept_id)
        .then(res => {
          this.setState({
          employees: res.data.elems,
          doneFirstRender: true
          })
        })
    }
  }

  handleChange = (event) => {
    const {name, value} = event.target;
    // the value that we get will be 2 strings separated by a space
    // we will split it into an array of words and use it to 
    // filter out the appropriate id for the department
    const splitValue = value.split(' ');
    const extractDeptId = this.state.departments.filter(
      (dept) => dept.department_name === splitValue[0] && 
      dept.company_id.company_name === splitValue[1]);

    this.setState({
      [name]: value,
      dept_id: extractDeptId[0]._id
    })
  }

  delEmployee = (emp_id) => {    
    axios.delete(process.env.REACT_APP_DATABASE_PATH + 'employee/delete/' + emp_id)
      .then(res => console.log(res.data + ' deleted!'))
      .catch(err=> console.log(err.response.msg));
    window.location.reload();
  }

  // get info of the employee and send it to a different component
  updateEmployee = (emp_id) => {
    /* const temp = [];
    axios.get(process.env.REACT_APP_DATABASE_PATH + 'employee/' + emp_id)
      .then(res => temp.push(res.data))
      .catch(err=> console.log('error:', err.response));
    this.props.history.push('/update-emp', temp) */

    //let temp = {};
    axios.get(process.env.REACT_APP_DATABASE_PATH + 'employee/' + emp_id)
      .then(res => 
        this.props.history.push('/emp-entry', {
          dept_id: res.data.department_id._id,
          comp_id: res.data.department_id.company_id._id,
          dept_name: res.data.department_id.department_name,
          comp_name: res.data.department_id.company_id.company_name,
          emp_name: res.data.emp_name,
          emp_email: res.data.emp_email,
          emp_contact_no: res.data.emp_contact_no,
          interview_date: res.data.interview_date,
          hire_date: res.data.hire_date,
          start_date: res.data.start_date,
          emp_address: res.data.emp_address,
          termination_date: res.data.termination_date,
          emp_id: emp_id
        }))
      .catch(err=> console.log('error:', err.response));
    
    //this.props.history.push('/test-update-emp', {dept_id})
  }

  employeeInfo = (emp_id) => {
    // redirect to employee info page
    this.props.history.push('/emp-info', emp_id)
  }

  render() {
    // if departments list is empty
    if (this.state.departments.length <= 0) {
      return(
        <div>
          <h4>There are no current existing Departments in the System.</h4>
          <p>Please Enter a Department.</p>
          <Link to='/dept-entry'>Add Department</Link>
        </div>
      )
    }
    const renderEmp = this.state.employees.map(emp =>(
      <tr key={emp._id}>
        <td>
          <button className="edit-btn" onClick={() => this.updateEmployee(emp._id)}>
            <ion-icon name="pencil-outline"></ion-icon>
          </button>
        </td>
        <td>
          <button className="delete-btn" onClick={() => this.delEmployee(emp._id)}>
            <ion-icon name="trash-outline"></ion-icon>
          </button>
        </td>
        <td>
          <button className="employee-name" onClick={() => this.employeeInfo(emp._id)}>
            {emp.emp_name}
          </button>
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
        <td>
          {emp.department_id.department_name}
        </td>
        <td>
          {emp.department_id.company_id.company_name}
        </td>
      </tr>
    ))
    
    if (!this.state.doneFirstRender) {
      return (<h4 className="heading">Loading...</h4>)
    } else {      
      return (
        <div className="everything-div">
          <h1 className="heading">Employees</h1>
          <Link to='/emp-entry'>Add Employee</Link>  
          <form>
            <label>Choose From Departments: </label>
            <select
                className="select-dropdown"
                required
                name="dept_name"
                value={this.state.dept_name}
                onChange={this.handleChange}
            >
              {// lists out all options from user list
                  this.state.departments.map(function (dept) {
                      return <option
                          key={dept._id}
                          label={dept.department_name + ' Department in ' + dept.company_id.company_name}
                          value={dept.department_name + ' ' + dept.company_id.company_name}>
                            {dept.department_name}
                      </option>;
                  })
              }
            </select><br />
          </form>
  
  
          {renderEmp.length > 0 ?
          <table className="center">
            <tbody>
              <tr>
                <th></th>
                <th></th>
                <th>Employee Name</th>
                <th>Employee Email</th>
                <th>Employee Contact Number</th>
                <th>Employee Address</th>
                <th>Interview Date</th>
                <th>Hire Date</th>
                <th>Start Date</th>
                <th>Termination Date</th>
                <th>Department</th>
                <th>Company</th>
              </tr>
              {renderEmp}
            </tbody>
          </table> : 
          
          <h4>No Employees in this Department yet.</h4>
          }
          
        </div>
      )
    }
  }
}
