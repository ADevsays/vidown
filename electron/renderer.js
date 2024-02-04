const $ = query => document.querySelector(query);
const downloadButton = $('#downloadButton');
const inputUrl = $('input[type="url"]');
const selectOnlyAudio = $('#only-audio');
const selectMaxQuality = $('#max-quality');
const selectMinQuality = $('#min-quality');
const infoText = $("#info-text");
const errorDiv = $("#error");
const errorText = $(".error-text");
const spinner = $("#spinner");
const successDiv = $("#success");

const prevTexts = {
    prevInfo: infoText.textContent,
    prevBtn: downloadButton.textContent,
};

const errors = {
    not_url: 'Parece ser que no has agregado ninguna URL.',
    invalide_url: 'No has ingresado una URL de Youtube',
    errorDownload: 'Parece que hubo un error al descargar'
};

const videoData = {
    url: '',
    onlyAudio: false,
    resolution: 'higher'
};

function setError(errorMsg) {
    errorText.textContent = errorMsg;
    errorDiv.classList.add('flex');
    errorDiv.classList.remove('hidden');
    inputUrl.value = '';
    videoData.url = '';
    setTimeout(() => {
        errorDiv.classList.add('hidden');
        errorDiv.classList.remove('flex');
    }, 3000);
};

function setDoneDownload() {
    successDiv.classList.remove('hidden');
    successDiv.classList.add('flex');
    setTimeout(() => {
        successDiv.classList.remove('flex');
        successDiv.classList.add('hidden');
    }, 3000);
};

function validateURL(url) {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(embed\/|v\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    return regex.test(url);
};

function changeCursorSelectors(isChecked) {
    $('label[for="max-quality"]').style.cursor = isChecked ? 'not-allowed' : 'pointer';
    $('label[for="min-quality"]').style.cursor = isChecked ? 'not-allowed' : 'pointer';
    selectMaxQuality.disabled = isChecked;
    selectMinQuality.disabled = isChecked;
};

selectOnlyAudio.addEventListener("change", (e) => {
    const isChecked = e.target.checked;
    videoData['onlyAudio'] = isChecked;
    changeCursorSelectors(isChecked);

    if (isChecked) {
        selectMaxQuality.checked = false;
        selectMinQuality.checked = false;
        infoText.textContent = '¡Tu audio está listo para descargarse!';
        downloadButton.textContent = 'Descargar audio';
    } else {
        selectMaxQuality.checked = true;
        infoText.textContent = prevTexts.prevInfo;
        downloadButton.textContent = prevTexts.prevBtn;
    }
});

selectMinQuality.addEventListener("input", () => {
    videoData['resolution'] = 'lower';
    infoText.textContent = "Tu vídeo estará listo a 360p, ¡dale a descargar vídeo!";
});

selectMaxQuality.addEventListener("input", () => {
    videoData['resolution'] = 'higher';
    infoText.textContent = prevTexts.prevInfo;
});

inputUrl.addEventListener('change', (e) => {
    videoData['url'] = e.target.value;
});

downloadButton.onclick = () => {
    if (!videoData.url) {
        setError(errors.not_url);
        return;
    };
    if (!validateURL(videoData.url)) {
        setError(errors.invalide_url);
        return;
    }
    window.electron.send('run-python-script', videoData);
    spinner.classList.remove("hidden");
}

window.electron.receive('python-script-done', (isDownload) => {
    spinner.classList.add('hidden');
    if (isDownload) {
        setDoneDownload();       
    }else{
        setError(errors.errorDownload);
    }
});

window.electron.receive('python-script-error', (error)=>{
    console.error(error);
});