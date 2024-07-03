module.exports = {
	DEFAULT_FILE_SAVE_PATH: "temps/",
	DEFAULT_ZIP_FILE_NAME: "TEST.zip",
	FONT_OPTION: {
		content: `
			@font-face {
				font-family: 'NanumGothic';
				src: url('file:///usr/share/fonts/NanumFont/NanumGothic.ttf');
			}
			@font-face {
				font-family: 'NanumBrush';
				src: url('file:///usr/share/fonts/NanumFont/NanumBrush.ttf');
			}
			@font-face {
				font-family: 'NanumBarunGothic';
				src: url('file:///usr/share/fonts/NanumBarun/NanumBarunGothic.ttf');
			}
			@font-face {
				font-family: 'NanumBarunGothicBold';
				src: url('file:///usr/share/fonts/NanumBarun/NanumBarunGothicBold.ttf');
			}
			body {
					font-family: 'NanumGothic', 'NanumBrush', 'NanumBarunGothic', 'NanumBarunGothicBold', sans-serif;
				}
		`,
	},
};
