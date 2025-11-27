import express from 'express';
import { CodeEditorController } from './codeEditor.controller.js';

const router = express.Router();

router.post('/open-folder', CodeEditorController.openFolder);

export const codeEditorRoutes = router;
