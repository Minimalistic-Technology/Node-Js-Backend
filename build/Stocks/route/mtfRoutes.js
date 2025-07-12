"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mtfController_1 = require("../../controllers/stocks/mtfController");
router.post('/mtf', mtfController_1.addMTFStocks);
router.get('/mtf', mtfController_1.getAllMTFStocks);
router.get('/mtf/:id', mtfController_1.getMTFStockById);
router.put('/mtf/:id', mtfController_1.updateMTFStock);
router.delete('/mtf/:id', mtfController_1.deleteMTFStock);
exports.default = router;
