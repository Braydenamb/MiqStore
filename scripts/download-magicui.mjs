import fs from 'fs';
import path from 'path';

const steps = [78, 90, 91, 92, 93, 94];

async function main() {
  const uiPath = path.join(process.cwd(), 'src', 'components', 'ui');
  if (!fs.existsSync(uiPath)) {
    fs.mkdirSync(uiPath, { recursive: true });
  }

  let allCss = '\n/* Magic UI Custom Animations */\n@theme {\n';
  let hasCss = false;

  for (const step of steps) {
    const mdPath = `/home/miq/.gemini/antigravity-ide/brain/87beaf60-8298-4a60-afaa-51b83a77dab6/.system_generated/steps/${step}/content.md`;
    if (!fs.existsSync(mdPath)) {
      console.error(`File not found: ${mdPath}`);
      continue;
    }

    const content = fs.readFileSync(mdPath, 'utf-8');
    
    // The JSON starts after the frontmatter, typically around line 8 or 9.
    // Let's find the first '{' and the last '}'
    const startIdx = content.indexOf('{');
    const endIdx = content.lastIndexOf('}');
    if (startIdx === -1 || endIdx === -1) {
      console.error(`No JSON found in ${mdPath}`);
      continue;
    }

    const jsonStr = content.substring(startIdx, endIdx + 1);
    let data;
    try {
      data = JSON.parse(jsonStr);
      console.log(`Parsed component: ${data.name}`);
    } catch (e) {
      console.error(`Failed to parse JSON in ${mdPath}:`, e.message);
      continue;
    }

    if (data.files && data.files.length > 0) {
      for (const file of data.files) {
        const filePath = path.join(uiPath, path.basename(file.path));
        fs.writeFileSync(filePath, file.content);
        console.log(`Saved ${filePath}`);
      }
    }

    if (data.cssVars && data.cssVars.theme) {
      for (const [key, value] of Object.entries(data.cssVars.theme)) {
        allCss += `  --${key}: ${value};\n`;
        hasCss = true;
      }
    }

    if (data.css) {
      for (const [key, value] of Object.entries(data.css)) {
        allCss += `  ${key} {\n`;
        for (const [k, v] of Object.entries(value)) {
          allCss += `    ${k} {\n`;
          for (const [prop, val] of Object.entries(v)) {
            allCss += `      ${prop}: ${val};\n`;
          }
          allCss += `    }\n`;
        }
        allCss += `  }\n`;
      }
      hasCss = true;
    }
  }

  allCss += '}\n';

  if (hasCss) {
    const cssPath = path.join(process.cwd(), 'src', 'app', 'globals.css');
    if (fs.existsSync(cssPath)) {
      fs.appendFileSync(cssPath, allCss);
      console.log('Appended Magic UI CSS to globals.css');
    }
  }

  console.log('Done!');
}

main().catch(console.error);
