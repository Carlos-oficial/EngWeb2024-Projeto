![UniShareBanner](/assets/banner.png)

# 🎓 UniShare

A **UniShare** é uma plataforma web desenvolvida no âmbito da unidade curricular de Engenharia Web no ano letivo de 2023/2024. O seu principal objetivo é ser um _hub_ de materiais de apoio ao estudo para toda a comunidade académica e para qualquer curso ou unidade curricular.

## 📒 Funcionalidades

### Dashboard

![Dashboard](/assets/full_page.png)

O foco central da plataforma é o _dashboard_, onde o utilizador pode pesquisar, filtrar e adicionar recursos, assim como facilmente navegar para qualquer outra página ou diálogo do sistema. Toda a informação mais importante está contida na página inicial do dashboard.

### Navbar

![Navbar](/assets/navbar.png)

A _navbar_ permite ao utilizador navegar entre diferentes visões da página principal do dashboard.

A página **Popular** apresenta os recursos ordenados por ordem decrescente de popularidade, ou seja, os recursos com mais interações serão apresentados mais acima na lista. Esta unidade de popularidade é calculada através de um algoritmo onde cada tipo de interação tem um diferente peso na popularidade do recurso.

A página **Newest** apresenta os recursos adicionados mais recentemente à plataforma, permitindo visualizar rapidamente as últimas adições por parte dos utilizadores.

Para além disso, a _navbar_ permite ao utilizador aceder à sua página de perfil, clicando no seu nome no canto superior esquerdo. Exploramos esta página mais à frente.

### Favoritos

![Favorites](/assets/favorites.png)

A página de favoritos permite a um utilizador **autenticado** visualizar os recursos que 'favoritou' ao longo do tempo.

### Search Bar

![SearhBar](/assets/searchbar.png)

A barra de pesquisa permite ao utilizador pesquisar o grande conjunto de recursos visíveis no ecrã através de palavras chave. O utilizador pode pesquisar por qualquer palavra de qualquer campo principal de um recurso, nomeadamente pelo seu título, descrição, hashtags, curso, cadeira, tipo, data de criação, utilizador e até pelo formato do documento (PDF, ZIP, etc).

### Filtros

| Padrão                          | Pesquisa por Curso                         | Pesquisa por UC                           |
| ------------------------------- | ------------------------------------------ | ----------------------------------------- |
| ![Filters](/assets/filters.png) | ![FiltersCurso](/assets/filter_search.png) | ![FiltersUC](/assets/subjects_filter.png) |

Os filtros permitem uma fácil e rápida filtragem dos recursos apresentados de acordo com o seu tipo, curso ou unidade curricular. O utilizador pode facilmente pesquisar o curso ou unidade curricular no menu de seleção de cada um destes.

### Adicionar Recurso

![AddResource](/assets/resource_dialog.png)

O botão **Add Resource** leva utilizadores autenticados para um diálogo onde podem facilmente submeter o seu recurso e preencher as informações necessárias. Também aqui os campos de escolha de curso e unidade curricular permitem a pesquisa pelas opções.

Um utilizador **admin** pode, neste diálogo, adicionar novas opções de tipo de recurso, curso ou unidade curricular.

### Resource Card

![ResourceCard](/assets/card.png)

O _card_ de um recurso funciona como uma porta para um conjunto de interações com o utilizador. De uma forma compacta apresenta todas as informações essenciais relativas ao recurso e à interação da restante comunidade com o mesmo. Permite também que o utilizador facilmente interaja com o recurso e aceda a configurações do mesmo.

Um recurso contém um conjunto de atributos essenciais:

- Tipo (Relatório, Apontamento, Teste, Exame, etc) (Expansível)
- Título
- Descrição (Opcional)
- Hashtags (Opcional)
- Unidade Curricular
- Curso

Existe uma variedade de interações possíveis com um recurso:

- Upvote ('Votar para cima')
- Downvote ('Votar para baixo')
- Comentar
- Transferir
- 'Favoritar'

| Utilizador Padrão               | Admin                                      |
| ------------------------------- | ------------------------------------------ |
| ![Actions](/assets/actions.png) | ![AdminActions](/assets/actions_admin.png) |

Caso o utilizador seja dono do recurso, tem acesso a um conjunto de opções: **Editar**, **Arquivar** ou **Eliminar**. Caso seja um utilizador administrador do sistema, tem ainda a opção de **Bloquear** o recurso, não permitindo que a sua visibilidade seja alterada.

![Hover](/assets/hover.png)

Finalmente, é possível ver detalhes acerca do utilizador publicador do recurso facilmente através de um _hover_ do rato sobre o seu nome.

### Comentários

![Comment](/assets/comment.png)

O clique no ícone de comentário de um recurso leva para um diálogo que permite a qualquer utilizador ingressar numa discussão relativa a um determinado recurso nos comentários, ou simplesmente deixar uma mensagem de agradecimento.

### Página de Recurso

