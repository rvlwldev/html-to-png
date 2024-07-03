const FSP = require("fs").promises;
const archiver = require("archiver");

const puppeteer = require("puppeteer");

const CONSTANTS = require("./Constants");

/**
 * 업로드된 HTML 파일을 스크린샷으로 변환하고 반환합니다.
 *
 * @param {string} filePath - 저장된 HTML 파일의 경로
 * @returns {Promise<File>} - 스크린샷 PNG 파일
 */
async function screenshotByFile(filepath) {
	const FILE = await FSP.readFile(filepath, "utf-8");

	const browser = await puppeteer.launch();

	const page = await browser.newPage();
	await page.setContent(FILE);
	await page.addStyleTag(CONSTANTS.FONT_OPTION);

	const screenshot = await page.screenshot({ fullPage: true, type: "png" });
	await browser.close();

	return screenshot;
}

/**
 * 해당 URL의 HTML을 스크린샷으로 변환하고 반환합니다.
 *
 * @param {string} url - 스크린샷으로 변환할 URL
 * @returns {Promise<File>} - 스크린샷 PNG 파일
 */
async function screenshotByUrl(url) {
	const browser = await puppeteer.launch();

	const page = await browser.newPage();
	await page.goto(url, { waitUntil: "networkidle0" });
	await page.addStyleTag(CONSTANTS.FONT_OPTION);

	const screenshot = await page.screenshot({ fullPage: true, type: "png" });
	await browser.close();

	return screenshot;
}

/**
 * 여러 URL의 HTML들을 스크린샷으로 변환하고 반환합니다.
 *
 * @param {Array<string>} urls - 스크린샷으로 변환할 URL 리스트
 * @returns {Promise<File>} - PNG 파일 리스트 ZIP파일
 */
async function screenshotByUrlList(urls, filenames) {
	const ZIP = archiver("zip", { zlib: { level: 9 } });

	const browser = await puppeteer.launch();
	for (let i = 0; i < urls.length; i++) {
		const URL = urls[i];
		const name = filenames[i];

		const page = await browser.newPage();
		await page.goto(URL, { waitUntil: "networkidle0" });
		await page.addStyleTag(CONSTANTS.FONT_OPTION);

		const screenshot = await page.screenshot({ fullPage: true, type: "png" });
		await page.close();

		ZIP.append(screenshot, { name });
	}
	await browser.close();
	await ZIP.finalize();

	return ZIP;
}

module.exports = {
	screenshotByFile,
	screenshotByUrl,
	screenshotByUrlList,
};
