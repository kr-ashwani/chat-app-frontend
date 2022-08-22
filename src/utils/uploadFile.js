const uploadFile = async (e, uploadCb, progressCb) => {
  const files = e.target.files;
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

    formData.append('file-upload', files[i], files[i].name);

    req.upload.onprogress = uploadProgress;
    req.onloadstart = (e) => {
      timeDiff = Date.now();
    };
    req.onload = () => {
      if (req.status === 200)
        if (typeof uploadCb === 'function') uploadCb(JSON.parse(req.response));
    };

    function uploadProgress(e) {
      const progressInfo = {};
      let bytesSent = e.loaded - prevSentBytes;
      if (Math.round(bytesSent / (1024 * 1024 * 1024))) {
        bytesSent = bytesSent / (1024 * 1024 * 1024);
        progressInfo.rateUnit = 'GB/s';
      } else if (Math.round(bytesSent / (1024 * 1024))) {
        bytesSent = bytesSent / (1024 * 1024);
        progressInfo.rateUnit = 'MB/s';
      } else if (Math.round(bytesSent / 1024)) {
        bytesSent = bytesSent / 1024;
        progressInfo.rateUnit = 'KB/s';
      } else {
        progressInfo.rateUnit = 'B/s';
      }

      progressInfo.loaded = e.loaded;
      progressInfo.total = e.total;
      progressInfo.remainingBytes = e.total - e.loaded;
      const time = (Date.now() - timeDiff) / 1000;

      if (time !== 0) {
        progressInfo.rate = bytesSent / time;
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
