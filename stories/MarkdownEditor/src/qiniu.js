import axios from 'axios'
import uuid from './uuid'

export function getFileExtension(filename, defaultExt = 'jpg') {
  const ext = filename.split('.').pop()
  return ext === filename ? defaultExt : ext
}

export function qiniuFactory(qiniu) {
  function getFilename(prefix, ext = 'png') {
    if (prefix.endsWith('/')) {
      return `${prefix}${uuid()}.${ext}`
    }
    return `${prefix}-${uuid()}.${ext}`
  }

  function upload(fileData, filename) {
    const uploadForm = new FormData()
    uploadForm.append('token', qiniu.token)
    uploadForm.append('file', fileData)
    uploadForm.append('key', filename)

    return axios({
      method: 'POST',
      url: qiniu.uploadDomain || 'http://up-z2.qiniu.com',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: uploadForm
    })
  }

  return {
    getFileExtension,
    getFilename,
    upload
  }
}
