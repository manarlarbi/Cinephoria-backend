const express=require('express');
const router=express.Router();
const employeController=require('../controllers/EmployeController');
const {verifyToken}=require('../middlewares/authMiddleware');
router.get('/',employeController.getEmployes);
router.post('/creerEmploye',employeController.creatNewEmploye);
router.delete('/:id',employeController.deleteNewEmploye);
module.exports=router;