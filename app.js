const express = require('express');
const fs = require('fs');
const path = require('path');
const marked = require('marked');

const app = express();
const PORT = process.env.PORT || 3000;

// Define the folder containing your Markdown files
const markdownFolder = path.join(__dirname, 'markdown_files');

// Serve static files (HTML, CSS, JS) from the "public" folder (if you have any)
app.use(express.static('public'));

// Endpoint to get the list of available Markdown files
app.get('/files', (req, res) => {
  readMarkdownFiles(markdownFolder, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading the folder' });
    }
    res.json({ files });
  });
});

// Endpoint to read and convert the selected Markdown file to HTML
app.get('/file/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(markdownFolder, filename);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(404).send('File not found');
    }
	console.log(marked);
    const htmlContent = marked.parse(data);
    res.send(htmlContent);
  });
});

function readMarkdownFiles(folderPath, callback) {
  fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      return callback(err);
    }
    const fileArray = [];

    files.forEach((file) => {
      if (file.isDirectory()) {
        readMarkdownFiles(path.join(folderPath, file.name), (err, subFiles) => {
          if (!err) {
            fileArray.push(...subFiles);
          }
        });
      } else if (file.isFile() && file.name.endsWith('.md')) {
        fileArray.push(path.relative(markdownFolder, path.join(folderPath, file.name)));
      }
    });

    callback(null, fileArray);
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});