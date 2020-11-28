import multer from "multer";
import aws from "aws-sdk";
import multerS3 from "multer-s3";
import aws_key from '../config/aws';

// 2 megabytes
const maxFileSize = 2 * 1024 * 1024;

const S3 = new aws.S3({
	accessKeyId: aws_key.accessKeyId,
	secretAccessKey: aws_key.secretAccessKey,
});

const aws_bucket = "youtube-videos-furg";


// Configurações do S3
// Envio occore dentro do "key"
// com Options podemos alterar qualquer configuração, essas são as default
const s3 = (options: any) => multer({
	storage: multerS3({
		s3: S3,
		bucket: aws_bucket,
		acl: 'public-read',
		key: function (request: Request, file, cb) {
			cb(null, file.originalname)
		},
		...options,
	}),
	limits: {
		fileSize: maxFileSize,
	}
});

export default s3;
