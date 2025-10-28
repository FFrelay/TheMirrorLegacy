import { join } from "path";

// --- ⚙️ CONFIGURATION ---
// Edit the values below to match your setup
// ----------------------------------------

const CONFIG = {
    /** The folder where your numbered .md files are located. */
    sourceFolder: "C:\\Users\\tarun\\Translations\\TheMirrorLegacy\\translations", // 👈 Set your source folder path

    /** The name (and path) of the final combined file. */
    outputFile: "C:\\Users\\tarun\\Translations\\TheMirrorLegacy\\combined-book.md", // 👈 Set your desired output file name

    /** The file number to start merging from (e.g., 1 for 1.md). */
    startRange: 847, // 👈 Set the starting file number

    /** The file number to end merging at (inclusive). */
    endRange: 1097, // 👈 Set the ending file number
};

// ----------------------------------------
// --- SCRIPT (No need to edit below) ---
// ----------------------------------------

console.log("🚀 Starting Markdown merge script...");

// 1. Validate range from config
if (CONFIG.startRange > CONFIG.endRange) {
    console.error(
        `❌ Error: 'startRange' (${CONFIG.startRange}) must be less than or equal to 'endRange' (${CONFIG.endRange}).`,
    );
    process.exit(1);
}

console.log(
    `Merging files from ${CONFIG.startRange}.md to ${CONFIG.endRange}.md...`,
);
console.log(`Source: ${CONFIG.sourceFolder}`);
console.log(`Output: ${CONFIG.outputFile}`);

const contentParts: string[] = [];
let filesMerged = 0;

/**
 * Main function to find, read, and merge the files.
 */
async function mergeFiles() {
    try {
        // 2. Loop through the specified range
        for (let i = CONFIG.startRange; i <= CONFIG.endRange; i++) {
            const fileName = `${i}.md`;
            const filePath = join(CONFIG.sourceFolder, fileName);
            const file = Bun.file(filePath);

            // 3. Check if file exists and read it
            if (await file.exists()) {
                const content = await file.text();
                contentParts.push(content);
                // Add a Markdown horizontal rule as a separator
                contentParts.push("\n\n---\n\n");
                filesMerged++;
                console.log(`  + Added ${fileName}`);
            } else {
                console.warn(`  ⚠️ Warning: File ${fileName} not found. Skipping.`);
            }
        }

        // 4. Write the combined content to the output file
        if (filesMerged > 0) {
            // Remove the last separator
            contentParts.pop();

            await Bun.write(CONFIG.outputFile, contentParts.join(""));
            console.log(
                `✅ Success! Merged ${filesMerged} files into ${CONFIG.outputFile}.`,
            );
        } else {
            console.log("ℹ️ No files found in the specified range. No output file created.");
        }
    } catch (error) {
        console.error("❌ An unexpected error occurred:", error);
        process.exit(1);
    }
}

// 5. Run the script
mergeFiles();