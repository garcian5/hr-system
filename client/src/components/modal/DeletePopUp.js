import React from 'react';
import Modal from 'react-bootstrap/Modal';

export default function DeletePopUp(props) {
  console.log(props.company_name)
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
        <button className='del-img-mod-btn' onClick={props.delcompany}>Delete</button>
        <button className='cancel-btn' onClick={props.onHide}>Cancel</button>
      </Modal.Footer>
    </Modal>
  )
}
