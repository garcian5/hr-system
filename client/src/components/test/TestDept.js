import React, { Component } from 'react';
import axios from 'axios';

export default class TestDept extends Component {  
  constructor () {
    super();
    this.state = {
      departments: [],
      companies: [],
      comp_id: '',
      deptsByComps: []
    }
  }

  /* componentDidMount() {
    axios.get('http://localhost:5000/department/getdept')
      //.then(res => console.log(res.data.elems))
      .then(res => this.setState({
        departments: res.data.elems
      }))
      .catch(err=> console.log(err.response.data.msg));
  } */

  componentDidMount() {
    axios.all([
      axios.get(process.env.REACT_APP_DATABASE_PATH + 'department/getdept'),
      axios.get(process.env.REACT_APP_DATABASE_PATH + 'company/all-company')
    ])
    .then(axios.spread((req1, req2) => {
      this.setState({
        departments: req1.data.elems,
        companies: req2.data,
        comp_id: req2.data[0]._id
      })
    }))
  }

  /* componentDidUpdate(prevProps, prevState, snapshot) {
    console.log('prev: ', prevState.comp_id);
    console.log('current: ', this.state.comp_id);
    if (this.state.comp_id !== prevState.comp_id || this.state.companies.length > 0) {      
      axios.get('http://localhost:5000/department/company/' + this.state.comp_id)
        .then(res => {
          this.setState({
            //deptsByComps: this.state.deptsByComps.push(res.data.elems),
            companies: this.state.companies.shift(),
            comp_id: this.state.companies.length > 0 ? this.state.companies[0]._id : ''
          })
        }).catch(err=> console.log(err.response.data.msg));
    }
  } */

  delDept = (dept_id) => {    
    axios.delete(process.env.REACT_APP_DATABASE_PATH + 'department/delete/' + dept_id)
      .then(res => console.log(res.data + ' deleted!'))
      .catch(err=> console.log(err.response.msg));
    window.location.reload();
  }

  render() {
    //console.log(this.state.comp_id);
    console.log('companies: ', this.state.companies);
    //console.log('deptsbycomps: ', this.state.deptsByComps);
    const renderDept = this.state.departments.map(dept =>(
			<ul key={dept._id}>
				<li>
          Company Name: {dept.company_id.company_name}
          <button onClick={() => this.delDept(dept._id)}>Delete</button>
        </li>
				<li>Department Name: {dept.department_name}</li>			
			</ul>
		))
    return (
      <div>
        <h2>Test Departments</h2>
        {renderDept}
      </div>
    )
  }
}
