function getBlobUrl({ url, setBlobUrl }) {
  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const blobURL = URL.createObjectURL(blob);
      setBlobUrl(blobURL);
    });
}

export default getBlobUrl;
