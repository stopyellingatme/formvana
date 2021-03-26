// Script to copy the package contents to the example/node_modules

const fs = require("fs-extra");

const src1 = "./package/lib";
const src2 = "./package/package.json";


const dest = "./example/node_modules/@formvana";
const dest2 = "./example/node_modules/@formvana/lib";
const dest3 = "./example/node_modules/@formvana/package.json";

fs.remove(dest, (err) => {
  if (err) return console.error(err);

  fs.ensureDir(src1, (err) => {
    fs.copy(src1, dest2, { overwrite: true }, (err) => {
      if (err) return console.error(err);
      console.log("Copied Package to ./example's node_modules.");

      fs.copy(src2, dest3, { overwrite: true }, (err) => {
        if (err) return console.error(err);
        console.log("Made it to the last one!");
      });
    });
  });
});

// fs.remove(src_node_mods, (err) => {
//   if (err) return console.error(err);
//   console.log("Removed Package's node_modules.");
//   fs.copy(src, dest, { overwrite: true, filter: filterFunc }, (err) => {
//     if (err) return console.error(err);
//     console.log("Copied Package to example's node_modules.");
//   });
// })
