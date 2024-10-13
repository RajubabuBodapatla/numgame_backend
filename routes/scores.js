const express = require('express');
const fs = require('fs');
const router = express.Router();

const usersFilePath = '../data/users.json';

// Helper function to read users from JSON file
const getUsers = () => {
  const data = fs.readFileSync(usersFilePath, 'utf-8');
  return JSON.parse(data);
};

// Helper function to write users to JSON file
const writeUsers = (users) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
};

// 1. Update user score
router.patch('/users/:userId', (req, res) => {
  const userId = req.params.userId;
  const { score, highestScore } = req.body;

  const users = getUsersFromFile();
  const userIndex = users.findIndex(u => u.id === parseInt(userId));

  if (userIndex !== -1) {
    users[userIndex].score = score;
    users[userIndex].highestScore = highestScore;

    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

    res.json({ message: 'User score updated successfully', user: users[userIndex] });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// 2. Get high scores
router.get('/high-scores', (req, res) => {
  const users = getUsers();

  // Sort users by highest score and return the top 5
  const topUsers = users.sort((a, b) => b.highestScore - a.highestScore).slice(0, 5);
  
  res.status(200).json({ topUsers });
});

module.exports = router;
