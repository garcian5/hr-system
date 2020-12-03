import React, { Component } from 'react';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert'

export default class EnterDepartment extends Component {
  state = {
    companies: [],
    company_name: '',
    dept_name: '',
    sent: false,
    invalidComp: false,
    errorMsg: '',
    showErrMsg: false
  }

  handleChange = (event) => {
    const {name, value} = event.target;
    this.setState({
      [name]: value
    })
  }

  handleSubmit = (event) => {
    event.preventDefault();    

    // if company_name submitted isn't in the database, send an error message
    if(!this.state.companies.some(e => e.company_name === this.state.company_name)) {
      this.setState({invalidComp: true})
    } else {
      // extract company id
      const extractCompId = this.state.companies.filter((comp) => comp.company_name === this.state.company_name);
      //console.log(extractCompId[0])
      const newDept = {
        company_id: extractCompId[0]._id,
        department_name: this.state.dept_name
      }
      
      axios.post(process.env.REACT_APP_DATABASE_PATH + 'department/adddept', newDept)
        .then(res => {
          console.log(res.data + " sent!");
          this.setState({sent: true, invalidComp: false, 
            errorMsg: '', showErrMsg: false});
        })
        .catch(err => this.setState({
          errorMsg: err.response.data.msg, showErrMsg: true}))      
    }

    // send back to list of departments
    /* setTimeout(() => {
      window.location = '/departments'
    }, 1500) */
  }

  componentDidMount = () => {
    axios.get(process.env.REACT_APP_DATABASE_PATH + 'company/all-company')
      .then(res => {
        this.setState({
          companies: res.data
        })
      })
      .catch(err=> console.log(err.response.data.msg));        
  }

  render() {
    return (
      <div>
        <button 
          title='Back to Employees'
          className="back-btn"
          onClick={() => window.location = '/departments'}>
          <ion-icon name="arrow-back-outline"></ion-icon>
        </button>

        <h1 className="heading">Enter Department</h1>
        <Alert show={this.state.showErrMsg} variant='danger'>
          <p>{this.state.errorMsg}</p>
        </Alert>

        <form className="form-block" onSubmit={this.handleSubmit}>
        <label>Choose From Companies: </label>
          <select
              className="select-dropdown"
              required
              name="company_name"
              value={this.state.company_name}
              onChange={this.handleChange}
          >
              <option>Please Select a Company</option>
              {// lists out all options from user list
                  this.state.companies.map(function (comp) {
                      return <option
                          key={comp._id}
                          value={comp.company_name}>{comp.company_name}
                      </option>;
                  })
              }
          </select><br />
          
          <label>Department Name:</label>
          <input 
            type='text' 
            name='dept_name' 
            placeholder='Department Name'
            onChange={this.handleChange}
            required
          /><br />

          <button className="submit-btn">Create Department</button>
        </form>

        {this.state.sent ? 
          <div>          
            <p>Department Created!</p> 
            {// if successful in creating department, redirect back to departments table              
              setTimeout(() => {
                this.props.history.push('/departments', {
                  comp_id: this.state.companies.filter((comp) => comp.company_name === this.state.company_name),
                  company_name: this.state.company_name
                })
              }, 1500)}
          </div> : null}
        {this.state.invalidComp ? <p>Please Select a Company!</p> : null}
      </div>
    )
  }
}
