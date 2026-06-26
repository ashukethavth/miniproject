import { Router, Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { authMiddleware } from '../middleware/auth';
import { supabaseAdmin } from '../config/supabase';

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Validation rules
const createFolderValidation = [
  body('name').isLength({ min: 1, max: 255 }),
  body('parentId').optional().isUUID(),
  body('description').optional().isLength({ max: 1000 }),
];

const folderIdValidation = [
  param('folderId').isUUID(),
];

// Create folder
router.post('/', createFolderValidation, async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, parentId, description } = req.body;
    const userId = req.user.id;

    // Get parent folder info if provided
    let parentPath = '';
    let parentPathArray: string[] = [];

    if (parentId) {
      const { data: parentFolder, error: parentError } = await supabaseAdmin
        .from('folders')
        .select('path, path_array')
        .eq('id', parentId)
        .eq('owner_id', userId)
        .single();

      if (parentError || !parentFolder) {
        return res.status(404).json({ error: 'Parent folder not found' });
      }

      parentPath = parentFolder.path;
      parentPathArray = parentFolder.path_array;
    }

    // Generate new path
    const newPath = `${parentPath}/${name}`;
    const newPathArray = [...parentPathArray, parentId || ''];

    // Check if folder with same name exists in parent
    const { data: existingFolder } = await supabaseAdmin
      .from('folders')
      .select('id')
      .eq('name', name)
      .eq('parent_id', parentId || null)
      .eq('owner_id', userId)
      .single();

    if (existingFolder) {
      return res.status(409).json({ error: 'Folder with this name already exists' });
    }

    // Create folder
    const { data: folder, error } = await supabaseAdmin
      .from('folders')
      .insert({
        name,
        description,
        parent_id: parentId || null,
        owner_id: userId,
        path: newPath,
        path_array: newPathArray.filter(id => id !== '')
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Update parent folder count
    if (parentId) {
      await supabaseAdmin
        .rpc('increment_folder_count', { folder_id: parentId });
    }

    // Log folder creation
    await supabaseAdmin.from('audit_logs').insert({
      user_id: userId,
      action: 'folder.create',
      resource_type: 'folder',
      resource_id: folder.id,
      details: { name, parentId }
    });

    res.status(201).json({
      message: 'Folder created successfully',
      folder
    });
  } catch (error) {
    console.error('Create folder error:', error);
    res.status(500).json({ error: 'Failed to create folder' });
  }
});

// Get folder contents
router.get('/:folderId/contents', folderIdValidation, async (req: Request, res: Response) => {
  try {
    const { folderId } = req.params;
    const userId = req.user.id;

    // Verify folder ownership
    const { data: folder, error: folderError } = await supabaseAdmin
      .from('folders')
      .select('*')
      .eq('id', folderId)
      .eq('owner_id', userId)
      .single();

    if (folderError || !folder) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    // Get subfolders
    const { data: subfolders, error: subfoldersError } = await supabaseAdmin
      .from('folders')
      .select('id, name, description, created_at, updated_at, total_size, file_count, folder_count')
      .eq('parent_id', folderId)
      .eq('owner_id', userId)
      .order('name');

    if (subfoldersError) {
      throw subfoldersError;
    }

    // Get files
    const { data: files, error: filesError } = await supabaseAdmin
      .from('files')
      .select('id, name, original_name, extension, mime_type, size, created_at, updated_at, version, is_shared, share_count')
      .eq('folder_id', folderId)
      .eq('owner_id', userId)
      .eq('is_deleted', false)
      .order('name');

    if (filesError) {
      throw filesError;
    }

    res.json({
      folder,
      contents: {
        folders: subfolders || [],
        files: files || []
      }
    });
  } catch (error) {
    console.error('Get folder contents error:', error);
    res.status(500).json({ error: 'Failed to get folder contents' });
  }
});

// Get folder tree
router.get('/tree', async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    // Get all folders for user
    const { data: folders, error } = await supabaseAdmin
      .from('folders')
      .select('id, name, parent_id, path, path_array')
      .eq('owner_id', userId)
      .order('path');

    if (error) {
      throw error;
    }

    // Build tree structure
    const folderMap = new Map();
    const rootFolders: any[] = [];

    // First pass: create folder objects
    folders?.forEach(folder => {
      folderMap.set(folder.id, {
        ...folder,
        children: []
      });
    });

    // Second pass: build hierarchy
    folders?.forEach(folder => {
      const folderObj = folderMap.get(folder.id);

      if (folder.parent_id) {
        const parent = folderMap.get(folder.parent_id);
        if (parent) {
          parent.children.push(folderObj);
        }
      } else {
        rootFolders.push(folderObj);
      }
    });

    res.json({ tree: rootFolders });
  } catch (error) {
    console.error('Get folder tree error:', error);
    res.status(500).json({ error: 'Failed to get folder tree' });
  }
});

