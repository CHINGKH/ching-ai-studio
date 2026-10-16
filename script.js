const promptInput = document.getElementById('promptInput');
const aspectRatio = document.getElementById('aspectRatio');
const generateBtn = document.getElementById('generateBtn');
const resultSection = document.getElementById('resultSection');
const outputContainer = document.getElementById('outputContainer');

generateBtn.addEventListener('click', async () => {
    const promptText = promptInput.value.trim();
    if (!promptText) {
        alert('សូមបញ្ចូលការបរិយាយពីរូបភាពជាមុនសិន!');
        return;
    }

    resultSection.style.display = 'block';
    outputContainer.innerHTML = `<div style="padding: 20px; color: #94a3b8;"><i class="fa-solid fa-spinner fa-spin" style="font-size: 24px; color: #a855f7;"></i><p style="margin-top: 10px;">កំពុងបង្កើតរូបភាពដោយ AI...</p></div>`;

    try {
        const response = await fetch('/api/generate-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: promptText,
                aspectRatio: aspectRatio.value
            })
        });

        const data = await response.json();
        if (response.ok && data.imageUrl) {
            outputContainer.innerHTML = `<img src="${data.imageUrl}" alt="Generated AI Image">`;
        } else {
            outputContainer.innerHTML = `<p style="color: #ef4444;">កំហុស៖ ${data.error || 'មិនអាចបង្កើតរូបភាពបានទេ'}</p>`;
        }
    } catch (err) {
        console.error(err);
        outputContainer.innerHTML = `<p style="color: #ef4444;">មានបញ្ហាក្នុងការเชื่อมต่อជាមួយ Server!</p>`;
    }
});
