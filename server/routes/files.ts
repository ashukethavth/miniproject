import { Router, Request, Response } from 'express';
import multer from 'multer';
import { body, param, query, validationResult } from 'express-validator';
import { authMiddleware } from '../middleware/auth';
import { FileStorageService } from '../services/fileStorage';
import { supabaseAdmin } from '../config/supabase';

const router = Router();

// ✅ Custom Request type
interface AuthRequest extends Request {
  user?: any;
}

// ================= MULTER CONFIG =================
const upload = multer({
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) => {
    cb(null, true);
  },
});

// ================= VALIDATIONS =================
const uploadValidation = [
  body('masterKey').exists().isLength({ min: 32 }),
  body('folderId').optional().isUUID(),
];

const fileIdValidation = [param('fileId').isUUID()];

const listValidation = [
  query('folderId').optional().isUUID(),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('offset').optional().isInt({ min: 0 }),
];

// ================= APPLY AUTH =================
router.use(authMiddleware);

// ================= UPLOAD =================
router.post(
  '/upload',
  upload.single('file'),
  uploadValidation,
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'No file provided' });
      }

      const { masterKey, folderId } = req.body;
      const userId = req.user.id;

      const result = await FileStorageService.uploadFile(
        req.file.buffer,
        req.file.originalname,
        { userId, folderId, masterKey }
      );

      await supabaseAdmin.from('audit_logs').insert({
        user_id: userId,
        action: 'file.upload',
        resource_type: 'file',
        resource_id: result.fileId,
      });

      res.status(201).json({
        message: 'File uploaded successfully',
        file: {
          id: result.fileId,
          name: req.file.originalname,
          size: result.size,
          hash: result.hash,
        },
      });
    } catch (error) {
      res.status(500).json({ error: 'Upload failed' });
    }
  }
);

// ================= DOWNLOAD =================
router.get(
  '/:fileId/download',
  fileIdValidation,
  [query('masterKey').exists()],
  async (req: AuthRequest, res: Response) => {
    try {
      const { fileId } = req.params;
      const { masterKey } = req.query;

      const { data, metadata } = await FileStorageService.downloadFile(fileId, {
        userId: req.user.id,
        masterKey: masterKey as string,
      });

      res.setHeader('Content-Disposition', `attachment; filename="${metadata.name}"`);
      res.send(data);
    } catch {
      res.status(500).json({ error: 'Download failed' });
    }
  }
);

// ================= GET FILE =================
router.get('/:fileId', fileIdValidation, async (req: AuthRequest, res: Response) => {
  try {
    const metadata = await FileStorageService.getFileMetadata(
      req.params.fileId,
      req.user.id
    );

    res.json({ file: metadata });
  } catch {
    res.status(500).json({ error: 'Failed to fetch file' });
  }
});

// ================= LIST FILES =================
router.get('/', listValidation, async (req: AuthRequest, res: Response) => {
  try {
    const { folderId, limit = 50, offset = 0 } = req.query;

    const files = await FileStorageService.listFiles(
      folderId as string,
      req.user.id,
      Number(limit),
      Number(offset)
    );

    res.json({ files });
  } catch {
    res.status(500).json({ error: 'Failed to list files' });
  }
});

// ================= UPDATE FILE =================
router.put(
  '/:fileId',
  fileIdValidation,
  [body('name').optional(), body('folderId').optional()],
  async (req: AuthRequest, res: Response) => {
    try {
      const { fileId } = req.params;
      const { name, folderId } = req.body;

      const updateData: any = {};
      if (name) updateData.name = name;
      if (folderId) updateData.folder_id = folderId;

      const { data } = await supabaseAdmin
        .from('files')
        .update(updateData)
        .eq('id', fileId)
        .eq('owner_id', req.user.id)
        .select()
        .single();

      res.json({ file: data });
    } catch {
      res.status(500).json({ error: 'Update failed' });
    }
  }
);

// ================= DELETE FILE =================
router.delete('/:fileId', fileIdValidation, async (req: AuthRequest, res: Response) => {
  try {
    await FileStorageService.deleteFile(req.params.fileId, req.user.id);
    res.json({ message: 'Deleted successfully' });
  } catch {
    res.status(500).json({ error: 'Delete failed' });
  }
});

// ================= EXPORT =================
export { router as fileRoutes };