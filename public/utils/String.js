const changeExtension = (fileName, ext) =>
	`${fileName.replace(/\.[^/.]+$/, "")}.${ext.replace(/{.}/g, "")}`;

const replaceCode = (fullURL, code, value) =>
	fullURL.replace(new RegExp(`\\{${code}\\}`, "g"), value || "").trim();

const replaceCodeToValue = (target, code, value) => target.replace(`{${code}}`, value);

// 쉼표,공백,개행 제거 및 분리
const toDistinctArray = (string) =>
	new String(string)
		.replace(new RegExp(/,/g), "\n")
		.replace(new RegExp(/ /g), "\n")
		.trim()
		.split("\n")
		.filter((val) => val);

export { changeExtension, replaceCode, replaceCodeToValue, toDistinctArray };
