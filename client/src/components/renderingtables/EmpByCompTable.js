import React from 'react';
import { useHistory } from "react-router-dom";

export default function EmpByCompTable(props) {
  const history = useHistory();
  /**
   * Convert image buffer to base64 to display on screen
   * @param {*} buffer 
   */
  const arrayBufferToBase64 = (buffer) => {
    var binary = '';
    var bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => binary += String.fromCharCode(b));
    return window.btoa(binary);
  }

  const employeeInfo = (emp_id) => {
    // redirect to employee info page
    history.push('/emp-info', emp_id)
  }

  const renderEmp = props.employees.map(emp =>(
    <tr key={emp._id}>
      <td>
        <button className="edit-btn" onClick={() => this.updateEmployee(emp._id)}>
          <ion-icon name="pencil-outline"></ion-icon>
        </button>
      </td>
      <td>
        <button className="delete-btn" onClick={() => this.delEmployee(emp._id)}>
          <ion-icon name="trash-outline"></ion-icon>
        </button>
      </td>
      <td>
        {(emp.image_id !== null && emp.image_id !== undefined) ? 
          <div className="img-block">
            <img className='img-src' 
              src={`data:image/jpg;base64,${arrayBufferToBase64(emp.image_id.image.data.data)}`} 
              alt={emp.emp_name}
            /> 
          </div> : 
          'N/A'
        }
      </td>
      <td>
        <button className="employee-name" onClick={() => employeeInfo(emp._id)}>
          {emp.emp_name}
        </button>
      </td>
      <td>
        {emp.department_id.department_name}
      </td>
    </tr>
  ))
  return (
    <div>
      <button 
        title='Back to Employees'
        className="back-btn"
        onClick={() => window.location = '/companies' /* this.props.history.push('/companies') */}>
        <ion-icon name="arrow-back-outline"></ion-icon>
      </button>
      <table className="center">
          <tbody>
            <tr>
              <th></th>
              <th></th>
              <th>Employee Image</th>
              <th>Employee Name</th>              
              <th>Department</th>
            </tr>
            {renderEmp}
          </tbody>
        </table>
    </div>
  )
}