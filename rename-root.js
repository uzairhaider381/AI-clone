const fs = require('fs');

const files = ['index.html', 'app.js', 'style.css'];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Case-insensitive replace for Perplexity -> AI Clone
    content = content.replace(/Perplexity/gi, 'AI Clone');
    // Also "perplexity" -> "AI Clone", though "gi" catches it.
    
    fs.writeFileSync(file, content);
    console.log('Updated: ' + file);
  }
});
