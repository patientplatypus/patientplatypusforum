import React, {Component} from 'react'
import axios from 'axios'

class NewsPaper extends Component{

  state = {
    posts: []
  }

  componentDidMount(){
    let url = 'http://localhost:5000/newspaper/getHeadlines'
    axios.get(url)
    .then(response=>{
      console.log('headlines for newspaper: ', response.data.posts)
      this.setState({posts: response.data.posts})
    })
    .catch(error=>{
      console.log('there was an error: ', error);
    })
  }

  render(){
    return(
      <div className="newspaperBorder" style={{minHeight: '10vh', width: 'calc(90% - 20px)', marginLeft: '0px', background: 'url("/static/newspapertile.jpg")', backgroundRepeat: 'repeat', position: 'relative'}}>
        <div style={{width: '100%', background: 'url("/static/newspaperclose.jpg")', opacity: '0.7'}}>
          {this.state.posts.map((post, index)=>{
              return(
                <div key={index} style={{margin: '5px', border: 'black 2px solid', padding: '2px', wordBreak: 'break-all'}}>
                  <div style={{fontWeight: 'bold', wordBreak: 'break-all'}}>
                    {post.headline}
                  </div>
                  <div style={{fontStyle: 'italic', wordBreak: 'break-all'}}>
                    <a href=''>{post.url}</a>
                  </div>
                </div>
              )
          })}
        </div>
        <div style={{position: 'absolute', top: 0, left: 0, height: '100%', width: '100%', zIndex: '2'}}>
          {this.state.posts.map((post, index)=>{
            return(
              <div key={index} style={{margin: '5px', border: 'black 2px solid', padding: '2px', background: 'rgba(100, 124, 117, 0.85)', wordBreak: 'break-all'}}>
                <div style={{fontWeight: 'bold', wordBreak: 'break-all'}}>
                  {post.headline}
                </div>
                <div style={{fontStyle: 'italic', wordBreak: 'break-all'}}>
                  <a href={post.url }>{post.url}</a>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

export default NewsPaper