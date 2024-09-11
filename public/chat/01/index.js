window.onload = () => {
	document.cookie = "refresh=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
	document.cookie = "section=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
	document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
};

function loadBundle() {
	const script = document.createElement("script");
	script.src = "./bundle.js";
	script.defer = true;
	document.head.appendChild(script);
}

const baseURL = "http://3.36.38.178:3000";

// e.g. "http://192.168.1.232:8080/authenticate/coopbase/users",

// body: JSON.stringify({ code: "HB2425611" }), // 조합원 코드 또는 juminLog
const requestUserAndSetCookie = async (/** @type String */ url, /** @type String */ code) => {
	try {
		const response = await fetch(`${baseURL}${url.startsWith("/") ? url : "/" + url}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ code }),
		});

		if (!response.ok) {
			const err = await response.json();
			console.log(err);
			throw new Error(err.message);
		}

		document.cookie = `refresh=${await response.json()}; path=/chat/01; SameSite=Strict;`;

		return true;
	} catch (error) {
		if (error.message) alert(error.message);
		console.error(error);

		return false;
	}
};
