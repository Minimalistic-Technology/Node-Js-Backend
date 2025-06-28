import express from 'express';
import {
  createSetting,
  getSettings,
  getSettingByExam,
  updateSetting,
  deleteSetting
} from '../controllers/examSettingController';


const router = express.Router();

router.post('/exam-settings', createSetting);
router.get('/exam-settings', getSettings);
router.get('/exam-settings/:examId', getSettingByExam);
router.put('/exam-settings/:examId', updateSetting);
router.delete('/exam-settings/:examId', deleteSetting);

export default router;