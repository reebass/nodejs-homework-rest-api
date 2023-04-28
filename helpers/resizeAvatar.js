const Jimp = require("jimp");

async function resizeAvatar(path, width, height) {
  try {
    const image = await Jimp.read(path);
    image.resize(width, height);
    await image.writeAsync(path);
  } catch (err) {
    console.error(err);
  }
}

module.exports = resizeAvatar;