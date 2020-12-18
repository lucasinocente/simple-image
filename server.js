const fs = require('fs')
const express = require('express')
const app = express()
const { createCanvas } = require('canvas')
const colors = require('./colors')
const port = 3000

app.use(express.static('public'))

const createImage = (width, height) => {
  const index = Math.floor(Math.random() * colors.length)
  const colorLeft = `#${colors[index]}`
  const colorRight = `#${
    colors[index + 1]
      ? colors[index + 1]
      : colors[index - 1]
  }`

  const canvas = createCanvas(width, height)
  const context = canvas.getContext('2d')

  const grd = context.createLinearGradient(0, 0, width, height)
  grd.addColorStop(0, colorLeft)
  grd.addColorStop(1, colorRight)

  context.fillStyle = grd
  context.fillRect(0, 0, width, height)

  return canvas.toBuffer('image/png')
}

app.get('/:width/:height', async ({ params }, res) => {
  const width = parseInt(params.width, 10)
  const height = parseInt(params.height, 10)
  const image = createImage(width, height)
  const folder = 'temp'
  const filepath = `./public/${folder}/${width}-${height}.png`

  fs.writeFileSync(filepath, image)
  res.sendFile(filepath, { root: __dirname })
})

app.get('/:width/:height/:id', async ({ params }, res) => {
  const width = parseInt(params.width, 10)
  const height = parseInt(params.height, 10)
  const id = params.id
  const folder = 'id'
  const filepath = `./public/${folder}/${width}-${height}-${id}.png`

  try {
    fs.readFileSync(filepath)
    res.sendFile(filepath, { root: __dirname })
  } catch (error) {
    const image = createImage(width, height)
    fs.writeFileSync(filepath, image)
    res.sendFile(filepath, { root: __dirname })
  }
})

app.listen(port, () => {
  console.log(`Simple Image running! http://localhost:${port}`)
})
