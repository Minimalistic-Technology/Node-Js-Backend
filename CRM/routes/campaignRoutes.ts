import express from 'express';
import {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
} from '../controllers/campaignController';

const router = express.Router();

router.post('/Campaign', createCampaign);
router.get('/Campaign', getCampaigns);
router.get('/Campaign/:id', getCampaignById);
router.put('/Campaign/:id', updateCampaign);
router.delete('/Campaign/:id', deleteCampaign);

export default router;
