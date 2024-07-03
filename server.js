const express = require("express");
const app = express();
app.use(express.static("public"));
app.use(express.json());

const { saveFile, deleteFile, encodeFileToUTF8 } = require("./src/FileHandler");
const { screenshotByFile, screenshotByUrl, screenshotByUrlList } = require("./src/FileParser");

// 단일 파일 변환
app.post("/convert-html", saveFile.single("html"), async (req, res) => {
	await encodeFileToUTF8(req.file);

	res.setHeader("Content-Type", "image/png");
	res.send(await screenshotByFile(req.file.path));
	deleteFile(req.file);
});

// 단일 URL 변환
app.post("/convert-url", async (req, res) => {
	const URL = req.body.url;
	if (!URL) res.status(400).json({ error: true, message: "URL이 입력되지 않았습니다." });

	res.setHeader("Content-Type", "image/png");
	return res.send(await screenshotByUrl(URL));
});

// 여러 URL 변환
app.post("/convert-multi-url", async (req, res) => {
	const baseURL = req.body.baseURL;
	const values = req.body.values;
	const codes = req.body.codes;

	const urls = [
		"https://211.234.123.19/cug/cug_orgbbs/calc_goodsdetail_view.php?g_code=32004GP000",
	];
	const filenames = ["32004GP000.png"];

	const ZIP = await screenshotByUrlList(urls, filenames);

	res.setHeader("Content-Type", "application/zip");
	res.setHeader("Content-Disposition", 'attachment; filename="screenshots.zip"');

	ZIP.pipe(res);
});

const PORT = 4000;
app.listen(PORT, () => {
	console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
