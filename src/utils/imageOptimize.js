const MAXFrameWidth = 300;
const MAXFrameHeight = 700;

function optimizeFile(
  inputFiles,
  setCompressedFiles,
  imageWidth = 1024,
  imageHeight = 800,
  imageQuality = 0.9,
  imageMimeType = 'image/jpeg'
) {
  const optimizedFiles = [];
  console.log(inputFiles.inputType);
  optimizedFiles.inputType = inputFiles.inputType;

  let count = 0;

  for (let j = 0; j < inputFiles.length; j++) {
    if (inputFiles[j].type.split('/')[0] === 'image') continue;
    optimizedFiles[j] = inputFiles[j];
    count++;
  }

  //only videos
  if (count === inputFiles.length) return setCompressedFiles(optimizedFiles);

  const files = inputFiles; // get the file
  if (!inputFiles.length) return;

  for (let i = 0; i < inputFiles.length; i++) {
    if (inputFiles[i].type.split('/')[0] !== 'image') continue;

    const blobURL = URL.createObjectURL(files[i]);
    const img = new Image();
    img.src = blobURL;
    img.onerror = function () {
      URL.revokeObjectURL(this.src);
      console.log('Cannot load image');
    };

    // eslint-disable-next-line no-loop-func
    img.onload = function () {
      URL.revokeObjectURL(this.src);
      const [newWidth, newHeight] = calculateSize(img, imageWidth, imageHeight);
      const canvas = document.createElement('canvas');
      canvas.width = newWidth;
      canvas.height = newHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      canvas.toBlob(
        (blob) => {
          // Handle the compressed image. es. upload or save in local state
          const myFile = new File([blob], files[i].name, {
            type: blob.type,
          });

          const [frameWidth, frameHeight] = calculateFrameSize(
            { width: newWidth, height: newHeight },
            MAXFrameWidth,
            MAXFrameHeight
          );

          myFile.dimensions = { width: frameWidth, height: frameHeight };
          count++;
          //file is compressed and state of component(that called this function) is updated to compressed blob
          optimizedFiles[i] = myFile;
          if (count === inputFiles.length) setCompressedFiles(optimizedFiles);
        },
        imageMimeType,
        imageQuality
      );
    };
  }
}

function calculateSize(img, maxWidth, maxHeight) {
  let width = img.width;
  let height = img.height;

  // calculate the width and height, constraining the proportions
  // calculating dimensions of compressed image by retaining aspect ratio.
  if (width > height) {
    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }
  } else {
    if (height > maxHeight) {
      width = Math.round((width * maxHeight) / height);
      height = maxHeight;
    }
  }
  return [width, height];
}

function calculateFrameSize(img, maxWidth, maxHeight) {
  let width = img.width;
  let height = img.height;

  if (width <= maxWidth && height <= maxHeight) return [width, height];

  let aspectRatio = width / height;
  // calculate the width and height, constraining the proportions
  // calculating dimensions of compressed image by retaining aspect ratio.
  const [width1, height1] = [maxWidth, Math.round(maxWidth / aspectRatio)];
  const [width2, height2] = [Math.round(maxHeight * aspectRatio), maxHeight];
  if (width1 <= maxWidth && height1 <= maxHeight) return [width1, height1];
  else if (width2 <= maxWidth && height2 <= maxHeight) return [width2, height2];
}

export default optimizeFile;
