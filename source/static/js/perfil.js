document.addEventListener('DOMContentLoaded', () => {
    
    // Variáveis do Cropper
    let cropper = null;
    const inputFoto = document.getElementById('input-foto-real');
    const imagemParaRecortar = document.getElementById('imagem-para-recortar');
    const modalCropper = document.getElementById('modal-cropper');
    const btnConfirmarCorte = document.getElementById('btn-confirmar-corte');
    const btnCancelarCorte = document.getElementById('btn-cancelar-corte');

    // Quando clica na foto, abre o seletor de arquivos do computador
    const containerFoto = document.getElementById('container-foto-perfil');
    if (containerFoto) {
        containerFoto.addEventListener('click', () => {
            inputFoto.click();
        });
    }

    // Quando o usuário escolhe uma foto
    if (inputFoto) {
        inputFoto.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagemParaRecortar.src = e.target.result;
                    modalCropper.classList.remove('hidden');

                    if (cropper) {
                        cropper.destroy();
                    }
                    
                    cropper = new Cropper(imagemParaRecortar, {
                        aspectRatio: 1, 
                        viewMode: 1,    
                        dragMode: 'move',
                        autoCropArea: 1,
                        restore: false,
                        guides: false,
                        center: false,
                        highlight: false,
                        cropBoxMovable: false,
                        cropBoxResizable: false,
                        toggleDragModeOnDblclick: false,
                    });
                };
                reader.readAsDataURL(file);
            }
            inputFoto.value = ''; 
        });
    }

    // Botão Cancelar do modal de recorte
    if (btnCancelarCorte) {
        btnCancelarCorte.addEventListener('click', () => {
            modalCropper.classList.add('hidden');
            if (cropper) cropper.destroy();
            cropper = null;
        });
    }

    // Botão Confirmar: Recorta a imagem e atualiza na tela
    if (btnConfirmarCorte) {
        btnConfirmarCorte.addEventListener('click', () => {
            if (!cropper) return;

            const canvas = cropper.getCroppedCanvas({
                width: 300,
                height: 300,
            });

            const imagemRecortadaURL = canvas.toDataURL('image/png');

            document.querySelector('.foto-perfil-grande').src = imagemRecortadaURL;

            const fotosNav = document.querySelectorAll('.profile-pic-nav');
            fotosNav.forEach(foto => {
                foto.src = imagemRecortadaURL;
            });

            localStorage.setItem('foto_perfil_salva', imagemRecortadaURL);

            modalCropper.classList.add('hidden');
            cropper.destroy();
            cropper = null;
        });
    }

    // Lógica de Salvar Perfil (Simulação)
    const formEditar = document.getElementById('form-editar-perfil');
    if (formEditar) {
        formEditar.addEventListener('submit', (e) => {
            alert('✅ Dados atualizados com sucesso!');
        });
    }

    // Lógica de Alterar Senha
    const formSenha = document.getElementById('form-alterar-senha');
    if (formSenha) {
        formSenha.addEventListener('submit', (e) => {
            const novaSenha = document.getElementById('senha-nova').value;
            const confirmarSenha = document.getElementById('senha-nova-confirmar').value;

            // 1. Se as senhas não coincidirem, BLOQUEIA o envio e avisa
            if (novaSenha !== confirmarSenha) {
                e.preventDefault(); 
                alert('⚠️ As senhas novas não coincidem!');
                return;
            }

            // 2. Se coincidirem, o JS não faz nada e o formulário é enviado para o Python.
            // O Python vai processar e recarregar a página (ou você pode mostrar o alerta aqui).
        });
    }

    // Ao carregar a página, verifica se tem foto salva e aplica
    const fotoSalva = localStorage.getItem('foto_perfil_salva');
    if (fotoSalva) {
        document.querySelectorAll('.foto-perfil-grande, .profile-pic-nav').forEach(img => {
            img.src = fotoSalva;
        });
    }
});