const fs = require("fs");
const path = require("path");
const exec = require("child_process").execSync;

function scanDir(dir) {
  let results = [];
  fs.readdirSync(dir).forEach(function(file) {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(scanDir(file));
    } else if (file.endsWith(".ts") || file.endsWith(".tsx")) {
      results.push(file);
    }
  });
  return results;
}

const allImports = new Set();
const files = scanDir("./components");

for (const file of files) {
  const content = fs.readFileSync(file, "utf-8");
  const matches = [...content.matchAll(/from ['"]([^'"]+)['"]/g)];
  matches.forEach(match => {
    const pkg = match[1];
    if (pkg.startsWith(".")) return; // bỏ qua import nội bộ
    if (pkg.startsWith("@")) {
      const parts = pkg.split("/");
      if (parts.length >= 2) {
        allImports.add(parts[0] + "/" + parts[1]);
      } else {
        allImports.add(parts[0]);
      }
    } else {
      allImports.add(pkg.split("/")[0]);
    }
  });
}

const packages = [...allImports].join(" ");
console.log("Installing missing packages:");
console.log(packages);

exec(`npm install ${packages}`, { stdio: "inherit" });