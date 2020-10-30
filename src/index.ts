import ExifReader from 'exifreader'
import { promises as fs } from 'fs'
import moment from 'moment'
import path from 'path'

const main = async () => {
  const imageDir = 'images/'
  const allFiles = await fs.readdir(imageDir, {
    withFileTypes: true,
  })
  const imageFiles = allFiles.filter((file) => {
    return file.isFile() && /.*\.jpg$/.test(file.name)
  })

  const getExifListTasks = imageFiles.map(async (imageFile) => {
    const imagePath = path.join(imageDir, imageFile.name)
    const imageBuffer = await fs.readFile(imagePath)
    const tags = ExifReader.load(imageBuffer)

    const createDate = ((): string => {
      const rawCreateDate = tags['CreateDate'].description
      const offsetTime = tags['OffsetTime'].description
      if (/\+\d\d:\d\d$/.test(rawCreateDate)) {
        return rawCreateDate
      } else {
        return `${rawCreateDate}${offsetTime}`
      }
    })()

    const modifyDate = ((): string => {
      const rawModifyDate = tags['ModifyDate'].description
      const offsetTime = tags['OffsetTime'].description
      if (/\+\d\d:\d\d$/.test(rawModifyDate)) {
        return rawModifyDate
      } else {
        return `${rawModifyDate}${offsetTime}`
      }
    })()

    return {
      filename: imageFile.name,
      imageWidth: tags['Image Width'].value,
      imageHeight: tags['Image Height'].value,
      cameraMaker: tags['Make'].description,
      cameraModel: tags['Model'].description,
      createDate,
      modifyDate,
      creatorTool: tags['CreatorTool'].description,
      lens: tags['Lens'].description,
      focalLength: tags['FocalLength'].description.split(' ')[0],
      exposureTime: tags['ExposureTime'].description,
      fNumber: tags['FNumber'].description,
      isoSpeedRatings: tags['ISOSpeedRatings'].description.toString(),
    }
  })

  const exifList = await Promise.all(getExifListTasks)
  const jsonData = exifList
    .map(
      ({
        filename,
        imageWidth,
        imageHeight,
        createDate,
        modifyDate,
        ...rest
      }) => {
        return {
          filename,
          width: imageWidth,
          height: imageHeight,
          createDate: moment(createDate),
          modifyDate: moment(modifyDate),
          ...rest,
        }
      }
    )
    .sort((a, b) => {
      return a.createDate.isBefore(b.createDate) ? 1 : -1
    })
    .map(({ createDate, modifyDate, ...rest }) => {
      return {
        createDate: createDate.format(),
        modifyDate: modifyDate.format(),
        ...rest,
      }
    })

  const exportPath = 'exports/data.json'
  await fs.writeFile(exportPath, JSON.stringify(jsonData, null, 2))
}

main()
  .then()
  .catch((err) => console.error(err))
