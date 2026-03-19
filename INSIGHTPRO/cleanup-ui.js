const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Background replacements
  content = content.replace(/bg-\[#020611\]/g, 'bg-background');
  content = content.replace(/bg-\[#040D21\](?:\/\d+)?/g, 'bg-card');
  content = content.replace(/bg-\[#0a1930\](?:\/\d+)?/g, 'bg-muted');
  content = content.replace(/bg-cyan-950(?:\/\d+)?/g, 'bg-accent');
  content = content.replace(/bg-cyan-900(?:\/\d+)?/g, 'bg-accent');
  content = content.replace(/bg-cyan-500(?:\/\d+)?/g, 'bg-primary');
  
  // Text color replacements
  content = content.replace(/text-cyan-50(?:\/\d+)?/g, 'text-foreground');
  content = content.replace(/text-cyan-100(?:\/\d+)?/g, 'text-foreground');
  content = content.replace(/text-cyan-200(?:\/\d+)?/g, 'text-muted-foreground');
  content = content.replace(/text-cyan-300(?:\/\d+)?/g, 'text-primary');
  content = content.replace(/text-cyan-400(?:\/\d+)?/g, 'text-primary');
  content = content.replace(/text-cyan-500(?:\/\d+)?/g, 'text-primary');
  content = content.replace(/text-cyan-600(?:\/\d+)?/g, 'text-muted-foreground');
  content = content.replace(/text-cyan-700(?:\/\d+)?/g, 'text-muted-foreground');
  content = content.replace(/text-cyan-800(?:\/\d+)?/g, 'text-muted-foreground');
  content = content.replace(/text-white/g, 'text-foreground');
  
  // Border replacements
  content = content.replace(/border-cyan-[0-9]{3}(?:\/\d+)?/g, 'border-border');
  
  // Remove extreme shadows and blur
  content = content.replace(/shadow-\[.*?\]/g, 'shadow-sm');
  content = content.replace(/drop-shadow-\[.*?\]/g, '');
  content = content.replace(/backdrop-blur-[a-z0-9]+/g, '');
  
  // Clean up remaining custom colors
  content = content.replace(/text-\[#E0F7FA\]/g, 'text-foreground');

  // Change primary color usages where necessary
  content = content.replace(/hover:text-cyan-[0-9]{3}/g, 'hover:text-foreground');
  content = content.replace(/hover:bg-cyan-[0-9]{3}(?:\/\d+)?/g, 'hover:bg-accent');
  content = content.replace(/hover:border-cyan-[0-9]{3}(?:\/\d+)?/g, 'hover:border-accent');
  
  // Make large border radii smaller
  content = content.replace(/rounded-\[2rem\]/g, 'rounded-2xl');
  content = content.replace(/rounded-\[24px\]/g, 'rounded-xl');
  content = content.replace(/rounded-\[32px\]/g, 'rounded-2xl');
  content = content.replace(/rounded-\[40px\]/g, 'rounded-3xl');

  if (content !== fs.readFileSync(file, 'utf8')) {
    fs.writeFileSync(file, content);
    console.log(`Simplified UI in: ${file}`);
  }
});
