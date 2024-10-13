const express = require('express');
const fs = require('fs');
const router = express.Router();

const usersFilePath = '../backend/data/users.json';

// Helper function to read users from JSON file
const getUsers = () => {
  const data = fs.readFileSync(usersFilePath, 'utf-8');
  return JSON.parse(data);
};

// Helper function to write users to JSON file
const writeUsers = (users) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
};

// 1. Register user
router.post('/register', (req, res) => {
  const { id, username, password, email } = req.body;
  const users = getUsers();

  // Check if username or email already exists
  const userExists = users.some((user) => user.username === username || user.email === email);
  if (userExists) {
    return res.status(400).json({ message: 'Username or email already exists' });
  }

  // Add new user
  const newUser = { id, username, password, email, score: 0, highestScore: 0 };
  users.push(newUser);
  writeUsers(users);

  res.status(201).json({ message: 'User registered successfully' });
});

// 2. Login user
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = getUsers();

  const user = users.find((user) => user.username === username && user.password === password);
  if (!user) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }

  res.status(200).json({ user });
});



router.get('/users', (req, res) => {
 

  fs.readFile(usersFilePath, 'utf8', (err, data) => {
      if (err) {
          console.error('Error reading users file:', err);
          return res.status(500).json({ message: 'Internal Server Error' });
      }

      try {
          const users = JSON.parse(data);
          res.json(users);
      } catch (parseError) {
          console.error('Error parsing users data:', parseError);
          res.status(500).json({ message: 'Error parsing user data' });
      }
  });
});


router.patch(`/users/:id`, (req, res) => {
  const userId = req.params.id;
  const { score } = req.body;  // Assume you want to update the score field
  
  fs.readFile(usersFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading users data.' });
    }
    
    const users = JSON.parse(data);
    const userIndex = users.findIndex(u => u.id === userId);  // Find user by ID
    
    if (userIndex !== -1) {
      // Update the user's score if found
      users[userIndex].score = score;

      if (score > users[userIndex].highestScore) {
        users[userIndex].highestScore = score;
      }


      // Save the updated users array back to the users.json file
      fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
        if (err) {
          return res.status(500).json({ message: 'Error saving user data.' });
        }
        res.json({ message: 'User score updated successfully', user: users[userIndex] });
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  });
});



module.exports = router;
