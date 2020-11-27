import multer from "multer";
import path from "path";
import aws from "aws-sdk";
import multerS3 from "multer-s3";


const MAX_SIZE_TWO_MEGABYTES = 2 * 1024 * 1024;

const S3 = new aws.S3({
	accessKeyId: "AKIAWGKRN3ZJ5MR5TFN6",
	secretAccessKey: "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"
});

const aws_bucket = "youtube-videos-furg";



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
});

export default s3;
