export default (overlayElement, targetString, code) => {
	overlayElement.innerHTML = targetString
		.replace(/<span class="highlight">|<\/span>/g, "")
		.replace(`{${code}}`, `<span class="highlight">{${code}}</span>`);
};
