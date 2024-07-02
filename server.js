const express = require("express");
const puppeteer = require("puppeteer");
const multer = require("multer");
const fs = require("fs");
const fsp = require("fs").promises;
const path = require("path");
const archiver = require("archiver");

const app = express();

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/");
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	},
});

const upload = multer({ storage: storage });

app.use(express.static("public"));
app.use(express.json()); // JSON 파싱을 위해 추가

app.post("/convert", upload.array("html", 10), handleConvert);
app.post("/convert-url", handleConvertUrl);
app.post("/convert-multi-url", handleConvertMultiUrl);

async function handleConvert(req, res) {
	if (!req.files || req.files.length === 0) {
		return res.status(400).send("HTML 파일이 없습니다.");
	}

	const browser = await puppeteer.launch();
	const zipFilePath = path.join(__dirname, "converted_images.zip");
	const output = fs.createWriteStream(zipFilePath);
	const archive = archiver("zip", { zlib: { level: 9 } });

	output.on("close", async () => {
		await browser.close();
		res.download(zipFilePath, "converted_images.zip", async (err) => {
			if (err) console.error("다운로드 오류:", err);
			await fsp.unlink(zipFilePath);
			for (const file of req.files) {
				await fsp.unlink(file.path);
			}
		});
	});

	archive.pipe(output);

	try {
		for (const file of req.files) {
			const htmlContent = await fsp.readFile(file.path, "utf8");
			const page = await browser.newPage();
			await page.setContent(htmlContent);
			const screenshot = await page.screenshot({ fullPage: true, type: "png" });
			await page.close();

			const decodedOriginalName = decodeURIComponent(file.originalname);
			const originalName = path.parse(decodedOriginalName).name;
			const filename = `${originalName}.png`;

			archive.append(screenshot, { name: filename });
		}

		await archive.finalize();
	} catch (error) {
		console.error("변환 오류:", error);
		res.status(500).send("변환 중 오류가 발생했습니다.");
		await browser.close();
	}
}

async function handleConvertUrl(req, res) {
	const { url } = req.body;

	if (!url) {
		return res.status(400).send("URL이 제공되지 않았습니다.");
	}

	const browser = await puppeteer.launch();
	try {
		const page = await browser.newPage();
		await page.goto(url, { waitUntil: "networkidle0" });
		const screenshot = await page.screenshot({ fullPage: true, type: "png" });
		await browser.close();

		const urlObj = new URL(url);
		const filename = `${urlObj.hostname}.png`;

		res.contentType("image/png");
		res.send(screenshot);
	} catch (error) {
		console.error("URL 변환 오류:", error);
		res.status(500).send("URL 변환 중 오류가 발생했습니다.");
		await browser.close();
	}
}

async function handleConvertMultiUrl(req, res) {
	const { baseUrl, codes } = req.body;
	if (!baseUrl || !Array.isArray(codes) || codes.length === 0) {
		return res.status(400).send("올바른 Base URL과 코드 목록이 필요합니다.");
	}

	const browser = await puppeteer.launch();
	const zipFilePath = path.join(__dirname, "converted_multi_url.zip");
	const output = fs.createWriteStream(zipFilePath);
	const archive = archiver("zip", { zlib: { level: 9 } });

	output.on("close", async () => {
		await browser.close();
		res.download(zipFilePath, "converted_multi_url.zip", async (err) => {
			if (err) console.error("다운로드 오류:", err);
			await fsp.unlink(zipFilePath);
		});
	});

	archive.pipe(output);

	try {
		for (const code of codes) {
			const url = baseUrl.replace("{code}", code);
			const page = await browser.newPage();
			await page.goto(url, { waitUntil: "networkidle0" });
			const screenshot = await page.screenshot({ fullPage: true, type: "png" });
			await page.close();

			archive.append(screenshot, { name: `${code}.png` });
		}

		await archive.finalize();
	} catch (error) {
		console.error("다중 URL 변환 오류:", error);
		res.status(500).send("다중 URL 변환 중 오류가 발생했습니다.");
		await browser.close();
	}
}

const PORT = 4000;
app.listen(PORT, () => {
	console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
