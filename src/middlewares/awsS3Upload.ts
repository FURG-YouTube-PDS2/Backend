import multer from "multer";
import aws from "aws-sdk";
import multerS3 from "multer-s3";
import awsConfig from '../config/aws';
import uuid from "uuid";

// 50 megabytes
const maxFileSize = 50 * 1024 * 1024;
const S3 = new aws.S3({
	accessKeyId: awsConfig.accessKeyId,
	secretAccessKey: awsConfig.secretAccessKey,
});

const aws_bucket = awsConfig.bucketName;


// Configurações do S3
// Envio occore dentro do "key"
// com Options podemos alterar qualquer configuração, essas são as default
const s3 = (options: any) => multer({
	storage: multerS3({
		s3: S3,
		bucket: aws_bucket,
		//acl: 'public-read',
		key: function (req: Request, file, cb) {
			const extension = file.mimetype.split('/')[1]; // gets the extension
			let folder = "";
			if(extension in ['mp4', 'mkv']){
				folder = "videos";
			} else {
				folder = "images";
			};
			const fileName = `${folder}/${file.originalname}.${extension}`;
			cb(null, fileName)
		},
		...options,
	}),
	limits: {
		fileSize: maxFileSize,
	}
});

export default s3;
