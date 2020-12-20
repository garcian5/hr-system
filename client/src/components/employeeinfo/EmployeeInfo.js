import Axios from 'axios';
import React, { Component } from 'react';
import DeleteImgModal from '../modal/DeleteImgModal';
import UpdateImgModal from '../modal/UpdateImgModal';

export default class EmployeeInfo extends Component {
  constructor () {
    super();
    this.state = {
      emp_info: [],
      img: '',
      pic: '',
      img_name: '',
      img_id: '',

      firstMounted: true,
      imgDisplayed: false,
      
      updateModalShow: false,
      delModalShow: false,
    }
  }

  componentDidMount() {
    const compId = this.props.history.location.state;
    Axios.get(process.env.REACT_APP_DATABASE_PATH + 'employee/' + compId)
      .then(res => {
        console.log(res.data)
        this.setState({
          emp_info: res.data,
          img: (res.data.image_id !== null && res.data.image_id !== undefined) ? this.arrayBufferToBase64(res.data.image_id.image.data.data) : null,
        })
      })
      .catch(err=> console.log('errorhj:', err.response));
  }

  convDate = (date) => {
    const newDate = new Date(date);
    return newDate.slice(4, 13);
  }

  arrayBufferToBase64 = (buffer) => {
    var binary = '';
    var bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => binary += String.fromCharCode(b));
    return window.btoa(binary);
  }

  delClicked = () => this.setState({delModalShow: true})
  updateClicked = () => this.setState({updateModalShow: true})
  onModalHide = () => this.setState({delModalShow: false, updateModalShow: false})

  render() {
    const {emp_info} = this.state; // object destructuring
    if (emp_info.length < 1) {
      return (<h1>Loading...</h1>)     
    } else {    
      const start_date_ = new Date(emp_info.start_date.substring(0,10));
      const yearsInCompDiff = Date.now() - start_date_;
      const yearsInComp = new Date(yearsInCompDiff);
      // to get rid of spaces
      //console.log(emp_info.emp_name.replace(/\s+/g, ''))
  
      return (
        <div>
          <button 
            title='Back to Employees'
            className="back-btn"
            onClick={() => this.props.history.push('/employees', 
                {msg: '', dept_id: emp_info.department_id._id})}>
            <ion-icon name="arrow-back-outline"></ion-icon>
          </button>

          <h1>Employee Info</h1>
  
          <h3>{emp_info.emp_name}</h3>

          <DeleteImgModal 
            show={this.state.delModalShow}
            onHide={this.onModalHide}
            img_id={this.state.img_id}
          />
          <UpdateImgModal
            show={this.state.updateModalShow}
            onHide={this.onModalHide}
            dept_id={emp_info.department_id._id}
            emp_email={emp_info.emp_email}
            comp_id={emp_info.department_id.company_id._id}
            emp_id={emp_info._id}
          />

          <div className="img-block">
            { this.state.img !== null ?
              <div>
                <ul className='img-del-edit-btn'>
                  <li className='img-btn' title='delete'>
                    <button 
                      className="img-del-btn delete-btn"
                      onClick={this.delClicked}
                    >
                      <ion-icon name="trash-outline"></ion-icon>
                    </button>                    
                  </li>

                  <li className='img-btn' title='edit'>
                    <button 
                      className="img-edit-btn edit-btn"
                      onClick={this.updateClicked}
                    >
                      <ion-icon name="pencil-outline"></ion-icon>
                    </button>
                  </li>
                </ul>
                <img 
                  className='img-src' 
                  src={`data:image/jpg;base64,${this.state.img}`} 
                  alt={this.state.img_name}
                />
              </div>
              : 
              <div>
                <p style={{color: 'red'}}>No image</p>
                <button 
                  className='img-del-edit-btn add-img-btn' 
                  title='Add Image?'
                  onClick={this.updateClicked}
                >
                  <ion-icon name="add-outline"></ion-icon>
                </button><br/>
              </div>
            }
          </div>

          <div>
            <p>{emp_info.emp_name} is an employee at {emp_info.department_id.company_id.company_name}.</p>
            <p>They work under the {emp_info.department_id.department_name} department.</p>
            { emp_info.termination_date === null ?
              <p>They have been with the company since {Date(emp_info.start_date.substring(0, 10)).slice(4, 13)}.</p>
              //<p>They have been with the company since {start_date_}.</p>
              : 
              <p>They have worked with the company from 
                {Date(emp_info.start_date.substring(0, 10)).slice(4, 13)} to 
                {Date(emp_info.termination_date.substring(0, 10)).slice(4, 13)}
              </p>
            }
            
            <p>The company thanks them for their service of {yearsInComp.getUTCFullYear() - 1970} years.</p>  
          </div>

          <div>
            <ul>
              <li>Employee Email: {emp_info.emp_email}</li>
              <li>Employee Contact Number: {emp_info.emp_contact_no}</li>
              <li>Employee Address: {emp_info.emp_address}</li>
              <li>Interview Date: {emp_info.interview_date.substring(0, 10)}</li>
              <li>Hire Date: {emp_info.hire_date.substring(0, 10)}</li>
              <li>Start Date: {emp_info.start_date.substring(0, 10)}</li>
              {emp_info.termination_date !== null ? 
                <li>Termination Date: {emp_info.termination_date.substring(0, 10)}</li> : null
              }
            </ul>
          </div>
        </div>
      )
    }  
  }
}

