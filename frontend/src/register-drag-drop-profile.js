const dropArea = document.querySelector('.profile-picture-label');
const fileInput = document.querySelector('.profile-picture-field');

fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    console.log('Arquivo selecionado:', file.name);

    const reader = new FileReader();

    reader.onload = (event) => {
      dropArea.style.backgroundImage = `url('${event.target.result}')`;
    };

    reader.readAsDataURL(file);
  } else {
    console.log('Nenhum arquivo foi selecionado.');
  }
});

dropArea.addEventListener('dragover', (e) => {
  e.preventDefault(); // necessário pra permitir o drop
  dropArea.classList.add('dragover');
});

dropArea.addEventListener('dragleave', () => {
  dropArea.classList.remove('dragover');
});

dropArea.addEventListener('drop', (e) => {
  e.preventDefault();
  dropArea.classList.remove('dragover');

  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = function (event) {
      dropArea.style.backgroundImage = `url('${event.target.result}')`;
    };
    reader.readAsDataURL(file);

    // Se quiser que o input também receba esse arquivo (opcional)
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    fileInput.files = dataTransfer.files;
  } else {
    alert('Por favor, arraste uma imagem!');
  }
});