// Update folder
router.put('/:folderId', folderIdValidation, [
  body('name').optional().isLength({ min: 1, max: 255 }),
  body('description').optional().isLength({ max: 1000 })
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { folderId } = req.params;
    const { name, description } = req.body;
    const userId = req.user.id;

    // Get current folder
    const { data: currentFolder, error: getError } = await supabaseAdmin
      .from('folders')
      .select('*')
      .eq('id', folderId)
      .eq('owner_id', userId)
      .single();

    if (getError || !currentFolder) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    // Check name conflict if renaming
    if (name && name !== currentFolder.name) {
      const { data: existingFolder } = await supabaseAdmin
        .from('folders')
        .select('id')
        .eq('name', name)
        .eq('parent_id', currentFolder.parent_id)
        .eq('owner_id', userId)
        .neq('id', folderId)
        .single();

      if (existingFolder) {
        return res.status(409).json({ error: 'Folder with this name already exists' });
      }
    }

    // Update folder
    const updateData: any = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;

    const { data: updatedFolder, error: updateError } = await supabaseAdmin
      .from('folders')
      .update(updateData)
      .eq('id', folderId)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    // Log update
    await supabaseAdmin.from('audit_logs').insert({
      user_id: userId,
      action: 'folder.update',
      resource_type: 'folder',
      resource_id: folderId,
      details: { changes: updateData }
    });

    res.json({
      message: 'Folder updated successfully',
      folder: updatedFolder
    });
  } catch (error) {
    console.error('Update folder error:', error);
    res.status(500).json({ error: 'Failed to update folder' });
  }
});

// Move folder
router.put('/:folderId/move', folderIdValidation, [
  body('newParentId').optional().isUUID()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { folderId } = req.params;
    const { newParentId } = req.body;
    const userId = req.user.id;

    // Get current folder
    const { data: currentFolder, error: getError } = await supabaseAdmin
      .from('folders')
      .select('*')
      .eq('id', folderId)
      .eq('owner_id', userId)
      .single();

    if (getError || !currentFolder) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    // Prevent moving folder into itself or its children
    if (newParentId) {
      if (newParentId === folderId) {
        return res.status(400).json({ error: 'Cannot move folder into itself' });
      }

      const { data: parentFolder } = await supabaseAdmin
        .from('folders')
        .select('path_array')
        .eq('id', newParentId)
        .eq('owner_id', userId)
        .single();

      if (parentFolder?.path_array.includes(folderId)) {
        return res.status(400).json({ error: 'Cannot move folder into its own subdirectory' });
      }
    }

    // Update folder parent
    const { data: updatedFolder, error: updateError } = await supabaseAdmin
      .from('folders')
      .update({ parent_id: newParentId || null })
      .eq('id', folderId)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    // TODO: Update paths for folder and all children
    // This would require a more complex recursive update

    // Log move
    await supabaseAdmin.from('audit_logs').insert({
      user_id: userId,
      action: 'folder.move',
      resource_type: 'folder',
      resource_id: folderId,
      details: { newParentId }
    });

    res.json({
      message: 'Folder moved successfully',
      folder: updatedFolder
    });
  } catch (error) {
    console.error('Move folder error:', error);
    res.status(500).json({ error: 'Failed to move folder' });
  }
});

// Delete folder
router.delete('/:folderId', folderIdValidation, async (req: Request, res: Response) => {
  try {
    const { folderId } = req.params;
    const userId = req.user.id;

    // Check if folder has contents
    const { data: files } = await supabaseAdmin
      .from('files')
      .select('id')
      .eq('folder_id', folderId)
      .eq('owner_id', userId)
      .eq('is_deleted', false)
      .limit(1);

    const { data: subfolders } = await supabaseAdmin
      .from('folders')
      .select('id')
      .eq('parent_id', folderId)
      .eq('owner_id', userId)
      .limit(1);

    if ((files && files.length > 0) || (subfolders && subfolders.length > 0)) {
      return res.status(400).json({ error: 'Cannot delete folder with contents' });
    }

    // Delete folder
    const { error } = await supabaseAdmin
      .from('folders')
      .delete()
      .eq('id', folderId)
      .eq('owner_id', userId);

    if (error) {
      throw error;
    }

    // Log deletion
    await supabaseAdmin.from('audit_logs').insert({
      user_id: userId,
      action: 'folder.delete',
      resource_type: 'folder',
      resource_id: folderId
    });

    res.json({ message: 'Folder deleted successfully' });
  } catch (error) {
    console.error('Delete folder error:', error);
    res.status(500).json({ error: 'Failed to delete folder' });
  }
});

export { router as folderRoutes };