![ResourcePage](/assets/resourcepage.png)

A página de recurso permite ao utilizador uma visão expandida da informação do recurso, com acesso à lista completa de comentários efetuados no mesmo e até a uma pré-visualização do conteúdo do ficheiro, para formatos compatíveis (PDF, PNG, JPEG ou JPG).

### Editar Recursos

![Edit](/assets/edit_resource.png)

O clique no ícone de edição do submenu de um recurso leva para um diálogo que permite ao utilizador facilmente editar as principais informações do seu recurso publicado através de uma interface familiar, não sendo possível editar o ficheiro publicado mas apenas as meta informações associadas ao mesmo.

### Página de Perfil

![Profile](/assets/profile.png)

Um utilizador consegue aceder à sua página de perfil ou à de qualquer outro utilizador através de um clique no seu nome em qualquer local da interface. Esta página apresenta os recursos que o utilizador publicou, os seus favoritos, os comentários que realizou e ainda os recursos que 'votou para cima' ou _upvoted_.

![ProfileComments](/assets/profile_comments.png)

Se o utilizador estiver a visualizar o seu próprio perfil, tem ainda a opção de editar o perfil ou aceder às configurações da sua conta.

| Editar Perfil                            | Configurações de Conta                           |
| ---------------------------------------- | ------------------------------------------------ |
| ![EditProfile](/assets/edit_profile.png) | ![AccountSettings](/assets/account_settings.png) |

### Entrar / Registar

| Sign in                       | Sign up                       |
| ----------------------------- | ----------------------------- |
| ![Signin](/assets/signin.png) | ![Signup](/assets/signup.png) |

O utilizador tem a opção de se registar na conta utilizando um email + password ou então utilizando um serviço externo como o _GitHub_.

As passwords são armazenadas de forma segura através da utilização de _hashing_ com a ajuda do pacote _bycript_ do npm.

### Aparência

| Light Mode                          | Dark Mode                         |
| ----------------------------------- | --------------------------------- |
| ![LightMode](/assets/full_page.png) | ![DarkMode](/assets/darkmode.png) |

A plataforma conta ainda com a escolha entre um modo de aparência clara ou escura que se estende ao longo de todo o sistema.

## 🛠️ Tecnologias & Ferramentas Utilizadas

O projeto foi desenvolvido de forma monolítica utilizando a _framework_ **Next.js** com TypeScript e TailwindCSS, que contém tanto a implementação da página web tanto a implementação de uma REST API, responsável por comunicar com a base de dados e realizar diversas operações. Para além disso, utilizamos a biblioteca de componentes **shadcn/ui** para auxiliar um desenvolvimento mais rápido e perfecionista dos diversos componentes da plataforma.

Foi utilizado **MongoDB** como base de dados para armazenar toda a informação relativa a recursos, utilizadores, interações, sessão, cursos, unidades curriculares e tipos de documentos. Já os ficheiros submetidos pelos utilizadores são armazenados localmente do lado do servidor, ficando públicos. Num contexto real, esta opção seria subsituída por o armazenamento dos ficheiros num serviço dedicado na nuvem como AWS ou outro, e seria fácil a transição para esse modelo a partir da implementação atual.

## 📦 Export / Import

Foram desenvolvidos dois _bash scripts_ responsáveis por a qualquer momento exportar ou importar o estado atual de todo o sistema, desde o conteúdo da base de dados até aos ficheiros armazenados localmente no servidor. O conteúdo exportado é guardado numa pasta _snapshot_ que inclui a data da exportação no seu nome. Para importar um estado, basta fornecer como argumento o caminho para a pasta que contém a _snapshot_ pretendida.

Os _scripts_ devem ser executados a partir da raíz do projeto da seguinte forma:

**Export**

```bash
./scripts/export.sh app
```

**Import**

```bash
./scripts/import.sh <caminho-para-snapshot>
```

Esta funcionalidade é essencial para, por exemplo, efetuar _backups_ regulares de informações críticas, algo que é fundamental num contexto real.

## 📥 Pré-Requisitos

A execução da aplicação requer o seguinte _software_:

- [Node.js 20.11.1+](https://nodejs.org/en/download/)
- mongosh
- mongodb-tools
- docker
- docker-compose

## 🔧 Setup

É necessário instalar todas as dependências.

```bash
npm install
```

## 🔨 Development

Executar o projeto num ambiente conteinerizado.

```
docker compose up
```

> [!NOTE]  
> Utilizar a _flag_ `--build` numa primeira execução.

Formatar o código.

```bash
npm run format
```

## 🔗 Referências

- [Getting Started with React](https://reactjs.org/docs/getting-started.html)
- [Learn Next.js](https://nextjs.org/learn)
- [Get Started with Docker](https://www.docker.com/get-started/)
- [shadcn/ui](https://ui.shadcn.com/docs)

## 👥 Equipa

- Carlos Ribeiro, A100761
- Diogo Matos, A100741
- Júlio Pinto, A100742
