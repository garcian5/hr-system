import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default class Departments extends Component {
  constructor () {
    super();
    this.state = {
      departments: [],
      companies: [],
      company_name: '',
      comp_id: '',
      deptsByComps: []
    }
  }

  componentDidMount() {
    const propState = this.props.history.location.state;
    axios.all([
      axios.get('http://localhost:5000/department/getdept'),
      axios.get('http://localhost:5000/company/all-company')
    ])
    .then(axios.spread((req1, req2) => {      
      this.setState({
        companies: req2.data,
        departments: req1.data.elems,
        comp_id: req2.data.length === 0 ? '' : propState !== undefined ? propState.comp_id : req2.data[0]._id,
        company_name: req2.data.length === 0 ? '' : propState !== undefined ? propState.company_name : req2.data[0].company_name
      })
    }))
  }

  delDept = (dept_id) => {    
    axios.delete('http://localhost:5000/department/delete/' + dept_id)
      .then(res => console.log(res.data + ' deleted!'))
      .catch(err=> console.log(err.response.msg));

    const extractCompId = this.state.departments.filter((dept) => 
                          dept._id === dept_id);
    this.props.history.push('/departments', {
      comp_id: extractCompId[0].company_id._id,
      company_name: this.state.company_name
    })
    window.location.reload();
  }

  handleChange = (event) => {
    const {name, value} = event.target;
    this.setState({
      [name]: value
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {    
    if (prevState.company_name !== this.state.company_name) {
      const extractCompId = this.state.companies.filter((comp) => comp.company_name === this.state.company_name);
      axios.get('http://localhost:5000/department/company/' + extractCompId[0]._id)
        .then(res => this.setState({
          departments: res.data.elems
        }))
        .catch(err=> console.log(err.response.data.msg))
    }
  }

  redirectToEmp = (dept_id) => {
    // redirect to employee info page
    this.props.history.push('/employees', {dept_id: dept_id})
  }

  render() {
    // if there are no companies existing, it means there are no departments existing    
    if (this.state.companies.length <= 0) {
      return (
        <div>
          <h4>There are no Companies and Departments existing.</h4>
          <p>Please Enter a Company and Department.</p>
          <Link to='/comp-entry'>Add Companies</Link>
        </div>
      )
    }
    const renderDept = this.state.departments.map(dept =>(
      <tr key={dept._id}>
        <td>
          <button className="delete-btn" onClick={() => this.delDept(dept._id)}>
            <ion-icon name="trash-outline"></ion-icon>
          </button>
        </td>
        <td>
        <button className="employee-name" onClick={() => this.redirectToEmp(dept._id)}>
          {dept.department_name}
        </button>
        </td>
        <td>
          {dept.num_emps}
        </td>
      </tr>			
		))
    return (
      <div>            
        <h1 className="heading">Departments</h1>
        <Link to='/dept-entry'>Add Department</Link>

        <form>
          <label>Choose From Companies: </label>
          <select
              className="select-dropdown"
              required
              name="company_name"
              value={this.state.company_name}
              onChange={this.handleChange}
          >
            {// lists out all options from user list
                this.state.companies.map(function (comp) {
                    return <option
                        key={comp._id}
                        value={comp.company_name}>{comp.company_name}
                    </option>;
                })
            }
          </select><br />
        </form>
        
        <table className="center">
          <tbody>
            <tr>
              <th></th>
              <th>Departments</th>
              <th>Number of Employees</th>
            </tr>
            {renderDept}
          </tbody>
        </table>
      </div>
    )
  }
}
