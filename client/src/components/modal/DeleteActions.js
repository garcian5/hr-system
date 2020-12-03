import React from 'react'
import DeletePopUp from './DeletePopUp';
import axios from 'axios';

export default function DeleteActions(props) {
  const delCompany = () => {
    axios.delete(process.env.REACT_APP_DATABASE_PATH + 'company/delete/' + props.company_id)
      .then(res => {
        console.log(res.data + ' deleted!');
        window.location.reload();
      })
      .catch(err=> console.log(err.response.msg));    
  }
  const afunction = () => {
    console.log('clicked a function');
  }
  return (
    <div>
      <DeletePopUp 
        show={props.show}
        onHide={props.onHide}
        company_name={props.company_name}
        delcompany={afunction}
        action='delcompany'
      />
    </div>
  )
}
