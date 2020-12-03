import React from 'react';
import Modal from 'react-bootstrap/Modal';
import EnterImage from '../entries/EnterImage';

export default function UpdateImgModal(props) {
  
  const closeClicked = () => {
    window.location.reload()
  }
  
  return (
    <div>
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="img-modal"
        animation={false}
        backdrop="static"
      >
        <Modal.Body>
          <EnterImage 
            dept_id={props.dept_id}
            emp_email={props.emp_email}
            comp_id={props.comp_id}
            emp_id={props.emp_id}
          />
        </Modal.Body>

        <Modal.Footer>
          <button className='cancel-btn' onClick={closeClicked}>Close</button>
          {/* <button onClick={props.onHide}>Cancel</button> */}
        </Modal.Footer>
      </Modal>      
    </div>
  )
}
