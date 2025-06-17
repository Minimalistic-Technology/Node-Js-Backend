import express from 'express';

import {
  addTopSectors,
  getTopSectors,
  updateTopSectors,
  deleteTopSectors
} from '../../controllers/stocks/topSectorsController';

router.post('/addtopsectors', addTopSectors);
router.get('/gettopsectors', getTopSectors);
router.put('/updatetopsectors/:id', updateTopSectors);
router.delete('/deletetopsectors/:id', deleteTopSectors);

export default router;