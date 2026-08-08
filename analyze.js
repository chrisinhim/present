const fs = require('fs');
const html = fs.readFileSync('C:/Workspaces/present/index.html', 'utf8');

// Find all IDs
const ids = new Set();
let m;
const idRegex = /id="([^"]+)"/g;
while ((m = idRegex.exec(html)) !== null) {
    ids.add(m[1]);
}

// Find all CSS selectors
const cssSelectors = new Set();
const styleRegex = /<style>([\s\S]*?)<\/style>/g;
let styleMatch;
while ((styleMatch = styleRegex.exec(html)) !== null) {
    const css = styleMatch[1];
    const rules = css.match(/[^\r\n,{}]+(?=\s*\{)/g);
    if (rules) {
        rules.forEach(r => {
            cssSelectors.add(r.trim());
        });
    }
}

// Check if IDs are used in CSS or JS
const jsRegex = /<script>([\s\S]*?)<\/script>/g;
let jsContent = '';
let jsMatch;
while ((jsMatch = jsRegex.exec(html)) !== null) {
    jsContent += jsMatch[1] + '\n';
}

const unusedIds = [];
for (let id of ids) {
    const inCss = html.includes('#' + id);
    const inJs = jsContent.includes(id);
    if (!inCss && !inJs) {
        unusedIds.push(id);
    }
}

// Find unused CSS IDs/Classes (simple heuristic)
const unusedCss = [];
for (let sel of cssSelectors) {
    if (sel.startsWith('#')) {
        const id = sel.substring(1).split(/[\s:.]/)[0];
        if (!ids.has(id)) {
            unusedCss.push(sel);
        }
    } else if (sel.startsWith('.')) {
        const cls = sel.substring(1).split(/[\s:.]/)[0];
        if (!html.includes('class="') || (!html.includes('class="'+cls+'"') && !html.includes(' '+cls+'"'))) {
            // Very naive class check
            let found = false;
            const classRegex = /class="([^"]+)"/g;
            let cMatch;
            while ((cMatch = classRegex.exec(html)) !== null) {
                if (cMatch[1].split(' ').includes(cls)) {
                    found = true; break;
                }
            }
            if (!found && !jsContent.includes(cls)) {
                unusedCss.push(sel);
            }
        }
    }
}

console.log('Unused IDs:', unusedIds);
console.log('Unused CSS:', unusedCss);

// JS functions checking
const funcRegex = /function\s+([a-zA-Z0-9_]+)\s*\(/g;
const functions = new Set();
let fMatch;
while ((fMatch = funcRegex.exec(jsContent)) !== null) {
    functions.add(fMatch[1]);
}

const unusedFuncs = [];
for (let f of functions) {
    // count occurrences
    const regex = new RegExp(f, 'g');
    const matches = html.match(regex);
    if (matches && matches.length === 1) { // only the declaration
        unusedFuncs.push(f);
    }
}

console.log('Unused Functions:', unusedFuncs);

// JS variables checking
const varRegex = /(?:const|let|var)\s+([a-zA-Z0-9_]+)\s*=/g;
const vars = new Set();
let vMatch;
while ((vMatch = varRegex.exec(jsContent)) !== null) {
    vars.add(vMatch[1]);
}

const unusedVars = [];
for (let v of vars) {
    const regex = new RegExp(`\\b${v}\\b`, 'g');
    const matches = jsContent.match(regex);
    if (matches && matches.length === 1) { // only the declaration
        unusedVars.push(v);
    }
}

console.log('Unused Vars:', unusedVars);
