import * as url from "url";
import { Storage } from "@google-cloud/storage";
import { Credentials, S3 } from "aws-sdk";
import { Stream } from "stream";

const storage = new Storage({
	projectId: process.env.GOOGLE_CLOUD_PROJECT,
	keyFilename: "keyfile.json"
});

const bucket = storage.bucket("schpoopstorage");

const theCredentials = new Credentials(
	process.env.S3_ACCESS_KEY_ID as string,
	process.env.S3_SECRET_ACCESS_KEY as string
);

const s3 = new S3({
	credentials: theCredentials,
	region: process.env.S3_REGION as string
});

export const pathFromUrl = (urlString: string) =>
	url.parse(urlString).pathname!.substr(1);

export const uploadImage = (
	file: Buffer,
	filePath: string,
	contentType: string
) =>
	new Promise<any>((resolve, reject) => {
		const googleFile = bucket.file(filePath);

		const stream = googleFile.createWriteStream({
			metadata: {
				contentType
			},
			resumable: false
		});

		stream.on("error", err => {
			console.log(err);
			reject(err);
		});

		stream.on("finish", () => {
			googleFile.makePublic().then(() => {
				resolve({ Location: getPublicUrl(filePath) });
			});
		});

		stream.end(file);
	});

const getPublicUrl = (filename: string) => {
	return `https://storage.googleapis.com/${
		process.env.CLOUD_BUCKET
	}/${filename}`;
};

export const deleteImage = (filePath: string) => {
	return s3
		.deleteObject({
			Bucket: process.env.S3_BUCKET!,
			Key: filePath
		})
		.promise();
};

// export const uploadImage = (
// 	file: Buffer,
// 	filePath: string,
// 	contentType: string
// ) =>
// 	s3
// 		.upload({
// 			Bucket: process.env.S3_BUCKET!,
// 			Key: filePath,
// 			Body: file,
// 			ContentType: contentType
// 		})
// 		.promise();

// export const deleteImage = (filePath: string) => {
// 	return s3
// 		.deleteObject({
// 			Bucket: process.env.S3_BUCKET!,
// 			Key: filePath
// 		})
// 		.promise();
// };
