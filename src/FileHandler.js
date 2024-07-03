const FS = require("fs");
const FSP = require("fs").promises;
const PATH = require("path");
const multer = require("multer");

const chardet = require("chardet");
const iconv = require("iconv-lite");

const CONSTANTS = require("./Constants");

/**
 * 클라이언트 업로드 파일 저장 미들웨어
 *
 * 요청 핸들러 이전에 파일을 저장합니다.
 *
 * Express Request 객체에 file 또는 files 로 저장됩니다.
 *
 */
const saveFile = multer({
	storage: multer.diskStorage({
		destination: (req, file, callback) => {
			if (!FS.existsSync(CONSTANTS.DEFAULT_FILE_SAVE_PATH))
				FS.mkdirSync(CONSTANTS.DEFAULT_FILE_SAVE_PATH, { recursive: true });

			callback(null, CONSTANTS.DEFAULT_FILE_SAVE_PATH);
		},
		filename: async (req, file, callback) =>
			callback(null, deduplicateFileName(file.originalname)),
	}),
});

const deduplicateFileName = (fileName) => {
	let result = fileName;
	const REGEX = /\((\d+)\)/; // 파일명에 (1), (2) .. 가 있는지

	while (FS.existsSync(PATH.join(CONSTANTS.DEFAULT_FILE_SAVE_PATH, result))) {
		let i = result.lastIndexOf(".");
		let fileName = i !== -1 ? result.substring(0, i) : result;
		let extension = i !== -1 ? result.substring(i + 1) : "";

		const MATCH = fileName.match(REGEX);
		if (MATCH) {
			let newFileName = `(${parseInt(MATCH[1]) + 1})${extension ? "." + extension : ""}`;
			fileName = fileName.replace(REGEX, newFileName);
			result = fileName;
		} else result = `${fileName}_(1)${extension ? "." + extension : ""}`;
	}

	return result;
};

/**
 * 파일을 삭제합니다.
 *
 * @param {File} file - 파일 객체
 *
 */
async function deleteFile(file) {
	await FSP.unlink(PATH.join(process.cwd(), file.path));
}

/**
 * 저장된 파일의 텍스트를 UTF-8로 인코딩합니다.
 *
 * @param {File} file - 파일 객체
 *
 */
async function encodeFileToUTF8(file) {
	const path = PATH.join(process.cwd(), file.path);

	const buffer = await FSP.readFile(path);
	const encoding = chardet.detect(buffer) || "UTF-8";
	const content = iconv.encode(iconv.decode(buffer, encoding), "UTF-8");

	await FSP.writeFile(path, content);
}

module.exports = { saveFile, deleteFile, encodeFileToUTF8 };
