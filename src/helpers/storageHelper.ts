import * as url from "url";
import { Storage } from "@google-cloud/storage";

const storage = new Storage({
	projectId: process.env.GOOGLE_CLOUD_PROJECT,
	keyFilename: "keyfile.json"
});

const bucket = storage.bucket("schpoopstorage");

export const pathFromUrl = (urlString: string) =>
	// removes bucket name (+ 2 slashes) since that part of the path is always part of requests
	url.parse(urlString).pathname!.substr(process.env.CLOUD_BUCKET!.length + 2);

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

export const deleteImage = (filePath: string) => bucket.file(filePath).delete();
