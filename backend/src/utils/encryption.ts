import crypto from "crypto";

const algorithm = "aes-256-cbc";
const key = crypto
	.createHash("sha256")
	.update(process.env.APIKEY_SECRET!)
	.digest();

export function encrypt(text: string) {
	const iv = crypto.randomBytes(16);

	const cipher = crypto.createCipheriv(algorithm, key, iv);

	let encrypted = cipher.update(text, "utf-8");
	encrypted = Buffer.concat([encrypted, cipher.final()]);

	return {
		content: encrypted.toString("hex"),
		iv: iv.toString("hex"),
	};
}

export function decrypt(content: string, iv: string) {
	const decipher = crypto.createDecipheriv(
		algorithm,
		key,
		Buffer.from(iv, "hex"),
	);

	let decrypted = decipher.update(Buffer.from(content, "hex"));
	decrypted = Buffer.concat([decrypted, decipher.final()]);

	return decrypted.toString("utf-8");
}
