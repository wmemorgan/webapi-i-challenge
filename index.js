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
    .catch(() => {
      res.status(500).json({error: `There was an error while saving the user to the database.`})
    })   
  }
})

// Destroy - delete existing user
server.delete(`/api/users/:id`, (req, res) => {
  const { id } = req.params
  console.log(`delete request received for user ${id}`)

  // Solution #1
  findById(id)
  .then(user => {
    if(user) {
      remove(user.id)
      .then(response => {
        console.log(response)
        if (response === 1) {
          res.json({ message: `User ${user.id} removed from the database` })
        } else {
          throw err
        }
      })
      .catch(() => res.status(500).json({error: `The user information could not be retrieved`}))
    } else {
      res.status(404).json({error: `User ${id} does not exist`})
    }
  })
  .catch(() => res.status(500).json({error: `The user could not be removed`}))

  // Solution #2
  // findById(id)
  // .then(user => {
  //   if(!user) {
  //     res.status(404).json({ error: `User ${id} does not exist` })
  //   } else {
  //     remove(user.id)
  //     .then(() => res.json({message: `User ${id} removed`}))
  //   }
  // })
  // .catch(() => res.status(500).json({error: `The user could not be removed`}))

})

// Update - update/change existing data
server.put(`/api/users/:id`, (req, res) => {

  // Solution #3
  const { id } = req.params
  const { name, bio } = req.body
  if (!name || !bio) {
    res.status(400).json({errorMessage: `Please provide name and bio for the user`})
    return null
  } else {
    findById(id)
    .then(foundUser => {
      if(!foundUser) {
        res.status(404).json({ error: `User ${id} does not exist` })
      } else {
        update(id, req.body)
        .then(count => {
          if (!count) {
            console.log(`Issue with update`)
          } else {
            findById(id)
            .then(updatedUser => res.status(200).json(updatedUser))
          }
        })
      }
    })
    .catch(() => res.status(500).json({error: `The user information could not be modified`}))
  }
  
  // Solution #2
//   const { id } = req.params
//   const { name, bio } = req.body
//   if (!name || !bio) {
//     res.status(400).json({errorMessage: `Please provide name and bio for the user`})
//     return null
//   } 
//   else {
//     findById(id)
//     .then(user => {
//       if (!user) {
//         throw err
//       } else {
//         update(user.id, dsfdsafds)
//         .then(count => {
//           if (!count) {
//             console.log(`record not updated count: ${count}`)
//             res.status(500).json({ error: `The user information could not be modified` })
//           } else {
//             findById(user.id)
//             .then(updatedUser => res.status(200).json(updatedUser))
//           }
//         })
//        }
//     }).catch(() => res.status(404).json({ error: `User ${id} does not exist` }))
// }

  // //Solution #1
  // const { name, bio } = req.body
  //  // Check edge case
  // if (!name || !bio) {
  //   res.status(400).json({ errorMessage: `Please provide name and bio for the user.` })
  //   return null
  // }
  
  // const { id } = req.params
  // findById(id)
  // .then(user => {
  //   // Check edge case
  //   if (!user) { 
  //     throw err
  //   } else {
  //     update(id, dsfsdfds)
  //       .then(count => {
  //         if (count!==1) {
  //           throw err
  //         } else {
  //           findById(user.id)
  //           .then(updatedUser => {
  //             res.status(200).json(updatedUser)
  //           })
  //         }
  //       })
  //       .catch(() => res.status(500).json({
  //         error: `The user information could not be modified`
  //       })
  //     )
  //   }
  // })
  // .catch(() => res.status(404).json({ error: `User ${id} does not exist` }))

})

server.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
