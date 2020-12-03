import React, { Component } from 'react';
import axios from 'axios';

export default class EnterCompany extends Component {
  state={
    company_name: '',
    date_established: Date.now(),
    company_address: '',
    sent: false
  }

  handleChange = (event) => {
    const {name, value} = event.target;
    this.setState({
      [name]: value
    })
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const newCompany = {
      company_name: this.state.company_name,
      date_established: this.state.date_established,
      company_address: this.state.company_address
    }
    
    axios.post(process.env.REACT_APP_DATABASE_PATH + 'company/addcompany', newCompany)
      .then(res => {
        console.log(res.data + " sent!");
        this.setState({sent: true})
      })
      .catch(err => console.log(err))

    setTimeout(() => {
      window.location = '/companies'
    }, 2500)
  }

  render() {
    return (
      <div>
        <button 
          title='Back to Companies'
          className="back-btn"
          onClick={() => window.location = '/companies'}>
          <ion-icon name="arrow-back-outline"></ion-icon>
        </button>

        <h1 className="heading">Enter Company</h1>        

        <form className="form-block" onSubmit={this.handleSubmit}>
          <label>Company Name: </label>
          <input 
            type='text' 
            name='company_name' 
            placeholder='Company Name'
            onChange={this.handleChange}
            required
          /><br />

          <label>Date Established: </label>
          <input 
            type='Date' 
            name='date_established'
            onChange={this.handleChange}
          /><br />

          <label>Company Address: </label>
          <input 
            type='text' 
            name='company_address' 
            placeholder='Company Address' 
            onChange={this.handleChange}
          /><br />

          <button className="submit-btn">Create Company</button>
        </form>
        {this.state.sent ? <p>Sent!</p> : null}
      </div>
    )
  }
}
