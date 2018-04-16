var fs = require('fs');
var path = require('path');
var glyphCompose = require('@mapbox/glyph-pbf-composite');


// warning: this will create about 2GB of cached font data for just the 5 default fonts
var outputDir = '_output';
var combinedFonts = [];

fs.readdirSync(outputDir).forEach(function (dir) {
    // exclude already combined dirs or stupid mac os ds store
    if (dir.includes(",") || dir.includes("."))
        return;

    if (dir.includes("Italic"))
        combinedFonts.push([dir, "Noto Sans Italic"]);
    else if (dir.includes("Bold") || dir.includes("Medium"))
        combinedFonts.push([dir, "Noto Sans Bold"]);
    else
        combinedFonts.push([dir, "Noto Sans Regular"]);
});


combinedFonts.forEach(function (value) {
    // kinda crappy because only lets you do two fonts but there's really only
    // a point to combining fonts with a full unicode font like Noto so no point
    // wasting time adding a few extra for loops or maps for that.
    const firstDir = outputDir + "/" + value[0];
    const secondDir = outputDir + "/" + value[1];
    const fontStack = value[0] + "," + value[1];
    const combinedDir = outputDir + "/" + fontStack;

    if (!fs.existsSync(combinedDir))
        fs.mkdirSync(combinedDir);

    console.log("Combining: " + fontStack);

    fs.readdirSync(firstDir).forEach(function (file) {
        const fileName = path.basename(file);
        const fontPbfs = [];

        fontPbfs.push(fs.readFileSync(firstDir + "/" + fileName));
        fontPbfs.push(fs.readFileSync(secondDir + "/" + fileName));

        var combined = glyphCompose.combine(fontPbfs, fontStack);
        fs.writeFileSync(combinedDir + "/" + file, combined);
    });
});
