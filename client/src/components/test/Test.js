import React, { Component } from 'react';
import axios from 'axios';

export default class Test extends Component {
  state = {
    img: '',
    employee_id: '',
    img_name: '',

    selectedFile: null,
    imgUploaded: false,
    showImg: false
  }

  componentDidMount() {
    /* axios.get(process.env.REACT_APP_DATABASE_PATH + 'image')
      .then (res => this.setState({
        img: this.arrayBufferToBase64(res.data.img[0].image.data.data)}))
        //console.log(res.data.img)) */

    axios.get(process.env.REACT_APP_DATABASE_PATH + 'image/5fc05ad8193b1838646e421d')
        .then(res => this.setState({
          img: this.arrayBufferToBase64(res.data.image.data.data),
          employee_id: res.data.employee_id,
          img_name: res.data.img_name
        }))
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.imgUploaded) {
      axios.get(process.env.REACT_APP_DATABASE_PATH + 'image/' + this.state.employee_id)
        .then(res => this.setState({
          img: this.arrayBufferToBase64(res.data.image.data.data),
          employee_id: res.data.employee_id,
          img_name: res.data.img_name
        }))
      this.setState({
        imgUploaded: false,
        showImg: true
      })
    }
  }

  arrayBufferToBase64 = (buffer) => {
    var binary = '';
    var bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => binary += String.fromCharCode(b));
    return window.btoa(binary);
    /* const blob = new Blob( [ buffer ] );
    const url = URL.createObjectURL(blob);
    console.log('bl: ', url)
    return url;  */
  }

  handleChange = (event) => {
    const {name, value, type, files} = event.target;
    if (type !== 'file') {
      this.setState({
        [name]: value
      })
    } else {
      console.log('in file')
      this.setState({
        selectedFile: files[0]
      })
    }
  }

  submitImg = (event) => {
    event.preventDefault();
    var formData = new FormData();
    //formData.append('image',this.state.selectedFile);
    // img_name = req.file.fieldname
    // employee_id = req.file.originalname
    formData.append('image', this.state.selectedFile, this.state.employee_id);
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };
    
    axios.post("http://localhost:5000/image",formData,config)
      .then((response) => {
        console.log("The file is successfully uploaded");
      }).catch((error) => console.log('Error:', error));
  }

  render () {
    
    return (
      <div className="img-block">
        <h1>Test!</h1>
        <div>
          <form onSubmit={this.submitImg}>
            <input 
              type='text'
              name='employee_id'
              value={this.state.employee_id}
              onChange={this.handleChange}
              placeholder='Employee ID'
              required
            />
            <input 
              type='text'
              name='img_name'
              value={this.state.img_name}
              onChange={this.handleChange}
              placeholder='Image Name'
            />
            <input 
              type='file'
              name='image'
              encType="multipart/form-data"
              onChange={this.handleChange}
            />

            <button className="submit-btn">Submit Image</button>
          </form>
        </div>

        <div>
          { this.state.showImg ?
            <img src={`data:image/jpg;base64,${this.state.img}`} alt={this.state.img_name}/>
            : null
          }
          <img src={`data:image/jpg;base64,${this.state.img}`} alt={this.state.img_name}/>
        </div>
      </div>
    )
  }

  /* componentDidMount() {
    axios.get('http://localhost:5000/company/all-company')
      .then (res => this.setState({companies: res.data, comp_id: res.data[0]._id}))
      .catch(err=> console.log(err.response.data.msg))
  }

  componentDidUpdate(prevState) {
    if (prevState.count === this.state.count || this.state.count < this.state.companies.length) {      
      axios.get('http://localhost:5000/department/company/' + this.state.comp_id)
        .then(res => {
          this.setState({            
            comp_id: this.state.companies[this.state.count]._id,
            final: [...this.state.final, res.data.elems],
            count: this.state.count < this.state.companies.length ? this.state.count + 1 : this.state.companies.length +10
          })
        })
        .catch(err=> console.log(err.response.data.msg))
    }
    if (this.state.count === this.state.companies.length) {
      axios.get('http://localhost:5000/department/company/' + this.state.comp_id)
        .then(res => {
          this.setState({
            final: [...this.state.final, res.data.elems],
            count: this.state.count + 100
          })
        })
        .catch(err=> console.log(err.response.data.msg))
    }
  }
  
  render() {
    //console.log(this.state.final)
    const a = this.state.final.map(data => {
      return data.map(res => (
        <tr key={res._id}>
          <td>{res.company_id.company_name}</td>
          <td>{res.department_name}</td>
        </tr>
      ))
    })
    //console.log(a)
    return (
      <div>
        <h1>Test</h1>
        <div>
          <table>
            <tbody>
              <tr>
                <th>Company</th>
                <th>Department</th>
              </tr>
              {a}
            </tbody>
          </table>
        </div>
      </div>
    )
  } */
}
