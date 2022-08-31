async function getBlobUrl({ url, setBlobUrl }) {
  const response = await fetch(url);
  const responseBlob = await response.blob();
  const blobURL = URL.createObjectURL(responseBlob);
  setBlobUrl(blobURL);
}

export default getBlobUrl;
