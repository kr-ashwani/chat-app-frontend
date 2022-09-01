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

  for (let j = 0; j < inputFiles.length; j++) {
    if (inputFiles[j].type.split('/')[0] === 'image') continue;
    optimizedFiles[j] = inputFiles[j];
  }

  let count = 0;

  const files = inputFiles; // get the file
  if (!inputFiles.length) return;

  for (let i = 0; i < inputFiles.length; i++) {
    if (inputFiles[i].type.split('/')[0] !== 'image') {
      count++;
      continue;
    }
    const blobURL = URL.createObjectURL(files[i]);
    const img = new Image();
    img.src = blobURL;
    img.onerror = function () {
      URL.revokeObjectURL(this.src);
      // Handle the failure properly
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

export default optimizeFile;
