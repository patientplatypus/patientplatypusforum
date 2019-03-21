
const express = require('express')
const next = require('next')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()


const path = require('path');
const options = {
  root: path.join(__dirname, '/static'),
  headers: {
    'Content-Type': 'text/plain;charset=UTF-8',
  }
};


app.prepare().then(() => {
  const server = express()

  // server.get('/BingSiteAuth.xml', (req,res)=>{
  //   return res.status(200).sendFile('BingSiteAuth.xml', options)
  // });

  // server.get('/google06bb1d57a6e1869a.html', (req,res)=>{
  //   return res.status(200).sendFile('google06bb1d57a6e1869a.html', options)
  // });

  server.get('/robots.txt', (req, res) => {
    return res.status(200).sendFile('robots.txt', options)
  });
 
  server.get('/sitemap.xml', (req,res) => {
    return res.status(200).sendFile('sitemap.xml', options)
  });

  // server.get('/', (req, res) => {
  //   return app.render(req, res, '/', req.query)
  // })
  server.get('/feed', (req, res) => {
    return app.render(req, res, '/feed', req.query)
  })


  server.get("/forum/sfw/:navPage", (req, res) => {
    return app.render(req, res, "/forum/sfw", { navPage: req.params.navPage })
  })

  server.get("/forum/nsfw/:navPage", (req, res) => {
    return app.render(req, res, "/forum/nsfw", { navPage: req.params.navPage })
  })

  server.get('/FAQ', (req, res) => {
    return app.render(req, res, '/FAQ', req.query)
  })

  server.get('/blog/:navTitle', (req, res) => {
    return app.render(req, res, '/blog',  { navTitle: req.params.navTitle })
  })

  server.get('/admin', (req, res) => {
    return app.render(req, res, '/admin', req.query)
  })


  // server.get('/archive', (req, res) => {
  //   return app.render(req, res, '/archive', req.query)
  // })

  // server.get('/posts', (req, res) => {
  //   return app.render(req, res, '/posts', req.query)
  // })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
