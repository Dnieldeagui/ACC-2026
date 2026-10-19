# OCTOLER
O projeto corresponde a uma ferramenta de auxílio na alfabetização no ensino primário, faixa de 3 a 5 anos, desenvolvida para atender às crianças com alta familiaridade de tecnologias. O objetivo principal do Projeto é modernizar a experiência de aprendizado por meio da interatividade, como um reforço e suporte ao ensino. Inspirado no método eficiente e interativo de ensino do Duolingo, o sistema, Octoler, utiliza mapas que mostram a progressão dos exercícios. Por meio da plataforma, os alunos podem realizar as atividades propostas e verificar o próprio rendimento que tem na plataforma. Além disso, a plataforma autoriza aos professores a possibilidade de criar e lançar as próprias atividades customizando-as para cada tipo de rendimento para os alunos, mudando a dinamicidade do docente e discente. Para a criação das atividades de maneira simples, prática e objetiva, utiliza-se a plataforma Wordwall, utilizada como suporte, que entrega aos educadores uma estrutura base onde eles podem montar as próprias atividades para seus alunos

## Tecnologias e Linguagens usadas no projeto
A Octoler é um site, e para o seu desenvolvimento, foram usadas a linguagem de marcação HTML, linguagem de estilização CSS e linguagens de programação Javascript e Python.

<img width="945" height="210" alt="image" src="https://github.com/user-attachments/assets/c4beaab5-9ee7-4e3d-af74-cdd87171e7e8" />

Além das linguagens usadas, nosso projeto também usa de algumas bibliotecas presentes na linguagem de programação Python.

<img width="945" height="658" alt="image" src="https://github.com/user-attachments/assets/7eda43e9-1e9d-4f64-93c3-27470885ec0f" />

Entre as bibliotecas, utilizamos a microframework web Flask para Python, no desenvolvimento do back-end e na comunicação entre o front-end, back-end e o servidor; a biblioteca SQLite3 foi usada para gerenciar o banco de dados, permitindo realizar as operações de CRUD; a biblioteca hashlib foi utilizada para gerar hashes das senhas, utilizadas para garantir uma maior segurança; a biblioteca nativa do Python secrets utilizada para gerar valores aleatórios; e a biblioteca string foi utilizada para manipular de forma avançada textos.

Além disso, utilizamos o Ambiente de Desenvolvimento Integrado (IDE) “VSCode”, editor de código-fonte. Também utilizamos o serviço do “GitHub”, plataforma web de repositórios de códigos, utilizada no desenvolvimento do projeto e seu versionamento.

## Requisitos do Sistema
Para a execução e sustentação do site em um servidor (backend), o sistema exige um sistema operacional como o Windows, Linux ou MacOS. Além disso, o site é baseado nas linguagens JavaScript, Python 3.14.7, HTML5 e CSS3, utilizando a microframework web Flask 3.1.3 e as bibliotecas do hashlib, secrets e strings. Além disso, para sustentar o site, é requerido uma conexão estável com a internet para garantir a sincronização de dados e funcionamento correto.
	
No ambiente do cliente, o site requer para a sua navegação através dos dispositivos um sistema operacional como o Windows, Linux, MacOS, Android ou IOS. O acesso é feito por navegadores modernos como o Google Chrome, Mozilla Firefox, Microsoft Edge ou Safari. Além disso, é necessário o acesso a uma internet estável, para realizar carregamentos e garantir o funcionamento do site.

## Arquitetura e modelagem do sistema
<img width="945" height="972" alt="image" src="https://github.com/user-attachments/assets/f5a1a4f6-1111-43ab-8ed9-ccd6d62c43c6" />

A Figura ilustra o diagrama da arquitetura do sistema. Ela define os blocos que compõem o software e como se comunicam entre si. Na primeira camada (Usuário), é a camada em que o usuário entra no site, apresentando a interface do site. Após entrar na interface do site, é apresentado para o usuário as opções de login e cadastro, seguidas de todas as funcionalidades do site. O frontend do site se comunica com o backend através da microframework web do Flask, além disso, as funções de segurança do site são feitas principalmente pelas bibliotecas Hashlib e Secrets do Python. O banco de dados do site é gerenciado pela biblioteca Python do SQLite3, onde são gerenciados dados como os do usuário e das atividades.

<img width="945" height="568" alt="image" src="https://github.com/user-attachments/assets/39bd274c-804c-43cc-a0a5-53fd050e27bb" />

A Figura ilustra o diagrama do banco de dados do sistema. Ela é composta pelas tabelas ALUNOS, PROFESSORES, MENSAGENS, TURMAS, ATIVIDADES e ALUNOS_TURMA. Todas as tabelas possuem um id próprio como chave primária, além disso, as tabelas ALUNOS e PROFESSORES possuem o id_session, que identificam a sessão deles no site. Os professores possuem 1 ou muitas turmas, que possuem 1 ou muitas atividades. Os alunos participam de 1 ou muitas turmas, que são ligadas através da tabela pivô ALUNOS_TURMA que possui chaves compostas. Os alunos e os professores podem fazer 1 ou muitas mensagens.

## CONCLUSÃO
No cenário educacional atual, fica evidente que a presença da tecnologia nas escolas tem sido algo bem debatível para garantir uma aprendizagem de qualidade, especialmente no contexto educacional inclusivo. Os problemas estruturais, falta de uma boa formação do Educador e a sobrecarga de trabalho e falta alcance das ferramentas digital dificultam uma aula de qualidade para alunos com deficiências. Nesse contexto, a plataforma Octoler surge como uma solução para esses problemas direcionado a tecnologia para a alfabetização de crianças com 3 a 5 anos. Ao utilizar metodologias consolidadas como por exemplo: Comunicação Aumentativa e Alternativa (CAA), o sistema PECS e trilhas de aprendizagem personalizadas. O projeto transforma o uso de dispositivos móveis em um processo pedagógico seguro e acessível. Em suma, Octoler e um reforço a alfabetização inclusiva exige mais do que o método padrão exige também estrutura e suporte adequado aos educadores. O projeto não apenas facilita o acesso ao conhecimento na infância, mas também estabelece maneiras para reduzir a dificuldade de Aprendizagem e a inclusão no percurso escolar das crianças.
