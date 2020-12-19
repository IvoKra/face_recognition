import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Rank from './components/Rank/Rank';
import './App.css';
import Particles from "react-tsparticles";
import particlesOptions from "./particles.json";
import Clarifai from "clarifai";

const app = new Clarifai.App({
  apiKey: 'a3b31a7f2e7d4b8fad439abd5e5acede'
 });

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageURL: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

    onButtonSubmit = () => {
      this.setState({imageURL: this.state.input});
      app.models
      .initModel({
        id: Clarifai.FACE_DETECT_MODEL,
      })
      .then((faceDetectModel) => {
        return faceDetectModel.predict(this.state.input)})
      .then((response) => {
        return this.displayFaceBox(this.calculateFaceLocation(response))
      });
    }

    onRouteChange = (route) => {
      if (route === 'signout') {
        this.setState({isSignedIn: false})
      } else if (route === 'home') {
        this.setState({isSignedIn: true})
      }
      this.setState({route: route});
} 

  render() {
    const { isSignedIn, imageURL, route, box } = this.state;
  return (
    <div className="App">
       <Particles className='particles' options={particlesOptions}/>
      <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
      { route === 'home'
      ? <div> 
        <Logo />
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
        <FaceRecognition box={box} imageURL={imageURL}/>
        </div> 
      : (
        route=== 'signin'
        ? <Signin onRouteChange={this.onRouteChange}/>
        : <Register onRouteChange={this.onRouteChange}/>
      )
      }
      </div>
  );
  }
}
export default App;
