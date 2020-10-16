const Cloud = require('@google-cloud/storage')
const path = require('path')
const serviceKey = path.join(__dirname, './keys.json')

const { Storage } = Cloud
const storage = new Storage({
  keyFilename: serviceKey,
  projectId: 'NodeJS',
})

const bucket = storage.bucket('first-bucket-3') // bucket name
const mimeTypes = require('mimetypes');

function uploadImage(file, colID) {

    const image = file.data_url;
    const mimeType = image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)[1];
    const fileName = "pic" + colID + mimeTypes.detectExtension(mimeType);
    const base64EncodedImageString = image.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64EncodedImageString, 'base64');
    const blob = bucket.file(fileName)

    blob.save(imageBuffer, {
        metadata: { contentType: mimeType },
        public: true,
        validation: 'md5'
    }, function(error) {

        if (error) {
            return console.log('Unable to upload the image.');
        }

        return ("https://storage.googleapis.com/first-bucket-3"+fileName);

    })

    return ("https://storage.googleapis.com/first-bucket-3/"+fileName)

}

module.exports = uploadImage;