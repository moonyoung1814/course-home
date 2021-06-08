function getSuffix (fileName) {
  console.log(fileName.length)
  let suffix = ''
  let index = fileName.lastIndexOf('.')
  console.log(index)
  if (index === -1) {
    return suffix
  } else {
    for (let i = index; i < (fileName.length); i++) {
      suffix += fileName[i]
    }
    return suffix
  }
}
export default getSuffix
