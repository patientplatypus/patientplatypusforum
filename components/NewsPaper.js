import React, {Component} from 'react'
import axios from 'axios'
import Link from 'next/link'

class NewsPaper extends Component{

  state = {
    posts: []
  }

  componentDidMount(){
    let url = process.env.serverfrontADD+'newspaper/getHeadlines'
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
        <div style={{width: '100%', background: 'url("/static/newspaperclose.jpg")', opacity: '1', paddingTop:'1px'}}>
          <div className='communityNews' style={{margin: '5px', border: 'black 2px solid', padding: '2px', wordBreak: 'break-all', textAlign: 'center'}}>
            COMMUNITY NEWS
            <div>
              <a href={"http://localhost:80/newspaper"}>click here to contribute</a>
            </div>
          </div>
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
          <div className='communityNews' style={{margin: '5px', border: 'black 2px solid', padding: '2px', wordBreak: 'break-all', textAlign: 'center', background: 'rgba(100, 124, 117, 0.8)', color: 'rgb(230, 139, 4)'}}>
            COMMUNITY NEWS
            <div>
              <a href={"http://localhost:80/newspaper"} style={{color: 'black'}}>click here to contribute</a>
            </div>
          </div>
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