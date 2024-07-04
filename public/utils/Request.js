import downloader from "./Downloader.js";
import { changeExtension } from "./String.js";

const status = document.getElementById("status");

export default {
	post: async (
		url,
		body = {},
		zipFileName,
		loadingMsg = "처리중 ... ",
		okMsg = "처리완료",
		errorMsg = "처리실패"
	) => {
		try {
			status.textContent = loadingMsg;

			const response = await fetch(url, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});
			if (!response.ok) throw new Error();

			const blob = await response.blob();
			downloader(blob, zipFileName || url);

			status.textContent = okMsg;
		} catch (error) {
			console.error("오류:", error);
			status.textContent = errorMsg;
		}
	},

	filePost: async (
		url,
		file,
		loadingMsg = "처리중 ... ",
		okMsg = "처리완료",
		errorMsg = "처리실패"
	) => {
		try {
			status.textContent = loadingMsg;

			const body = new FormData();
			body.append("html", file, encodeURIComponent(file.name));

			const response = await fetch(url, { method: "POST", body });
			if (!response.ok) throw new Error();

			const blob = await response.blob();
			downloader(blob, changeExtension(file.name, "png"));

			status.textContent = okMsg;
		} catch (error) {
			console.error("오류:", error);
			status.textContent = errorMsg;
		}
	},
};
