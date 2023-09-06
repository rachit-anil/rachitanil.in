import { useState } from 'react'
import axios from 'axios'

import './App.css'

async function postImage({image, vin}) {
  const formData = new FormData();
  formData.append("image", image)
  formData.append("VIN", vin)

  // http://13.233.167.111:8080  - EC2 
  const result = await axios.post('http://13.233.167.111:8080/images', formData, { headers: {'Content-Type': 'multipart/form-data'}})
 
  

  return result.data
}


function App() {
  const [file, setFile] = useState()
  const [vin, setVin] = useState("")
  const [images, setImages] = useState([])

  const submit = async event => {
    event.preventDefault()
    const result = await postImage({image: file, vin})
    setImages([result.image, ...images])
  }

  const fileSelected = event => {
    const file = event.target.files[0]
		setFile(file)
	}

  return (
    <div className="App">
      <form onSubmit={submit}>
        <input onChange={fileSelected} type="file" accept="image/*"></input>
        <input value={vin} onChange={e => setVin(e.target.value)} type="text"></input>
        <button type="submit">Submit</button>
      </form>

      { images.map( image => (
        <div key={image}>
          <img src={image}></img>
        </div>
      ))}

      <img src="/images/9fa06d3c5da7aec7f932beb5b3e60f1d"></img>

    </div>
  );
}

export default App;