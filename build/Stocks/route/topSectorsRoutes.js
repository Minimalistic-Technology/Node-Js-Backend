"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const topSectorsController_1 = require("../../controllers/stocks/topSectorsController");
router.post('/addtopsectors', topSectorsController_1.addTopSectors);
router.get('/gettopsectors', topSectorsController_1.getTopSectors);
router.put('/updatetopsectors/:id', topSectorsController_1.updateTopSectors);
router.delete('/deletetopsectors/:id', topSectorsController_1.deleteTopSectors);
exports.default = router;