/* import React, { Component } from 'react';
import axios from 'axios';
import DeleteImgModal from '../modal/DeleteImgModal';
import UpdateImgModal from '../modal/UpdateImgModal';

export default class EmployeeInfo extends Component {
  state = {
    emp_info: [],
    img: '',
    pic: '',
    img_name: '',
    img_id: '',

    firstMounted: true,
    imgDisplayed: false,
    
    updateModalShow: false,
    delModalShow: false,    
  }
  componentDidMount() {    
    // get different routes in case the employee doesn't have an uploaded image
    // if employee doesn't have any image, get data from employee route
    // if employee has image, get data from image route
    axios.all([
      axios.get(process.env.REACT_APP_DATABASE_PATH + 'employee/' + this.props.history.location.state),
      axios.get(process.env.REACT_APP_DATABASE_PATH + 'image/emp-img/' + this.props.history.location.state)
    ])
    .then(axios.spread((res1, res2) => {
      this.setState({
        emp_info: res2.data !== null ? res2.data.employee_id : res1.data,
        img: res2.data !== null? this.arrayBufferToBase64(res2.data.image.data.data) : null,
        img_id: res2.data !== null ? res2.data._id : null
      })
    }))
    .catch(err=> console.log('error:', err.response));
  }

  // /**
  //  * Convert image buffer to base64 to display on screen
  //  * @param {*} buffer 
  //  
  arrayBufferToBase64 = (buffer) => {
    var binary = '';
    var bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => binary += String.fromCharCode(b));
    return window.btoa(binary);
  }

  convDate = (date) => {
    const newDate = new Date(date);
    return newDate.slice(4, 13);
  }

  // /**
  //  * Delete image
  //  
  // delImg = () => {
  //   axios.delete(process.env.REACT_APP_DATABASE_PATH + 'image/del-image/' + this.state.img_id)
  //     .then(res => {
  //       console.log(res.data.msg, res.data.img);
  //       window.location.reload();
  //     })
  //     .catch(err=> console.log('error:', err.response));
  // }


  delClicked = () => this.setState({delModalShow: true})
  updateClicked = () => this.setState({updateModalShow: true})
  onModalHide = () => this.setState({delModalShow: false, updateModalShow: false})

  render() {
    const {emp_info} = this.state; // object destructuring
    if (emp_info.length < 1) {
      return (<h1>Loading...</h1>)     
    } else {    
      const start_date_ = new Date(emp_info.start_date.substring(0,10));
      const yearsInCompDiff = Date.now() - start_date_;
      const yearsInComp = new Date(yearsInCompDiff);
      // to get rid of spaces
      //console.log(emp_info.emp_name.replace(/\s+/g, ''))
  
      return (
        <div>
          <button 
            title='Back to Employees'
            className="back-btn"
            onClick={() => this.props.history.push('/employees', 
                {msg: '', dept_id: emp_info.department_id._id})}>
            <ion-icon name="arrow-back-outline"></ion-icon>
          </button>

          <h1>Employee Info</h1>
  
          <h3>{emp_info.emp_name}</h3>

          <DeleteImgModal 
            show={this.state.delModalShow}
            onHide={this.onModalHide}
            img_id={this.state.img_id}
          />
          <UpdateImgModal
            show={this.state.updateModalShow}
            onHide={this.onModalHide}
            dept_id={emp_info.department_id._id}
            emp_email={emp_info.emp_email}
            comp_id={emp_info.department_id.company_id._id}
            emp_id={emp_info._id}
          />

          <div className="img-block">
            { this.state.img !== null ?
              <div>
                <ul className='img-del-edit-btn'>
                  <li className='img-btn' title='delete'>
                    <button 
                      className="img-del-btn delete-btn"
                      onClick={this.delClicked}
                    >
                      <ion-icon name="trash-outline"></ion-icon>
                    </button>                    
                  </li>

                  <li className='img-btn' title='edit'>
                    <button 
                      className="img-edit-btn edit-btn"
                      onClick={this.updateClicked}
                    >
                      <ion-icon name="pencil-outline"></ion-icon>
                    </button>
                  </li>
                </ul>
                <img 
                  className='img-src' 
                  src={`data:image/jpg;base64,${this.state.img}`} 
                  alt={this.state.img_name}
                />
              </div>
              : 
              <div>
                <p style={{color: 'red'}}>No image</p>
                <button 
                  className='img-del-edit-btn add-img-btn' 
                  title='Add Image?'
                  onClick={this.updateClicked}
                >
                  <ion-icon name="add-outline"></ion-icon>
                </button><br/>
              </div>
            }
          </div>

          <div>
            <p>{emp_info.emp_name} is an employee at {emp_info.department_id.company_id.company_name}.</p>
            <p>They work under the {emp_info.department_id.department_name} department.</p>
            { emp_info.termination_date === null ?
              <p>They have been with the company since {Date(emp_info.start_date.substring(0, 10)).slice(4, 13)}.</p>
              //<p>They have been with the company since {start_date_}.</p>
              : 
              <p>They have worked with the company from 
                {Date(emp_info.start_date.substring(0, 10)).slice(4, 13)} to 
                {Date(emp_info.termination_date.substring(0, 10)).slice(4, 13)}
              </p>
            }
            
            <p>The company thanks them for their service of {yearsInComp.getUTCFullYear() - 1970} years.</p>  
          </div>

          <div>
            <ul>
              <li>Employee Email: {emp_info.emp_email}</li>
              <li>Employee Contact Number: {emp_info.emp_contact_no}</li>
              <li>Employee Address: {emp_info.emp_address}</li>
              <li>Interview Date: {emp_info.interview_date.substring(0, 10)}</li>
              <li>Hire Date: {emp_info.hire_date.substring(0, 10)}</li>
              <li>Start Date: {emp_info.start_date.substring(0, 10)}</li>
              {emp_info.termination_date !== null ? 
                <li>Termination Date: {emp_info.termination_date.substring(0, 10)}</li> : null
              }
            </ul>
          </div>
        </div>
      )
    }
  }
}
 */