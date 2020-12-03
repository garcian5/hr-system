import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import DeleteCompBox from '../modal/company/DeleteCompBox';
import DeleteActions from '../modal/DeleteActions';

export default class Companies extends Component {
  constructor () {
    super();
    this.state = {
      companies: [],
      compIdToDel: '',
      compNameToDel: '',

      delCompClicked: false
    }

  }
  
  componentDidMount() {
    axios.get(process.env.REACT_APP_DATABASE_PATH + 'company/all-company')
      .then(res => this.setState({companies: res.data, delCompClicked: false}))
      .catch(err=> console.log(err.response.msg));
  }    

  updateClicked = (company_id) => {
    this.props.history.push('/comp-update', company_id)
  }

  onModalHide = () => {this.setState({delCompClicked: false})}

  render() {
    const renderComps = this.state.companies.map(comp =>(
      <tr key={comp._id}>
        <td>
          <button className="edit-btn" onClick={() => this.updateClicked(comp._id)}>
            <ion-icon name="pencil-outline"></ion-icon>
          </button>
        </td>
        <td>          
          <button 
            className="delete-btn" 
            onClick={() => this.setState({
                delCompClicked: true, 
                compIdToDel: comp._id,
                compNameToDel: comp.company_name
              })
            }
          >
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
        <DeleteActions
          show={this.state.delCompClicked}
          onHide={this.onModalHide}
          company_id={this.state.compIdToDel}
          company_name={this.state.compNameToDel}
        />
        {/* <DeleteCompBox
          show={this.state.delCompClicked}
          onHide={this.onModalHide}
          company_id={this.state.compIdToDel}
        /> */}
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
