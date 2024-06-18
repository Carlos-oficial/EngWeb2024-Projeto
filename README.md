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

- _Upvote_ ('Votar para cima')
- _Downvote_ ('Votar para baixo')
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

### Paginação

De modo a conseguir lidar com um possível elevado número de recursos, todas as páginas que listam recursos implementam paginação, ao nível da API, onde apenas os recursos da página atual são apresentados. Esta solução permite manter a eficiência da plataforma em contextos com grandes números de entradas na base de dados.

![Pagination](/assets/pagination.png)

O tamanho de uma página é definido por um número de recursos e pode ser configurado pelo utilizador em [lib/config.ts](/lib/config.ts).

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

## 🔒 Níveis de Acesso

A aplicação conta com 3 diferentes níveis de acesso, **Administrador**, **Produtor** e **Consumidor**, sendo os dois últimos dependentes de cada recurso individualmente, podendo um utilizador/administrador ser consumidor de um recurso e produtor de um outro.

Um utilizador administrador tem as seguintes permissões acrescidas:

- Editar recurso
- Eliminar recurso
- Arquivar/Desarquivar recurso (alterar visibilidade do recurso)
- Bloquear/Desbloquear recurso (bloquear a alteração da visibilidade por parte do utilizador produtor)
- Adicionar tipo de recurso
- Adicionar curso
- Adicionar unidade curricular

É responsabilidade do gestor da base de dados fornecer ou remover a permissão de administrador a um utilizador já existente.

Um utilizador produtor tem acesso às seguintes operações sobre os seus recursos:

- Editar
- Arquivar/Desarquivar
- Eliminar

Adicionalmente, a nossa aplicação permite a exitência de um utilizador **convidado**. Isto é, utilizadores não autenticados têm acesso à plataforma com acesso limitado às suas funcionalidades.

Um utilizador convidado é apenas consumidor de todos os recursos, podendo transferir os mesmos e visualizar todos os seus detalhes. Pode também visualizar os perfis de outros utilizadores e as suas interações. No entanto, um utilizador convidado **não** tem acesso às seguintes funcionalidades:

- Interagir com um recurso:
  - _Upvote_
  - _Downvote_
  - Comentar
  - 'Favoritar'
- Aceder à página de favoritos
- Submeter novos recursos

O utilizador é incentivado a autenticar-se no sistema quanto tenta aceder a funcionalidades exclusivas.

![NoPermission](/assets/nopermission.png)

Todos estes níveis de acesso estendem-se à API desenvolvida, que conta com verificações de sessão para assegurar a autenticação do utilizador que realiza o pedido e a proteção de _endpoints_ sensíveis.

## 🔗 REST API

A API desenvolvida conta com os seguintes _endpoints_, devidamente protegidos com autenticação através de _tokens_ de sessão, quando aplicável.

**Recursos**

- **POST /api/resources** - Submeter recurso
- **GET /api/resources/all/[page]** - Listar todos os recursos
- **GET /api/resources/popular/[page]** - Listar recursos visíveis (por popularidade)
- **GET /api/resources/newewst/[page]** - Listar recursos visíveis (por mais recentes)
- **GET /api/resources/count** - Obter número total de recursos
- **GET /api/resources/[rid]** - Obter recurso
- **PUT /api/resources/[rid]** - Editar recurso
- **DELETE /api/resources/[rid]** - Eliminar recurso
- **GET /api/resources/[rid]/comments** - Listar comentários do recurso
- **GET /api/resources/[rid]/download** - Transferir conteúdo do recurso
- **POST /api/resources/[rid]/hide** - Arquivar recurso
- **POST /api/resources/[rid]/show** - Desarquivar recurso
- **POST /api/resources/[rid]/lock** - Bloquear recurso
- **POST /api/resources/[rid]/unlock** - Desbloquear recurso
- **GET /api/resources/from/[uemail]/[page]** - Listar recursos do utilizador
- **GET /api/resources/from/[uemail]/count** - Obter número total de recursos do utilizador
- **GET /api/resources/ids/[page]** - Listar recursos pedidos
- **GET /api/resources/ids/[page]/count** - Obter número total de recursos pedidos

`page`: Página a ser obtida
`rid`: ID do recurso
`uemail`: Email do utilizador

---

**Utilizadores**

- **GET /api/users/[uemail]** - Obter dados do utilizador
- **PUT /api/users/[uemail]** - Editar dados do utilizador
- **POST /api/users/[uemail]/upvote** - _Upvote_ de um recurso
- **DELETE /api/users/[uemail]/upvote** - Remover _upvote_ de um recurso
- **POST /api/users/[uemail]/downvote** - _Downvote_ de um recurso
- **DELETE /api/users/[uemail]/downvote** - Remover _downvote_ de um recurso
- **GET /api/users/[uemail]/favorites** - Obter recursos favoritos do utilizador (IDs)
- **POST /api/users/[uemail]/favorites** - Adicionar recurso favorito
- **DELETE /api/users/[uemail]/favorites** - Remover recurso favorito

`uemail`: Email do utilizador

---

**Cursos**

- **GET /api/courses** - Listar cursos
- **POST /api/courses** - Adicionar curso

---

**Unidades Curriculares**

- **GET /api/subjects** - Listar unidades curriculares
- **POST /api/subjects** - Adicionar unidade curricular

---

**Tipos de Recurso**

- **GET /api/documentType** - Listar tipos de recurso
- **POST /api/documentType** - Adicionar tipo de recurso

---

**Autenticação**

- **/api/auth/...**

Gerido pela biblioteca **NextAuth.js**.

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

## 🛠️ Tecnologias & Ferramentas Utilizadas

O projeto foi desenvolvido de forma monolítica utilizando a _framework_ **Next.js** com TypeScript e TailwindCSS, que contém tanto a implementação da página web tanto a implementação de uma REST API, responsável por comunicar com a base de dados e realizar diversas operações. Para além disso, utilizamos a biblioteca de componentes **shadcn/ui** para auxiliar um desenvolvimento mais rápido e perfecionista dos diversos componentes da plataforma.

Foi utilizado **MongoDB** como base de dados para armazenar toda a informação relativa a recursos, utilizadores, interações, sessão, cursos, unidades curriculares e tipos de documentos. Já os ficheiros submetidos pelos utilizadores são armazenados localmente do lado do servidor, ficando públicos. Num contexto real, esta opção seria subsituída por o armazenamento dos ficheiros num serviço dedicado na nuvem como AWS ou outro, e seria fácil a transição para esse modelo a partir da implementação atual.

Para gestão de toda a autenticação do sistema foi utilizada a biblioteca **NextAuth.js**.

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

É necessário configurar um ficheiro `.env.local` com variáveis de ambiente necessárias ao funcionamento da aplicação, incluindo segredos. Na raíz do projeto, o ficheiro `.env.local.sample` apresenta uma template com as variáveis necessárias:

```
NEXTAUTH_SECRET = <your-generated-secret>
GITHUB_APP_CLIENT_ID = <your-github-app-client-id>
GITHUB_APP_CLIENT_SECRET = <your-github-app-client-secret>
MONGO_URI = <your-mongodb-connection-uri>
NEXTAUTH_URL = <your-website-url>
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
- [Getting Started with NextAuth.js](https://next-auth.js.org/getting-started/example)
- [Get Started with Docker](https://www.docker.com/get-started/)
- [shadcn/ui](https://ui.shadcn.com/docs)

## 👥 Equipa

- Carlos Ribeiro, A100761
- Diogo Matos, A100741
- Júlio Pinto, A100742
