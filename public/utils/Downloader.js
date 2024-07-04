export default (/** @type Blob */ blob, name = "converted_images.png") => {
	const downloadURL = window.URL.createObjectURL(blob);
	const a = document.createElement("a");

	a.href = downloadURL;
	a.download = name;

	document.body.appendChild(a);
	a.click();

	document.body.removeChild(a);
	window.URL.revokeObjectURL(downloadURL);
};
