import './PictureDisplay.css';
import axios from 'axios';
import React, { Component } from 'react';

class PictureDisplay extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pictures: []
        }

    }

    fetchData = async () => {
    const pictures = await axios(`http://localhost:8000/world/photos/`)
        console.log(pictures)
        this.setState({
            pictures: pictures.data
        })
    }

    async componentDidMount() {
        this.fetchData()
    }
    render () {
        const pictures = this.state.pictures
        return (
            <div id='pictureDisplay'>
                {pictures.map(picture => {
                    return (
                        <div className='picture' >
                          <img src={picture.fields.picture_url}/>
                          {/* <p>{picture.fields.picture_location}</p>
                          <p><a href={picture.fields.picture_photographer_link}>{picture.fields.picture_photographer}</a> </p>
                          <p>Picture <a href={picture.fields.picture_source}>source</a> </p> */}
                        </div>)
                })}
            </div>
        )
    }
}

export default PictureDisplay;