import React from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';

export default function DeleteImgModal(props) {
  const delImg = () => {
    axios.delete(process.env.REACT_APP_DATABASE_PATH + 'image/del-image/' + props.img_id)
      .then(res => {
        console.log(res.data.msg, res.data.img);
        window.location.reload();
      })
      .catch(err=> console.log('error:', err.response));
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
      >
        <Modal.Header>
          Delete Image?
        </Modal.Header>

        <Modal.Body>
          <p className='del-txt-modal'>Are you sure you want to delete image? You can update image.</p>
        </Modal.Body>

        <Modal.Footer>
          <button className='del-img-mod-btn' onClick={delImg}>Delete</button>
          <button className='cancel-btn' onClick={props.onHide}>Cancel</button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
