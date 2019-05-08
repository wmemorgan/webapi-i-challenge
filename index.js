// Load Express module
const express = require('express')

// Import data and database CRUD functions
const db = require('./data/db')
const { find, findById, insert, update, remove } = db

// Initialize Express server
server = express()
port = 5000

// Load JSON parsing middleware
server.use(express.json())

// Base route to verify working server
server.get('/', (req, res) => {
  res.send(`<h2>Welcome to My Super Awesome Server!</h2>`)
})

// Define routes
// Read - get users
server.get('/api/users', (req, res) => {
  find()
  .then(users => {
    res.send(users)
  })
  .catch(err => {
    res.status(500).json({error: "The users information could not be retrieved."})
  })
})

server.get('/api/users/:id', (req, res) => {
  const { id } = req.params
  console.log(`Requesting id: ${id}`)
  findById(id)
  .then(user => {
    if(user) {
      res.send(user)
    } else {
      res.status(404).json({ message: `The user ID ${id} does not exist.`})
    }
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({error: `The user information could not be retrieved.`})
  })
})

// Create - create new user
server.post('/api/users', (req, res) => {
  const { name, bio } = req.body
  console.log(`Create user request: ${JSON.stringify(req.body)}`)
  if(!name || !bio) {
    res.status(400).json({errorMessage: `Please provide name and bio for the user.`})
  } else {
    insert(req.body)
    .then(newUser => {
      res.status(201).json(newUser)
    })
    .catch(err => {
      res.status(500).json(err)
    })   
  }
})

// Destroy - delete existing user

// Update - update/change existing data


server.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
