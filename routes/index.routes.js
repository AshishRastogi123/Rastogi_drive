const express = require('express');
const router = express.Router();
const auth = require('../middleware/authe.middleware.js');
const supabase = require('../config/supabaseClient');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

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

        const filesWithUrls = files.map(file => ({
            ...file,
            publicUrl: supabase.storage
                .from('files')
                .getPublicUrl(folder + file.name).data.publicUrl
        }));

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

        const filePath = `${req.user.userId}/${Date.now()}-${file.originalname}`;
        const { data, error } = await supabase.storage.from('files').upload(filePath, file.buffer, {
            contentType: file.mimetype,
        });
        console.log("USER:", req.user);

        if (error) {
            console.error('Error uploading file:', error);
            return res.status(500).send('Error uploading file');
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