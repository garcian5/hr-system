import React from 'react'

export default function DeleteActions(props) {
  const delCompany = () => {
    axios.delete(process.env.REACT_APP_DATABASE_PATH + 'company/delete/' + props.company_id)
      .then(res => console.log(res.data + ' deleted!'))
      .catch(err=> console.log(err.response.msg));
    window.location.reload();
  }
  return (
    <div>
      
    </div>
  )
}
