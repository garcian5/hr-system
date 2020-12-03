import React, { Component } from 'react';
import axios from 'axios';

export default class TestComp extends Component {
  constructor () {
    super();
    this.state = {
      companies: []
    }

  }
  
  componentDidMount() {
    axios.get(process.env.REACT_APP_DATABASE_PATH + 'company/all-company')
      .then(res => this.setState({companies: res.data}))
      .catch(err=> console.log(err.response.msg));
  }
  
  delCompany = (company_id) => {
    axios.delete(process.env.REACT_APP_DATABASE_PATH + 'company/delete/' + company_id)
      .then(res => console.log(res.data + ' deleted!'))
      .catch(err=> console.log(err.response.msg));
    window.location.reload();
  }

  render() {
    const renderComps = this.state.companies.map(comp =>(       
      <ul key={comp._id}>        
        <li>Name: {comp.company_name} 
          <button onClick={() => this.delCompany(comp._id)}>Delete</button>
        </li>
        <li>Address: {comp.company_address}</li>
        <li>Date established: {comp.date_established}</li>				
      </ul>
		))
    return (
      <div>
        <h2>Test Companies</h2>
        {renderComps}
      </div>
    )
  }
}
