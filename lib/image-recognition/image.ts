import * as tf from '@tensorflow/tfjs'

const loadSingle = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.src = src
    img.onload = () => resolve(tf.browser.fromPixels(img))
    img.onerror = (err) => reject(err)
  })

const resize = (image) => tf.image.resizeBilinear(image, [224, 224])

const batch = (image) => {
  // Expand our tensor to have an additional dimension, whose size is 1
  const batchedImage = image.expandDims(0)

  // Turn pixel data into a float between -1 and 1.
  return batchedImage
    .toFloat()
    .div(tf.scalar(127))
    .sub(tf.scalar(1))
}

const crop = (img) => {
  const width = img.shape[0]
  const height = img.shape[1]

  // use the shorter side as the size to which we will crop
  const shorterSide = Math.min(img.shape[0], img.shape[1])

  // calculate beginning and ending crop points
  const startingHeight = (height - shorterSide) / 2
  const startingWidth = (width - shorterSide) / 2
  const endingHeight = startingHeight + shorterSide
  const endingWidth = startingWidth + shorterSide

  // return image data cropped to those points
  return img.slice(
    [startingWidth, startingHeight, 0],
    [endingWidth, endingHeight, 3]
  )
}

export default {
  loadSingle,
  crop,
  resize,
  batch
}
