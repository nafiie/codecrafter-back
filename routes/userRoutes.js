const express = require('express')
const router = express.Router();
const {protect} = require('../middleware/authmiddleware')

//methods in our user cotroller
const {getAllUsers, createUsers, getUserByid, updateUserByid, deleteUserByid, loginUser} = require('../controllers/userController');



router.post('', createUsers);
router.post('/login', loginUser)

router.get('/', protect, getAllUsers);
router.get('/:id', protect, getUserByid);
router.put('/:id', protect, updateUserByid);
router.delete('/:id', protect, deleteUserByid);


module.exports = router

