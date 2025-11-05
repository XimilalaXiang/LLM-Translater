import { Router } from 'express';
import { translationService } from '../services/translationService';
import type { ApiResponse, TranslationRequest } from '../types';

const router = Router();

// Start translation
router.post('/', async (req, res) => {
  try {
    const request: TranslationRequest = req.body;

    if (!request.sourceText || request.sourceText.trim().length === 0) {
      const response: ApiResponse = {
        success: false,
        error: 'Source text is required'
      };
      return res.status(400).json(response);
    }

    const result = await translationService.translate(request);

    const response: ApiResponse = {
      success: true,
      data: result
    };
    res.json(response);
  } catch (error) {
    console.error('Translation error:', error);
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    res.status(500).json(response);
  }
});

// Get translation history
router.get('/history', (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    const history = translationService.getHistory(limit);

    const response: ApiResponse = {
      success: true,
      data: history
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    res.status(500).json(response);
  }
});

// Get translation by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const translation = translationService.getTranslationById(id);

    if (!translation) {
      const response: ApiResponse = {
        success: false,
        error: 'Translation not found'
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse = {
      success: true,
      data: translation
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    res.status(500).json(response);
  }
});

export default router;
