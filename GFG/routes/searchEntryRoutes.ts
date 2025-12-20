import express from 'express';
import {
  createSearchEntry,
  getAllSearchEntries,
  getSearchEntryById,
  updateSearchEntry,
  deleteSearchEntry,
  search
} from '../controllers/searchController';

const router = express.Router();

router.post('/create', createSearchEntry);
router.get('/', getAllSearchEntries);
router.get('/find', search);
router.get('/:id', getSearchEntryById);
router.put('/update/:id', updateSearchEntry);
router.delete('/delete/:id', deleteSearchEntry);

export default router;
