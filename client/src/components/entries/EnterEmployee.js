import React, { Component } from 'react';
import axios from 'axios';
import EnterImage from './EnterImage';

export default class EnterEmployee extends Component {
  // to avoid memory leak warning, we need to unmount state
  _isMounted = false;

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
    interview_date: '',
    hire_date: '',
    start_date: '',
    emp_address: '',
    termination_date: '',

    imgFile: null,
    updatePicBtnClicked: false,

    sent: false,
    inUpdate: false,
    firstMounted: true
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
      .then(res => {
        console.log(res.data + " sent!");
        this.setState({sent: true});
        this.props.history.push('/img-entry', {
          emp_email: this.state.emp_email,
          comp_id: this.state.comp_id,
          dept_id: this.state.dept_id
        });
      })
      .catch(err => console.log(err.response.data.msg))

    /* setTimeout(() => {
      window.location = '/employees'
    }, 1500); */
    /* const withMsg = {msg: 'Updated Successfully!', dept_id: this.state.dept_id}
    this.props.history.push('/employees', withMsg) */        
  }

  componentDidMount = () => {
    this._isMounted = true;
    const propState = this.props.history.location.state
    //console.log(propState)
    axios.all([
      axios.get(process.env.REACT_APP_DATABASE_PATH + 'department/getdept'),
      axios.get(process.env.REACT_APP_DATABASE_PATH + 'company/all-company')
    ])
    .then(axios.spread((req1, req2) => {
      this.setState({
        //comp_id: req1.data.elems[0].company_id._id,
        comp_id: propState !== undefined ? propState.comp_id : req2.data[0]._id,
        dept_id: propState !== undefined ? propState.dept_id : req1.data.elems[0]._id,
        company_name: propState !== undefined ? propState.comp_name : '',
        department_name: propState !== undefined ? propState.dept_name : '',
        companies: req2.data,
        inUpdate: propState !== undefined ? true : false,
        firstMounted: true
      })
    }))
  }

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    const propState = this.props.history.location.state
    //console.log('compid: ', this.state.comp_id)
    // only happens in update
    if (this.state.firstMounted && this.state.inUpdate) {      
      this.setState({
        emp_name: propState.emp_name,
        emp_email: propState.emp_email,
        emp_contact_no: propState.emp_contact_no,
        interview_date: propState.interview_date.substring(0, 10),
        hire_date: propState.hire_date.substring(0, 10),
        start_date: propState.start_date.substring(0, 10),
        emp_address: propState.emp_address,
        termination_date: propState.termination_date !== null ? propState.termination_date.substring(0, 10) : '',
        firstMounted: false
      })
    }

    // so that it doesn't go on an infinite loop and it doesn't give us a server error
    // only happens if not in update
    if (this.state.comp_id !== prevState.comp_id && this.state.comp_id.trim() !== '') {
      axios.get(process.env.REACT_APP_DATABASE_PATH + 'department/company/' + this.state.comp_id)
      .then(res =>{
        //console.log(res.data.elems)
        this.setState({
          deparments: res.data.elems.map(data => {
            return {
              _id: data._id,
              department_name: data.department_name,
              company_id: data.company_id._id
            }          
          }),          
          dept_id: res.data.elems.length > 0 ? res.data.elems[0]._id : '',
          comp_id: res.data.elems[0].company_id._id,
          firstMounted: false
        })
      })
      .catch(err=> console.log(err.response.data.msg));
    }
  }

  updateEmployee = (event) => {
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

    const propState = this.props.history.location.state;
    axios.post(process.env.REACT_APP_DATABASE_PATH + 'employee/update/' + propState.emp_id, updateEmployee)
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

  componentWillUnmount () {
    this._isMounted = false;
  }

  render() {
    //console.log('comp id:',this.state.comp_id)
    //console.log('dept id:', this.state.dept_id)
    //console.log(this.state.dept_id)
    //console.log(this.state.emp_name)
    if (this.state.firstMounted) {
      return (
        <div>
          <h1>Loading...</h1>
        </div>
      )
    } else {      
      return (
        <div>
          <button 
            title='Back to Employees'
            className="back-btn"
            onClick={() => window.location = '/employees'}>
            <ion-icon name="arrow-back-outline"></ion-icon>
          </button>
          {
            this.state.inUpdate ?
            <h1 className="heading">Update Employee</h1>
            : <h1 className="heading">Enter New Employee</h1>
          }

          {
            this.state.inUpdate ?
              <div>
                <button 
                  className="submit-btn" 
                  title="Update Profile Pic" 
                  type='button'
                  onClick = {() => this.setState({
                    updatePicBtnClicked: !this.state.updatePicBtnClicked
                  })}
                >Update Profile Pic</button>

                { this.state.updatePicBtnClicked ?
                  <EnterImage 
                    dept_id={this.state.dept_id}
                    emp_email={this.state.emp_email}
                    comp_id={this.state.comp_id}
                    emp_id={this.props.history.location.state.emp_id}
                  /> : null
                }
              </div>
            : null
          }
  
          <form className="form-block" onSubmit={this.state.inUpdate ? this.updateEmployee : this.handleSubmit}>
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
            
            <label>Employee Name: </label>
            <input 
              type='text' 
              name='emp_name'
              value={this.state.emp_name}
              placeholder='Employee Name'
              onChange={this.handleChange}
              required
            /><br/>
  
            <label>Employee Email: </label>
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
            
            {
              this.state.inUpdate ?
              <div>
                <label>Termination Date: </label>
                <input 
                  type='Date' 
                  name='termination_date'
                  value={this.state.termination_date}
                  onChange={this.handleChange}              
                />
                {
                  this.state.termination_date.trim() !== '' ?
                  <button className="clear-btn" title="Clear Date" type='button' onClick={this.clearDate}>
                  <ion-icon name="close-circle-outline"></ion-icon>
                  </button>
                : null
                }                
            </div>
            : null
            }
  
            <button className="submit-btn">{this.state.inUpdate ? 'Update Employee' 
            : 'Create Employee'}</button>
          </form>
          {this.state.sent ? <p>Employee Added!</p> : null}
        </div>
      )
    }
  }
}
