import React,{useState, useEffect, Component} from 'react';
import axios from 'axios';
import './styles.css';
import { CameraFeed } from './components/camera-feed';

class App extends Component {
  
    state = {
 
      // Initially, no file is selected
      selectedFile: null,
      prediction:null,
      photoBlob:null,
      imageSource:null
    };
    
    // On file select (from the pop up)
    onFileChange = event => {
      // Update the state
      this.setState({ selectedFile: event.target.files[0] });
    
    };
    ///
    uploadImage = async file => {
      const formData = new FormData();
      formData.append('myFile', file);
      this.setState({ photoBlob: file });
      // Connect to a seaweedfs instance
      axios({
        method: 'post',
        url: 'https://flask-app-aniket.herokuapp.com/uploadd',
        data: formData,
        config: { headers: { 'Content-Type': 'multipart/form-data' } }
      }).then(
        response => {console.log(response);
          this.setState({ prediction: response.data.class });
          this.setState({ imageSource: 'Canvas'});}
          ).catch(
          errors => console.log(errors))
  
    };
    ///
    // On file upload (click the upload button)
    onFileUpload = () => {
    
      // Create an object of formData
      const formData = new FormData();
    
      // Update the formData object
      formData.append(
        "myFile",
        this.state.selectedFile,
        this.state.selectedFile.name
      );

    

      axios({
        method: 'post',
        url: 'https://flask-app-aniket.herokuapp.com/upload',
        data: formData,
        config: { headers: { 'Content-Type': 'multipart/form-data' } }
      }).then(
        response => {console.log(response);
          this.setState({ prediction: response.data.class });
          this.setState({ imageSource: 'FileUpload'});}
          ).catch(
          errors => console.log(errors))
    
      // Details of the uploaded file
      console.log(this.state.selectedFile);
    
      // Request made to the backend api
      // Send formData object
      //axios.post("api/uploadfile", formData);
      //axios.post("/members")
      //  .then(res => {
      //    console.log(res);
      //  })
    };
    
    // File content to be displayed after
    // file upload is complete
    fileData = () => {
    
      if (this.state.imageSource == 'Canvas') {
         
        return (
          <div>
            <h2>Image Preview :</h2>
            <img alt="not fount" width={"300px"} src={URL.createObjectURL(this.state.photoBlob)} />
 
          </div>
        );
      } else if (this.state.imageSource == 'FileUpload') {
         
        return (
          <div>
            <h2>Image Preview :</h2>
            <img alt="not fount" width={"300px"} src={URL.createObjectURL(this.state.selectedFile)} />
 
          </div>
        );
      } else {
        return (
          <div>
            <br />
            <h4>No Image!!</h4>
          </div>
        );
      }
    };

    predData = () => {
    
      if (this.state.prediction) {
         
        return (
          <div>
 
            <h2><b>{this.state.prediction}</b></h2>
            
          </div>
        );
      } else {
        return (
          <div>
            <br />
            <h4>Nothing</h4>
          </div>
        );
      }
    };
    
    render() {
    
      return (
        <div class = "App">
            <h1>
              Image Predictor
            </h1>

            <div>
                <input type="file" onChange={this.onFileChange} />
                <button onClick={this.onFileUpload}>
                  Upload & Predict
                </button>
                <CameraFeed sendFile={this.uploadImage} />
            </div>
          {this.fileData()}
          {this.predData()}
        </div>
      );
    }
  }


export default App;
