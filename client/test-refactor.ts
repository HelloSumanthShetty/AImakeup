import { generateMakeup } from './src/services/makeupService';

async function test() {
    console.log("Testing makeup generation...");
    const result = await generateMakeup("Test prompt for banana");
    if (result.error) {
        console.error("Test failed:", result.error);
    } else {
        console.log("Test success!");
        if (result.image) console.log("Image received (base64 length):", result.image.length);
        if (result.text) console.log("Text received:", result.text);
    }
}

test();
