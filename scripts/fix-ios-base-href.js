#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const iosIndex = path.join("platforms", "ios", "www", "index.html");

if (!fs.existsSync(iosIndex)) {
  console.log(
    `[fix-ios-base-href] No existe: ${iosIndex} (¿ya corriste cordova prepare ios?)`
  );
  process.exit(0);
}

let html = fs.readFileSync(iosIndex, "utf8");

// Reemplaza base href="/" por "./"
const before = html;
html = html.replace(/<base href="\/"\s*\/?>/i, '<base href="./">');

if (html !== before) {
  fs.writeFileSync(iosIndex, html, "utf8");
  console.log(
    `[fix-ios-base-href] OK: base href corregido a ./ en ${iosIndex}`
  );
} else {
  console.log(
    `[fix-ios-base-href] No se encontró <base href="/"> o ya estaba correcto.`
  );
}
