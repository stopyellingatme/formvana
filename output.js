// Script to copy the package contents to the example/node_modules
const fs = require("fs-extra");

const src1 = "./package/lib";
const src2 = "./package/package.json";

const dest = "./example/node_modules/@formvana";
const dest2 = "./example/node_modules/@formvana/lib";
const dest3 = "./example/node_modules/@formvana/package.json";

// Remove the old package
fs.remove(dest, (err) => {
  handleError(err);
  console.log("Removed: ", dest);
  // fs.remove(delete1, (remove_error) => {
  //   console.log("ERROR: ", remove_error);
  // });

  // Ensure the directory is created
  fs.ensureDir(src1, (err) => {
    handleError(err);
    // Copy the package's built output to the example's node_modules
    fs.copy(src1, dest2, { overwrite: true }, (err) => {
      handleError(err);
      console.log("Copied from: ", src1, " -- To: ", dest2);

      // Copy the package.json to the example's node_modules
      fs.copy(src2, dest3, { overwrite: true }, (err) => {
        handleError(err);
        console.log("Copied from: ", src2, " -- To: ", dest3);

        /**
         * Done!
         *
         * The Example should have newly built package, so
         * you can test those changes you made ;)
         *
         */
      });
    });
  });
});

function handleError(err) {
  if (err) return console.error("Error: ", err);
}
