"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const topindexfuturecontroller_1 = require("../../controllers/topindexfuturecontroller");
const router = express_1.default.Router();
router.get('/topindex', topindexfuturecontroller_1.getTopStocks);
router.post('/topindex', topindexfuturecontroller_1.addTopStocks);
router.get('/topindex/:id', topindexfuturecontroller_1.getTopStockById);
router.put('/topindex/:id', topindexfuturecontroller_1.updateTopStock);
router.delete('/topindex/:id', topindexfuturecontroller_1.deleteTopStock);
exports.default = router;
