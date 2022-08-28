import React from 'react';
import { FileIcon, defaultStyles } from 'react-file-icon';
import './FileMessage.css';
import { useEffect } from 'react';
import getBlobUrl from '../../utils/getBlobUrl';
import { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import getFileSize from './../../utils/getFileSize';

const FileMessage = ({ message }) => {
  const fileType = message.fileInfo.type.split('/')[0];
  const [blobUrl, setBlobUrl] = useState('');

  useEffect(() => {
    if (!message.fileInfo.url) return;
    if (['video', 'image'].includes(message.fileInfo.type.split('/')[0]))
      return;
    if (message.fileInfo.url)
      getBlobUrl({ url: message.fileInfo.url, setBlobUrl });
  }, [message.fileInfo.url, message.fileInfo.type]);

  if (fileType === 'image') {
    return (
      <div className="msgFile photoCover">
        <div className="msgPhoto">
          {message.fileInfo.url ? (
            <img src={message.fileInfo.url} alt="message" />
          ) : (
            <div className="fileImgLoading">
              <CircularProgress size="50px" />
            </div>
          )}
        </div>
        <div className="msgPhotoInfo">{message.message}</div>
      </div>
    );
  } else if (fileType === 'video') {
    return (
      <div className="msgFile videoCover">
        <div className="msgVideo">
          {message.fileInfo.url ? (
            <video src={message.fileInfo.url} controls></video>
          ) : (
            <div className="fileVideoLoading">
              <CircularProgress size="50px" />
            </div>
          )}
        </div>
        <div className="msgVideoInfo">{message.message}</div>
      </div>
    );
  } else
    return (
      <div className="msgFile">
        <div className="icon">
          <FileIcon
            extension={message.fileInfo.extension}
            {...defaultStyles[message.fileInfo.extension]}
          />
        </div>
        <div className="fileInfo">
          <div className="fileInfoName">
            <p>{message.fileInfo.fileName}</p>
          </div>
          <div className="fileInfoSize">
            {message.fileInfo.url ? (
              <p>{getFileSize(message.fileInfo.size)}</p>
            ) : (
              <div className="fileLoadingStats">
                <p>
                  <span>
                    {'100mb' &&
                      getFileSize(message.fileProgressInfo.loaded, 'roundOff')}
                  </span>
                  /
                  <span>
                    {'100mb' &&
                      getFileSize(message.fileProgressInfo.total, 'roundOff')}
                  </span>
                </p>
                <p>
                  {'100' && message.fileProgressInfo.rate}
                  {'mb/s' && message.fileProgressInfo.rateUnit}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="fileStatus">
          {message.fileInfo.url ? (
            <>
              <div className="fileOpen">
                <span className="material-icons"> open_in_new </span>
                <a
                  href={message.fileInfo.url}
                  target="_blank"
                  rel={'noreferrer'}>
                  O
                </a>
              </div>
              <div className="fileDownload">
                <span className="material-icons"> file_download </span>
                <a href={blobUrl} download={message.fileInfo.fileName}>
                  D
                </a>
              </div>
            </>
          ) : (
            <div className="fileLoading">
              <div className="fileLoadingLabel">
                <CircularProgress
                  variant="determinate"
                  value={message.fileProgressInfo.fileSent}
                  size="40px"
                  color="secondary"
                />
                <div className="loadingLabel">
                  {message.fileProgressInfo.fileSent}%
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="msgFileInfo">{message.message}</div>
      </div>
    );
};

export default FileMessage;
