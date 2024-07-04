import request from "./utils/Request.js";
import overlay from "./utils/Overlay.js";
import { replaceCode, replaceCodeToValue, toDistinctArray } from "./utils/String.js";
import { getCurrentTimestamp } from "./utils/Date.js";

// 공백 방지
const noBlank = (e) => (e.key == " " ? e.preventDefault() : null);

document.addEventListener("DOMContentLoaded", () => {
	const status = document.getElementById("status");

	// HTML 파일 변환
	const fileInput = document.getElementById("fileInput");
	const converFileBtn = document.getElementById("converFileBtn");
	converFileBtn.addEventListener("click", () => {
		if (!fileInput.files[0]) {
			alert("파일을 선택해주세요");
			fileInput.click();
			return;
		}

		request.filePost(
			"/convert-html",
			fileInput.files[0],
			"파일 변환중 ...", // 로딩 상태메세지
			"파일 변환 완료! 이미지 파일이 다운로드됩니다.", // 성공 상태메세지
			"파일 변환 중 서버에서 오류가 발생했습니다." // 실패 상태메세지
		);
	});

	// 단일 URL 변환
	const urlInput = document.getElementById("urlInput");
	const convertUrlBtn = document.getElementById("convertUrlBtn");

	urlInput.addEventListener("keydown", noBlank);
	convertUrlBtn.addEventListener("click", () => {
		request.post(
			"/convert-url",
			{ url: urlInput.value.trim() },
			"image",
			"URL 변환 중...",
			"URL 변환 완료! PNG 파일이 다운로드됩니다.",
			"URL 변환 중 오류가 발생했습니다."
		);
	});

	// 다중 URL 변환
	const codesInput = document.getElementById("codesInput");
	const valuesInput = document.getElementById("valuesInput");
	const baseUrlInput = document.getElementById("baseUrlInput");
	const urlOverlay = document.getElementById("baseUrlOverlay");
	const convertMultiUrlBtn = document.getElementById("convertMultiUrlBtn");

	codesInput.addEventListener("keydown", noBlank);
	baseUrlInput.addEventListener("keydown", noBlank);

	// URL 패턴 Overlay Sync
	overlay(urlOverlay, baseUrlInput.value, codesInput.value.trim()); // 기본값 적용
	codesInput.addEventListener("keyup", () => {
		overlay(urlOverlay, baseUrlInput.value, codesInput.value.trim());
	});
	baseUrlInput.addEventListener("keyup", () => {
		overlay(urlOverlay, baseUrlInput.value, codesInput.value.trim());
	});

	convertMultiUrlBtn.addEventListener("click", () => {
		if (!baseUrlInput.value) {
			status.textContent = "URL주소를 입력해주세요!";
			baseUrlInput.focus();
			return;
		}

		const code = codesInput.value.trim();
		const values = toDistinctArray(valuesInput.value);
		const baseURL = baseUrlInput.value.trim();
		const noCodeURL = replaceCode(baseURL, code);

		// let list = Array.from(new Set(values.map((val) => baseURL.replace(`{${code}}`, val))));
		let list;
		list = values.map((value) => replaceCodeToValue(baseURL, code, value));
		list = Array.from(new Set(list));

		if (list.length < 1) {
			status.textContent = "변환값을 입력해주세요. 한건일 경우 URL변환 기능을 이용해주세요!";
			valuesInput.focus();
			return;
		}

		let names = list.map((e) => e.replace(noCodeURL, "") + ".png");

		request.post(
			"convert-multi-url",
			{ list, names },
			getCurrentTimestamp(),
			"URL 처리 중...",
			"URL 변환 완료! 압축파일이 다운로드됩니다.",
			"URL 변환 중 오류가 발생했습니다.\n올바른 코드를 입력했는지 확인해주세요."
		);
	});
});
