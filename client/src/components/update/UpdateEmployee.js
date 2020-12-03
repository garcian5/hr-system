import React, { Component } from 'react';
import axios from 'axios';

export default class UpdateEmployee extends Component {
  state = {
    deparments: [],
    companies: [],
    employees: [],
    comp_id: '',
    dept_id: '',
    department_name: '',
    company_name: '',
    emp_name: '',
    emp_email: '',
    emp_contact_no: '',
    interview_date: Date.now(),
    hire_date: Date.now(),
    start_date: Date.now(),
    emp_address: '',
    termination_date: '',

    firstMounted: false,
    inUpdate: false,
    updateClicked: false
  }


  componentDidMount = () => {       
    axios.all([
      axios.get(process.env.REACT_APP_DATABASE_PATH + 'department/getdept'),
      axios.get(process.env.REACT_APP_DATABASE_PATH + 'company/all-company')
    ])
    .then(axios.spread((req1, req2) => {
      this.setState({
        comp_id: req1.data.elems[0].company_id._id,
        dept_id: req1.data.elems[0]._id,
        companies: req2.data,
        firstMounted: true
      })
    }))        
  }

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    if (this.state.firstMounted) {
      axios.get(process.env.REACT_APP_DATABASE_PATH + 'company/all-company')
        .then(res => {
          this.setState({
            comp_id: this.props.history.location.state[0].department_id.company_id._id,
            dept_id: this.props.history.location.state[0].department_id._id,
            companies: res.data,
            department_name: this.props.history.location.state[0].department_id.department_name,
            company_name: this.props.history.location.state[0].department_id.company_id.company_name,
            emp_name: this.props.history.location.state[0].emp_name,
            emp_email: this.props.history.location.state[0].emp_email,
            emp_contact_no: this.props.history.location.state[0].emp_contact_no,
            interview_date: this.props.history.location.state[0].interview_date.substring(0, 10),
            hire_date: this.props.history.location.state[0].hire_date.substring(0, 10),
            start_date: this.props.history.location.state[0].start_date.substring(0, 10),
            termination_date: this.props.history.location.state[0].termination_date !== null ? this.props.history.location.state[0].termination_date.substring(0, 10) : '',
            emp_address: this.props.history.location.state[0].emp_address,
            firstMounted: false,
            inUpdate: true
          })
        })
    }
    // so that it doesn't go on an infinite loop and it doesn't give us a server error
    if (this.state.comp_id !== prevState.comp_id && this.state.comp_id.trim() !== '') {
      axios.get(process.env.REACT_APP_DATABASE_PATH + 'department/company/' + this.state.comp_id)
      .then(res =>{
        
        this.setState({
          deparments: res.data.elems.map(data => {
            return {
              _id: data._id,
              department_name: data.department_name,
              company_id: data.company_id._id,
              firstMounted: false
            }          
          }),          
          dept_id: res.data.elems.length > 0 ? res.data.elems[0]._id : '',
          comp_id: res.data.elems.length > 0 ? res.data.elems[0].company_id._id : ''
        })
      })
      .catch(err=> console.log(err.response.data.msg));
    }
  }

  handleChange = (event) => {
    const {name, value} = event.target;
    this.setState({
      [name]: value
    })
  }

  handleCompChange = (event) => {
    const {name, value} = event.target;
    const comps = this.state.companies.filter((data) => data.company_name === value);
    this.setState({
      [name]: value,
      comp_id: comps[0]._id
    })    
  }

  handleDeptChange = (event) => {
    const {name, value} = event.target;
    const depts = this.state.deparments.filter((data) => data.department_name === value);

    this.setState({
      [name]: value,
      dept_id: depts[0]._id
    })    
  }

  handleSubmit = (event) => {
    event.preventDefault();    
    const newEmployee = {
      department_id: this.state.dept_id,
      emp_name: this.state.emp_name,
      emp_email: this.state.emp_email,
      emp_contact_no: this.state.emp_contact_no,
      interview_date: this.state.interview_date,
      hire_date: this.state.hire_date,
      start_date: this.state.start_date,
      emp_address: this.state.emp_address
    }
    
    axios.post(process.env.REACT_APP_DATABASE_PATH + 'employee/addemployee', newEmployee)
      .then(res => { console.log(res.data + " sent!"); })
      .catch(err => console.log(err.response.data.msg))
  }  

  handleUpdate = (event) => {
    event.preventDefault(); 
    const updateEmployee = {
      department_id: this.state.dept_id,
      emp_name: this.state.emp_name,
      emp_email: this.state.emp_email,
      emp_contact_no: this.state.emp_contact_no,
      interview_date: this.state.interview_date,
      hire_date: this.state.hire_date,
      start_date: this.state.start_date,
      emp_address: this.state.emp_address,
      termination_date: this.state.termination_date
    }

    axios.post(process.env.REACT_APP_DATABASE_PATH + 'employee/update/' + this.props.history.location.state[0]._id, updateEmployee)
      .then(res => { console.log(res.data + " updated!"); })
      .catch(err => console.log(err.response.data.msg))
    
    const withMsg = {msg: 'Updated Successfully!', dept_id: this.state.dept_id}
    this.props.history.push('/employees', withMsg)
  }

  clearDate = () => {
    this.setState({
      termination_date: ''
    })
  }

  render() {
    if (!this.state.inUpdate) {
      return (
        <div>
          <h4>Loading...</h4>
        </div>
      )
    } else {      
      return (
        <div>
          <h1>Update Employee</h1>
  
          <form onSubmit={this.state.inUpdate ? this.handleUpdate : this.handleSubmit}>
            <label>Choose From Companies: </label>
            <select
              className="select-dropdown"
              required
              name="company_name"
              value={this.state.company_name}
              onChange={this.handleCompChange}
            >
              {/* <option>Please Select a Company</option> */}
              {// lists out all options from user list
                  this.state.companies.map(function (comp) {
                      return <option
                          key={comp._id}
                          value={comp.company_name}>{comp.company_name}
                      </option>;
                  })
              }
            </select><br/>

            <label>Choose From Department: </label>
            <select
              className="select-dropdown"
              required
              name="department_name"
              value={this.state.department_name}
              onChange={this.handleDeptChange}
            >
              {/* <option>Please Select a Department</option> */}
              {// lists out all options from user list
                  this.state.deparments.map(function (dept) {
                      return <option
                          key={dept._id}
                          value={dept.department_name}>{dept.department_name}
                      </option>;
                  })
              }
            </select><br/>
            
            <label>Employee Name:</label>
            <input 
              type='text' 
              name='emp_name' 
              value={this.state.emp_name}
              placeholder='Employee Name'
              onChange={this.handleChange}
              required
            /><br/>
  
            <label>Employee Email:</label>
            <input 
              type='Email' 
              name='emp_email' 
              value={this.state.emp_email}
              placeholder='Employee Email'
              onChange={this.handleChange}
              required
            /><br/>
            
            <label>Employee Phone:</label>
            <input 
              type='text' 
              name='emp_contact_no'
              value={this.state.emp_contact_no} 
              placeholder='Employee Number'
              onChange={this.handleChange}
              required
            /><br/>
  
            <label>Employee Address:</label>
            <input 
              type='text' 
              name='emp_address' 
              value={this.state.emp_address}
              placeholder='Employee Address'
              onChange={this.handleChange}
              required
            /><br/>
  
            <label>Interview Date: </label>
            <input 
              type='Date' 
              name='interview_date'
              value={this.state.interview_date}
              onChange={this.handleChange}
              required
            /><br/>
            
            <label>Hire Date: </label>
            <input 
              type='Date' 
              name='hire_date'
              value={this.state.hire_date}
              onChange={this.handleChange}
              required
            /><br/>
  
            <label>Start Date: </label>
            <input 
              type='Date' 
              name='start_date'
              value={this.state.start_date}
              onChange={this.handleChange}
              required
            /><br/>       
  
            <label>Termination Date: </label>
            <input 
              type='Date' 
              name='termination_date'
              value={this.state.termination_date}
              onChange={this.handleChange}
            />
            <button className="clear-btn" title="Clear Date" type='button' onClick={this.clearDate}>
              <ion-icon name="close-circle-outline"></ion-icon>
            </button><br/>
            
            <button className="submit-btn">{this.state.inUpdate ? 'Update Employee' : 'Create Employee'}</button>
          </form>
        </div>
      )
    }
  }
}
