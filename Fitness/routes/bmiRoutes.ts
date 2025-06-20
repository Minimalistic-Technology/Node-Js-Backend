import express from 'express';
import {
  generateBmiPlan,
  getAllBmiPlans,
  updateBmiPlanById,
  deleteBmiPlanById,
  getBmiFoodPlanById,
} from '../controllers/bmiController';

const router = express.Router();

router.post('/bmi', generateBmiPlan);        
router.get('/bmi', getAllBmiPlans);  
router.get('/bmi/:id/plan', getBmiFoodPlanById);        
router.put('/bmi/:id', updateBmiPlanById);    
router.delete('/bmi/:id', deleteBmiPlanById); 

export default router;