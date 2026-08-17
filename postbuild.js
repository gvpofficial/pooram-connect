import fs from 'fs';
import path from 'path';

const filePath = path.join('dist', 'index.html');
if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Log original state of script tags
  const matchModuleScript = content.match(/<script[^>]*type="module"[^>]*>/gi);
  console.log('Post-build: Found script tags before processing:', matchModuleScript);

  // Replace type="module" and crossorigin
  const originalLength = content.length;
  content = content.replace(/<script\s+type="module"\s+crossorigin\s*>/gi, '<script>');
  content = content.replace(/<script\s+crossorigin\s+type="module"\s*>/gi, '<script>');
  
  // Fallback: strip any remaining type="module" from script tags
  content = content.replace(/<script([^>]*)type="module"([^>]*)>/gi, '<script$1$2>');
  content = content.replace(/<script([^>]*)crossorigin([^>]*)>/gi, '<script$1$2>');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Post-build: Finished rewriting. Length changed from ${originalLength} to ${content.length}`);
  
  const matchModuleScriptAfter = content.match(/<script[^>]*type="module"[^>]*>/gi);
  console.log('Post-build: Found script tags after processing:', matchModuleScriptAfter);
} else {
  console.error('Post-build: dist/index.html not found!');
}
