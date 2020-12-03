import React, { Component } from 'react';
import axios from 'axios';

export default class EnterImage extends Component {
  constructor () {
    super();
    this.state = {
      emp_email: '',
      comp_id: '',
      dept_id: '',
      emp_name: '',
      emp_id: '',

      imgExists: false,

      selectedFile: null,
      filename: '',

      inUpdate: false,
      updated: false,
      sent: false,
      invalidSubmit: false,

      errMsg: ''
    }
  }

  componentDidMount() {
    const propState = this.props.history === undefined ? null :this.props.history.location.state;
    
    //const propState =  null;
    // get employee by query string
    //console.log('employee/?emp_email=' + this.props.emp_email + '&department_id=' + this.props.dept_id)
    
    propState !== null ? 
      // in post
      axios.get(process.env.REACT_APP_DATABASE_PATH + 'employee/?emp_email=' + propState.emp_email + '&department_id=' + propState.dept_id)
        .then(res => {    
          this.setState({
            emp_id: res.data.emp._id,
            emp_name: res.data.emp.emp_name,
            imgExists: res.data.imgExists,
            emp_email: propState.emp_email,
            comp_id: propState.comp_id,
            dept_id: propState.dept_id,
            inUpdate: false,
            errMsg: ''
          })
        })
        .catch(error => {
          console.log('error:', error.response.data.msg)
          this.setState({errMsg: error.response.data.msg})
        })
    // in update
    : axios.get(process.env.REACT_APP_DATABASE_PATH + 'employee/emp-id/' + this.props.emp_id)
      .then(res => {
        this.setState({
          emp_id: res.data.emp._id,
          emp_name: res.data.emp.emp_name,
          imgExists: res.data.imgExists,
          emp_email: this.props.emp_email,
          comp_id: this.props.comp_id,
          dept_id: this.props.dept_id,
          inUpdate: true,
          errMsg: ''
        })
      })
      .catch(error => {
        console.log('error:', error.response.data.msg)
        this.setState({errMsg: error.response.data.msg})
      })
  }

  handleChange = (event) => {
    const {files} = event.target;
    
    this.setState({
      selectedFile: files[0],
      filename: files[0].name
    })
  }

  submitImg = (event) => {
    event.preventDefault();
    if (this.state.selectedFile === null) {
      this.setState({
        invalidSubmit: true
      })
    } else {
      var formData = new FormData();
      //formData.append('image',this.state.selectedFile);
      // img_name = req.file.fieldname
      // employee_id = req.file.originalname
      formData.append('image', this.state.selectedFile, this.state.emp_id);
      const config = {
        headers: {
          'content-type': 'multipart/form-data'
        }
      };
      
      axios.post("http://localhost:5000/image",formData,config)
        .then((response) => {
          console.log("The file is successfully uploaded");
          this.setState({
            sent: true, 
            errMsg: '',
            invalidSubmit: false
          })
        }).catch((error) => {
          console.log('Error:', error.response.data.msg)
          this.setState({errMsg: error.response.data.msg})
        });
    }
  }

  skipImg = () => {
    //const withMsg = {msg: 'Skipped Image!', dept_id: this.state.dept_id}
    this.props.history.push('/employees')
  }

  /**
   * THIS IS STILL SUPER UNSTABLE
   * @param {} event 
   */
  updateImg = (event) => {
    event.preventDefault();
    if (this.state.selectedFile === null) {
      this.setState({
        invalidSubmit: true
      })
    } else {
      var formData = new FormData();
      formData.append('image', this.state.selectedFile, this.state.emp_id);
      const config = {
        headers: {
          'content-type': 'multipart/form-data'
        }
      };

      if (this.state.imgExists) {
        axios.post(process.env.REACT_APP_DATABASE_PATH + 'image/update/' + this.state.emp_id, formData, config)
          .then(res => {
            console.log(res.data)
            this.setState({updated: true, invalidSubmit: false, errMsg: ''})
          })
          .catch (error => {
            console.log(error.response.data.msg)
            this.setState({errMsg: error.response.data.msg})
          })
      } else {      
        // if image doesn't exist for employee, add the image onto the database
        axios.post("http://localhost:5000/image",formData,config)
          .then((response) => {
            console.log("The file is successfully uploaded");
            this.setState({updated: true, imgExists: true, invalidSubmit: false, errMsg: ''})
          }).catch((error) => {
            console.log('Error:', error.response.data.msg)
            this.setState({errMsg: error.response.data.msg})
          });
      }
    }
    
  }

  render() {
    /* console.log(this.state.comp_id);
    console.log(this.state.dept_id); */
    //console.log('emp id=' + this.state.emp_name)
    if (this.state.inUpdate || this.props.history === undefined) {
      return (
        <div>
          <p>Update Profile Picture: </p>
          <form onSubmit={this.updateImg}>
          <label htmlFor="img-update-upload" className="img-upload-style" title='Click to Upload'>
            <p className='up-txt'><ion-icon class='img-icon' name="image-outline"></ion-icon>Upload Image</p>
          </label>
          {this.state.filename !== '' ? <p>{this.state.filename}</p> : null}
          <input
            id='img-update-upload'
            type='file'
            name='image'
            encType="multipart/form-data"
            onChange={this.handleChange}
          /><br />
          {this.state.invalidSubmit ? <p style={{color: 'red'}}>Please Select a Valid Image</p> : null}
          {this.state.errMsg !== '' ? <p style={{color: 'red'}}>{this.state.errMsg}</p> : null}
          {this.state.updated ? <h6 style={{color: 'blue'}}>Image Updated Successfully!</h6> : null}
          <button className="submit-btn">Update Image</button>
        </form>
        </div>
      )
    }
    return (
      <div>
        <h1>Hi {this.state.emp_name}! Do you want to add a profile picture?</h1>
        
        <form onSubmit={this.submitImg}>
          <label htmlFor="img-post-upload" className="img-upload-style" title='Click to Upload'>
            <p className='up-txt'><ion-icon class='img-icon' name="image-outline"></ion-icon>Upload Image</p>
          </label>
          {this.state.filename !== '' ? <p>{this.state.filename}</p> : null}
          <input 
            id='img-post-upload'
            type='file'
            name='image'
            encType="multipart/form-data"
            onChange={this.handleChange}
          /><br />

          <button className="submit-btn">Submit Image</button>
        </form>
        
        {this.state.invalidSubmit ? <p style={{color: 'red'}}>Please Select a Valid Image</p> : null}
        {this.state.errMsg !== '' ? <p style={{color: 'red'}}>{this.state.errMsg}</p> : null}
        
        {this.state.sent ? <h6>Image Uploaded Successfully!</h6> : null}
        <button onClick={this.skipImg}>{this.state.sent ? '< Return to Employees List' : 'Skip'}</button>
      </div>
    )
  }
}
