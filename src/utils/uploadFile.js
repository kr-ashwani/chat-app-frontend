import byteSize from 'byte-size';

const uploadFile = async (
  e,
  uploadCb,
  laodingElement = null,
  fileID = [],
  progressCb
) => {
  const files = e.target ? e.target.files : [e];
  let i = 0;

  while (i < files.length) {
    const formData = new FormData();
    const req = new XMLHttpRequest();
    let prevSentBytes = 0;
    let timeDiff = 0;
    req.open(
      'POST',
      `${process.env.REACT_APP_SERVER_ENDPOINT}/uploadfile`,
      true
    );

    if (fileID.length) formData.append('fileID', fileID[i]);

    formData.append('file-upload', files[i], files[i].name);

    req.upload.onprogress = uploadProgress;
    req.onloadstart = (e) => {
      timeDiff = Date.now();
    };
    req.onload = () => {
      if (req.status === 200)
        if (typeof uploadCb === 'function') {
          if (laodingElement) laodingElement.classList.remove('show');
          uploadCb(JSON.parse(req.response));
        }
    };

    const progressInfo = {};
    progressInfo.fileID = fileID[i];
    function uploadProgress(e) {
      let bytesSent = e.loaded - prevSentBytes;
      
      const byteInfo=byteSize(bytesSent);
      progressInfo.rateUnit = `${byteInfo.unit}/s`;

      progressInfo.loaded = e.loaded;
      progressInfo.total = e.total;
      progressInfo.remainingBytes = e.total - e.loaded;
      progressInfo.fileSent = Math.round((e.loaded / e.total) * 100);
      const time = (Date.now() - timeDiff) / 1000;

      if (time !== 0) {
        progressInfo.rate = byteInfo.value / time;
        if (typeof progressCb === 'function') progressCb(progressInfo);
      }
      prevSentBytes = e.loaded;
      timeDiff = Date.now();
    }

    req.withCredentials = true;
    req.send(formData);
    i++;
  }
};

export default uploadFile;
