import React from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';

export default function DeleteCompBox(props) {

  const delCompany = () => {
    axios.delete(process.env.REACT_APP_DATABASE_PATH + 'company/delete/' + props.company_id)
      .then(res => console.log(res.data + ' deleted!'))
      .catch(err=> console.log(err.response.msg));
    window.location.reload();
  }

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      dialogClassName="img-modal"
      animation={false}
    >
      <Modal.Header>
        Delete Company?
      </Modal.Header>

      <Modal.Body>
        <p className='del-txt-modal'>This will Delete all Company information including the Departments, Employees, and Employee images in the company.</p>
        <p className='del-txt-modal'>You can update company.</p>
      </Modal.Body>

      <Modal.Footer>
        <button className='del-img-mod-btn' onClick={delCompany}>Delete</button>
        <button className='cancel-btn' onClick={props.onHide}>Cancel</button>
      </Modal.Footer>
    </Modal>
  )
}
