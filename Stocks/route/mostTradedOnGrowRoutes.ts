
import express from 'express';
const { Router } = require('express');

import {
  addMostTradedOnGrow,
  getAllMostTradedOnGrow,
  getMostTradedOnGrowById,
  updateMostTradedOnGrow,
  deleteMostTradedOnGrow,
} from '../../controllers/stocks/mostTradedOnGrowController';


Router.post('/mosttradedongrow', addMostTradedOnGrow);
Router.get('/mosttradedongrow', getAllMostTradedOnGrow);
Router.get('/mosttradedongrow/:id', getMostTradedOnGrowById);
Router.put('/mosttradedongrow/:id', updateMostTradedOnGrow);
Router.delete('/mosttradedongrow/:id', deleteMostTradedOnGrow);

export default Router;