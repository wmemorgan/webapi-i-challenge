// Load Express module
const express = require('express')

// Import data and database CRUD functions
const db = require('./data/db')
const { find, findById, insert, update, remove } = db

// Initialize Express server
server = express()
port = 5000

// Load JSON parsing middleware
server.use(express())

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
    res.status(500).json(err)
  })
})

server.get('/api/users/:id', (req, res) => {
  const { id } = req.params
  console.log(`Requesting id: ${id}`)
  findById(id)
  .then(user => {
    res.send(user)
  })
  .catch(err => {
    res.status(500).json(err)
  })
})

// Create - create new user

// Destroy - delete existing user

// Update - update/change existing data


server.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
