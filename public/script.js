const form = document.getElementById('file-converter-form');
const statusDiv = document.getElementById('status');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const fileInput = document.getElementById('file-input');
  const convertTo = document.getElementById('convert-to').value;

  if (fileInput.files.length === 0) {
    alert('Por favor, selecione um arquivo.');
    return;
  }

  const formData = new FormData();
  formData.append('file', fileInput.files[0]);
  formData.append('convertTo', convertTo);

  statusDiv.innerHTML = '<div class="loading-spinner"></div><div class="message">Convertendo arquivo...</div>';

  try {
    const response = await fetch('http://localhost:3000/convert', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Erro ao converter.');
    }

    const data = await response.json();
    const downloadUrl = data.downloadUrl;

    statusDiv.innerHTML = `
      <div class="message">Conversão concluída!</div>
      <a href="${downloadUrl}" target="_blank" download>Baixar Arquivo Convertido</a>
    `;
  } catch (error) {
    console.error(error);
    statusDiv.innerHTML = `<div class="message error">Erro ao converter o arquivo. Tente novamente.</div>`;
  }
});
