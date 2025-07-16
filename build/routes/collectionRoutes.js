"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const collectionController_1 = __importDefault(require("../controllers/collectionController"));
const router = express_1.default.Router();
router.get('/get', collectionController_1.default.getCollections);
router.post('/add', collectionController_1.default.postCollection);
router.put('/update/:id', collectionController_1.default.putCollection);
router.delete('/delete/:id', collectionController_1.default.deleteCollection);
exports.default = router;
