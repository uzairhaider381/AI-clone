const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    if (fs.statSync(file).isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace text-cyan-* with standard
  content = content.replace(/text-cyan-(?:[1-4]00)(?:\/\d+)?/g, 'text-muted-foreground');
  content = content.replace(/text-cyan-(?:[5-9]00)(?:\/\d+)?/g, 'text-foreground');
  content = content.replace(/text-cyan-[0-9]{2}(?:\/\d+)?/g, 'text-foreground'); 
  
  // Replace bg-cyan-*
  content = content.replace(/bg-cyan-500(?:\/\d+)?/g, 'bg-primary text-primary-foreground');
  content = content.replace(/bg-cyan-[6-9]00(?:\/\d+)?/g, 'bg-accent text-accent-foreground');
  content = content.replace(/bg-cyan-[1-4]00(?:\/\d+)?/g, 'bg-muted text-muted-foreground');
  content = content.replace(/bg-cyan-[0-9]{2}(?:\/\d+)?/g, 'bg-background');

  // Replace border-cyan-*
  content = content.replace(/border-cyan-[0-9]{2,3}(?:\/\d+)?/g, 'border-border');
  
  // Remove extreme styling like ring, shadow with rgba
  content = content.replace(/ring-1 ring-cyan-[0-9]{3}(?:\/\d+)?/g, '');
  content = content.replace(/shadow-\[.*?\]/g, 'shadow-sm');
  content = content.replace(/drop-shadow-\[.*?\]/g, '');
  content = content.replace(/backdrop-blur-[a-z0-9]+/g, '');
  content = content.replace(/border-cyan-[A-Za-z0-9\/]+/g, 'border-border');

  // Hardcoded hex colors
  content = content.replace(/bg-\[#[0-9a-fA-F]+\](?:\/\d+)?/g, 'bg-background');

  // Update hover state fixes
  content = content.replace(/hover:bg-cyan-[0-9]{3}(?:\/\d+)?/g, 'hover:bg-accent hover:text-accent-foreground');
  content = content.replace(/hover:text-cyan-[0-9]{3}(?:\/\d+)?/g, 'hover:text-accent-foreground');
  content = content.replace(/hover:border-cyan-[0-9]{3}(?:\/\d+)?/g, 'hover:border-accent');

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Cleaned up: ${file}`);
  }
});
