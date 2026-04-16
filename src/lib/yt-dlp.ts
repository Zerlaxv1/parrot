import { exists, writeFile, mkdir, BaseDirectory } from "@tauri-apps/plugin-fs";
import { fetch } from "@tauri-apps/plugin-http";
import { Command } from "@tauri-apps/plugin-shell";

// use path api : https://v2.tauri.app/plugin/file-system/#usage

const YT_DLP_BINARY_NAME = "yt-dlp.exe";
const YT_DLP_DIR_PATH = "yt-dlp";
const YT_DLP_BINARY_PATH = `${YT_DLP_DIR_PATH}/${YT_DLP_BINARY_NAME}`;

/**
 * Checks if the yt-dlp binary exists in the expected location.
 */
async function checkYtDlpBinary() {
	return exists(YT_DLP_BINARY_PATH, {
		baseDir: BaseDirectory.AppData,
	});
}

async function downloadYtDlpBinary() {
	// Ensure the directory exists before writing the file
	if (!(await exists(YT_DLP_DIR_PATH, { baseDir: BaseDirectory.AppData }))) {
		await mkdir(YT_DLP_DIR_PATH, {
			baseDir: BaseDirectory.AppData,
			recursive: true,
		});
	}

	// Download the yt-dlp binary from https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe
	const response: Response = await fetch(
		"https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe",
		{
			method: "GET",
		},
	);
	const binaryData: Uint8Array = new Uint8Array(await response.arrayBuffer());

	// Save the binary data to the expected location
	const writeFileResult = await writeFile(YT_DLP_BINARY_PATH, binaryData, {
		baseDir: BaseDirectory.AppData,
	});
	console.log("yt-dlp binary downloaded and saved:", writeFileResult);
}

export async function initializeYtDlp() {
	try {
		const YTDLPBinary: boolean = await checkYtDlpBinary();
		if (!YTDLPBinary) {
			console.log("yt-dlp binary not found. Downloading...");
			await downloadYtDlpBinary();
			return;
		}

		// Execute yt-dlp --version to validate the installed binary.
		const command = Command.create("run-yt-dlp-version", ["--version"]);
		const output = await command.execute();
		console.log("yt-dlp version:", output.stdout.trim());
		if (output.stderr.trim()) {
			console.log(output.stderr.trim());
		}
	} catch (error) {
		console.error("Failed to initialize yt-dlp:", error);
	}
}
