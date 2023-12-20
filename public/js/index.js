function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
    });
}

function updateCurrImage() {
    fetch('/latestImage')
    .then(res => res.json())
    .then(json => {
        const imgElm = document.getElementById('currImage');
        imgElm.src = json.image;
    })
    .catch(err => {});
}

document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('uploadImage').addEventListener('click', ev => {
        const inp = document.createElement('input');
        inp.accept = 'image/*';
        inp.type = 'file';
        
        inp.addEventListener('change', async ev => {
            const file = ev.target.files[0];
            // let b64Image = await toBase64(file);
            let b64Image = await toBase64(file);
            let question = document.getElementById('question').value;

            let split = b64Image.split('base64,');
            split.shift();
            b64Image = split.join('base64,');

            fetch('/uploadImage', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    image: b64Image,
                    question: question
                })
            })
            .then(res => res.json())
            .then(res => {
                const diag = document.getElementById('diagnosis');
                if(res.error) diag.value = res.error;
                else diag.value = res.message;
                updateCurrImage();
            })
            .catch(err => {
                diag.value = 'Error...';
            });
        });

        inp.click();
    });

    document.getElementById('captureImage').addEventListener('click', async ev => {
        fetch('/captureImage', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(res => {
            const diag = document.getElementById('diagnosis');
            if(res.error) diag.value = res.error;
            else diag.value = res.message;
            updateCurrImage();
        })
        .catch(err => {
            diag.value = 'Error...';
        });
    });
});

function sensor1Click() {
    let sensor1 = document.getElementById('sensor1');
    fetch('/getSensor1', {
        method: 'POST'
    })
    .then(res => res.json())
    .then(res => {
        if(res.error) sensor1.innerText = res.error;
        else sensor1.innerHTML = res.message;
    })
    .catch(err => {
        sensor1.innerText = 'Error...';
    });
}

function sensor2Click() {
    let sensor2 = document.getElementById('sensor2');
    fetch('/getSensor2', {
        method: 'POST'
    })
    .then(res => res.json())
    .then(res => {
        if(res.error) sensor2.innerText = res.error;
        else sensor2.innerHTML = res.message;
    })
    .catch(err => {
        sensor2.innerText = 'Error...';
    });
}
