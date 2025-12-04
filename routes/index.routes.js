const express = require('express');
const router = express.Router();
const auth = require('../middleware/authe.middleware.js');
const supabase = require('../config/supabaseClient');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const sharp = require('sharp');
const path = require('path');

router.get('/', (req, res) => {
    res.redirect('/user/login');
});

router.get('/home', auth, async (req, res) => {
    try {
        const folder = req.user.userId + "/";

        const { data: files, error } = await supabase.storage
            .from('files')
            .list(folder);

        if (error || !files) {
            console.error('Error fetching files:', error);
            return res.render("home", { files: [] });
        }

        const filesWithUrls = files.map(file => {
            const publicUrl = supabase.storage
                .from('files')
                .getPublicUrl(folder + file.name).data.publicUrl;

            let thumbnailUrl = null;
            let iconUrl = null;

            const ext = path.extname(file.name).toLowerCase();
            const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

            if (imageExts.includes(ext)) {
                // For images, set thumbnail URL and fallback icon
                const thumbnailPath = `thumbnails/${req.user.userId}/${file.name}.jpg`;
                thumbnailUrl = supabase.storage
                    .from('files')
                    .getPublicUrl(thumbnailPath).data.publicUrl;

                iconUrl = 'https://png.pngtree.com/png-clipart/20190630/original/pngtree-jpg-file-document-icon-png-image_4166388.jpg';
            } else {
                // For non-images, assign a file icon based on extension
                const iconMap = {
                    '.pdf': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmVyb_J7mffdpI4vLpXlZi9tmzmXAy990KGg&s',
                    '.doc': 'https://e1.pngegg.com/pngimages/65/212/png-clipart-android-lollipop-icons-docs-google-document-icon-thumbnail.png',
                    '.docx': 'https://e1.pngegg.com/pngimages/65/212/png-clipart-android-lollipop-icons-docs-google-document-icon-thumbnail.png',
                    '.txt': 'https://cdn-icons-png.flaticon.com/512/2656/2656402.png',
                    '.zip': 'https://cdn-icons-png.freepik.com/512/9704/9704802.png',
                    '.mp4': 'https://via.placeholder.com/50x50/800080/FFFFFF?text=VID',
                    '.jpg': 'https://png.pngtree.com/png-clipart/20190630/original/pngtree-jpg-file-document-icon-png-image_4166388.jpg',
                    '.png': 'https://www.freeiconspng.com/uploads/file-format-png-icon-4.png',
                    '.gif': 'https://png.pngtree.com/png-vector/20190411/ourmid/pngtree-vector-gif-icon-png-image_925847.jpg',
                    // Add more as needed
                };
                iconUrl = iconMap[ext] || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmVyb_J7mffdpI4vLpXlZi9tmzmXAy990KGg&s';
            }

            return {
                ...file,
                publicUrl,
                thumbnailUrl,
                iconUrl
            };
        });

        res.render("home", { files: filesWithUrls });

    } catch (err) {
        console.error('Error:', err);
        res.render("home", { files: [] });
    }
});


router.post('/upload-file', auth, upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).send('No file uploaded');
        }

        const timestamp = Date.now();
        const filePath = `${req.user.userId}/${timestamp}-${file.originalname}`;
        const { data, error } = await supabase.storage.from('files').upload(filePath, file.buffer, {
            contentType: file.mimetype,
        });
        console.log("USER:", req.user);

        if (error) {
            console.error('Error uploading file:', error);
            return res.status(500).send('Error uploading file');
        }

        // Generate thumbnail for images
        if (file.mimetype.startsWith('image/')) {
            try {
                const thumbnailBuffer = await sharp(file.buffer)
                    .resize(200, 200, { fit: 'inside' })
                    .jpeg({ quality: 80 })
                    .toBuffer();

                const thumbnailPath = `thumbnails/${req.user.userId}/${timestamp}-${file.originalname}.jpg`;

                const { error: thumbError } = await supabase.storage.from('files').upload(thumbnailPath, thumbnailBuffer, {
                    contentType: 'image/jpeg',
                });

                if (thumbError) {
                    console.error('Error uploading thumbnail:', thumbError);
                    // Don't fail the upload if thumbnail fails
                }
            } catch (thumbErr) {
                console.error('Error generating thumbnail:', thumbErr);
            }
        }

        res.redirect('/home');
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Error uploading file');
    }
});

router.delete('/delete-file', auth, async (req, res) => {
    try {
        const { fileName } = req.body;
        const fullPath = `${req.user.userId}/${fileName}`;
        const { error } = await supabase.storage.from('files').remove([fullPath]);

        if (error) {
            console.error('Error deleting file:', error);
            return res.status(500).json({ message: 'Error deleting file' });
        }

        res.json({ message: 'File deleted successfully' });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Error deleting file' });
    }
});
router.get('/view-file/:fileName', auth, async (req, res) => {
    try {
        const fileName = req.params.fileName;
        const filePath = `${req.user.userId}/${fileName}`;

        const { data, error } = await supabase.storage
            .from('files')
            .download(filePath);

        if (error) {
            console.error('View error:', error);
            return res.status(404).send('File not found');
        }

        // Set content type so browser can open file
        res.setHeader('Content-Type', data.type);
        res.send(Buffer.from(await data.arrayBuffer()));

    } catch (err) {
        console.error('View error:', err);
        res.status(500).send('Error viewing file');
    }
});
router.get('/download-file/:fileName', auth, async (req, res) => {
    try {
        const fileName = req.params.fileName;
        const filePath = `${req.user.userId}/${fileName}`;

        const { data, error } = await supabase.storage
            .from('files')
            .download(filePath);

        if (error) {
            console.error('Download error:', error);
            return res.status(404).send('File not found');
        }

        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.send(Buffer.from(await data.arrayBuffer()));

    } catch (err) {
        console.error('Download error:', err);
        res.status(500).send('Error downloading file');
    }
});


module.exports = router;