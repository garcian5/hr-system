import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default class Companies extends Component {
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

  updateClicked = (company_id) => {
    this.props.history.push('/comp-update', company_id)
  }

  render() {
    const renderComps = this.state.companies.map(comp =>(
      <tr key={comp._id}>
        <td>
          <button className="edit-btn" onClick={() => this.updateClicked(comp._id)}>
            <ion-icon name="pencil-outline"></ion-icon>
          </button>
        </td>
        <td>          
          <button className="delete-btn" onClick={() => this.delCompany(comp._id)}>
            <ion-icon name="trash-outline"></ion-icon>
          </button>
        </td>
        <td>          
          {comp.company_name}
        </td>
        <td>          
          {comp.company_address}
        </td>
        <td>          
          {comp.date_established ? comp.date_established.substring(0, 10) : 'N/A'}
        </td>
        <td>
          <p>{comp.num_depts}</p>
        </td>
        <td>
          {comp.num_emps}
        </td>
      </tr>
		))
    return (
      <div>
        <h1 className="heading">Company</h1>
        <Link to='/comp-entry'>Add Company</Link>
        <table className="center">
          <tbody>
            <tr>
              <th></th>
              <th></th>
              <th>Company Name</th>
              <th>Company Address</th>
              <th>Date Established</th>
              <th>Number of Departments</th>
              <th>Number of Employees</th>
            </tr>
            {renderComps}
          </tbody>
        </table>
      </div>
    )
  }  
}
