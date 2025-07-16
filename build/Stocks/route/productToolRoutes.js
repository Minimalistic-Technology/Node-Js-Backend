"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const productToolController_1 = require("../../controllers/stocks/productToolController");
router.post('/tools', productToolController_1.addProductTool);
router.get('/tools', productToolController_1.getAllProductTools);
router.get('/tools/:id', productToolController_1.getProductToolById);
router.put('/tools/:id', productToolController_1.updateProductTool);
router.delete('/tools/:id', productToolController_1.deleteProductTool);
exports.default = router;
