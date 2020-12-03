import React, {useState, useEffect} from 'react';
import axios from 'axios';

export default function UpdateCompany(props) {
  // initialize state
  const [comp_info, setComp_info] = useState({});
  const [company_name, setCompany_name] = useState('')
  const [date_established, setDate_established] = useState(Date.now())
  const [company_address, setCompany_address] = useState('')

  // lifecycle method to run first get request
  // added props.history... as a callback because without it it will throw a bad practice warning
  useEffect(() => {
    axios.get(process.env.REACT_APP_DATABASE_PATH + 'company/' + props.history.location.state)
      .then(res => {
        setComp_info(res.data);
        setCompany_name(res.data.company_name);
        setDate_established(res.data.date_established.substring(0, 10));
        setCompany_address(res.data.company_address);

      })
      .catch(error => {console.log(error.response.data.msg)})
  }, [props.history.location.state])

  const updateCompany = (event) => {
    event.preventDefault()
    const updateComp = {
      company_name: company_name,
      date_established: date_established,
      company_address: company_address
    }
    axios.post(process.env.REACT_APP_DATABASE_PATH + 'company/update/' + props.history.location.state, updateComp)
      .then(res => {
        console.log(res.data)        
      })
      .catch(err => {console.log(err.response.data.msg)})
    window.location = '/companies'
  }

  const handleChange = (event) => {
    const {name, value} = event.target;
    if (name === 'company_name') setCompany_name(value)
    if (name === 'date_established') setDate_established(value)    
    if (name === 'company_address') setCompany_address(value)    
  }
  
  return (
    <div>
      <button 
          title='Back to Companies'
          className="back-btn"
          onClick={() => window.location = '/companies'}>
          <ion-icon name="arrow-back-outline"></ion-icon>
        </button>

        <h1 className="heading">Update {comp_info.company_name}</h1>        

        <form className="form-block" onSubmit={updateCompany}>
          <label>Company Name: </label>
          <input 
            type='text' 
            name='company_name' 
            placeholder='Company Name'
            value={company_name}
            onChange={handleChange}
            required
          /><br />

          <label>Date Established: </label>
          <input 
            type='Date' 
            name='date_established'
            value={date_established}
            onChange={handleChange}
          /><br />

          <label>Company Address: </label>
          <input 
            type='text' 
            name='company_address' 
            placeholder='Company Address' 
            value={company_address}
            onChange={handleChange}
          /><br />

          <button className="submit-btn">Create Company</button>
        </form>
    </div>
  )
}

