function getFileSize(fileSize, numberFormat = null) {
  let BSize = fileSize;
  let KBSize = BSize / 1024;
  let MBSize = KBSize / 1024;
  let GBSize = MBSize / 1024;

  if (!fileSize) return `${BSize}b`;

  KBSize = KBSize
    ? Number(String(KBSize).split('.')[1]) > 99
      ? KBSize.toFixed(2)
      : KBSize
    : KBSize;
  MBSize = MBSize
    ? Number(String(MBSize).split('.')[1]) > 99
      ? MBSize.toFixed(2)
      : MBSize
    : MBSize;
  GBSize = GBSize
    ? Number(String(GBSize).split('.')[1]) > 99
      ? GBSize.toFixed(2)
      : GBSize
    : MBSize;

  if (Math.floor(GBSize))
    return `${numberFormat ? Math.floor(GBSize) : GBSize}gb`;
  else if (Math.floor(MBSize))
    return `${numberFormat ? Math.floor(MBSize) : MBSize}mb`;
  else if (Math.floor(KBSize))
    return `${numberFormat ? Math.floor(KBSize) : KBSize}kb`;
  else return `${numberFormat ? Math.floor(BSize) : BSize}b`;
}

export default getFileSize;
