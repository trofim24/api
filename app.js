const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const marked = require('marked');

// Set options
marked.use({
  mangle: false,
  headerIds: false
});

const app = express();
const PORT = process.env.PORT || 3000;

const markdownFolder = path.join(__dirname, 'markdown_files');

app.use(express.static('public'));

app.get('/files', async (req, res) => {
  try {
    const files = await readMarkdownFiles(markdownFolder);
    res.json({ files });
  } catch (err) {
    res.status(500).json({ error: 'Error reading the folder' });
  }
});

app.get('/_file/:filepath(*)', async (req, res) => {
  console.log(2);
  const filepath = req.params.filepath.replace(/-/g, ' ');
  console.log(filepath);
  const filePath = path.join(markdownFolder, filepath);

  try {
    const data = await fs.readFile(filePath, 'utf8');
    const htmlContent = await marked.parse(data);
    res.send(htmlContent);
  } catch (err) {
    res.status(404).send('File not found');
  }
});

// Catch-all route to serve index.html for specific URLs
app.get('/file/:filepath(*)', (req, res, next) => {
  console.log(1);
  // Check if the requested URL matches the desired format (e.g., "url/file/filename.md")
  const filepath = req.params.filepath;
  if (filepath.endsWith('.md')) {
    // Serve the index.html file
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    // Handle other routes
    next();
  }
});

async function readMarkdownFiles(folderPath) {
  const files = [];
  const entries = await fs.readdir(folderPath, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const subFiles = await readMarkdownFiles(path.join(folderPath, entry.name));
      files.push(...subFiles);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(path.relative(markdownFolder, path.join(folderPath, entry.name)));
    }
  }

  return files;
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
