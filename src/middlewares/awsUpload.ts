import aws from 'aws-sdk';
import awsConfig from '../config/aws';

const S3 = new aws.S3({
	accessKeyId: awsConfig.accessKeyId,
	secretAccessKey: awsConfig.secretAccessKey,
});

const aws_bucket = awsConfig.bucketName;

const uploadWithId = (file, type, id, title, extension) => {
	const params = {
		Bucket: aws_bucket,
		Key: `${type}/${id}_${title}.${extension}`, // File name you want to save as in S3
		Body: file,
	};
	console.log(params);
	// Uploading files to the bucket
	S3.upload(params, function (err, data) {
		if (err) {
			throw err;
		}
		console.log(`File uploaded successfully. ${data.Location}`);
	});
};

export default uploadWithId;
