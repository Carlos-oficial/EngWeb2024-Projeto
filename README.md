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

### Aparência

| Light Mode                          | Dark Mode                         |
| ----------------------------------- | --------------------------------- |
| ![LightMode](/assets/full_page.png) | ![DarkMode](/assets/darkmode.png) |

A plataforma conta ainda com a escolha entre um modo de aparência clara ou escura que se estende ao longo de todo o sistema.

## 🛠️ Tecnologias & Ferramentas Utilizadas

O projeto foi desenvolvido de forma monolítica utilizando a _framework_ **Next.js** com TypeScript e TailwindCSS, que contém tanto a implementação da página web tanto a implementação de uma REST API, responsável por comunicar com a base de dados e realizar diversas operações. Para além disso, utilizamos a biblioteca de componentes **shadcn/ui** para auxiliar um desenvolvimento mais rápido e perfecionista dos diversos componentes da plataforma.

Foi utilizado **MongoDB** como base de dados para armazenar toda a informação relativa a recursos, utilizadores, interações, sessão, cursos, unidades curriculares e tipos de documentos. Já os ficheiros submetidos pelos utilizadores são armazenados localmente do lado do servidor, ficando públicos. Num contexto real, esta opção seria subsituída por o armazenamento dos ficheiros num serviço dedicado na nuvem como AWS ou outro, e seria fácil a transição para esse modelo a partir da implementação atual.

## 🪚 Arquitetura Da Aplicação

<!-- ### Sobre o SharePoint

No intuito da cadeira de Engenharia Web, desenvolvemos o **SharePoint**. O intuito principal desta plataforma é servir a comunidade académica com diferentes materiais de estudo e apoio para qualquer tipo de unidade curricular que tenham.

Ao longo do projeto utilizamos diferentes tecnologias. Inicialmente, planeamos o desenvolvimento desta aplicação ser feito em Python (Flask) + JavaScript (NextJS), porém acabamos por decidir avançar com Typescript (NextJS), tanto para o _backend_ como para o _frontend_. Para além disso também utilizamos TailwindCSS e a biblitoeca shadcn de maneira a tornar o desenvolvimento do _frontend_ mais rápido.

Para bases de dados, utilizámos MongoDB para guardar todos os dados de utilizadores e todos os metadados dos ficheiros. Os ficheiros em si foram guardamos localmente.

Esta aplicação implementa diversos dos requesitos pedidos, sendo a criação e interação com posts um dos mais pertinente. Os utilizadores conseguem interagir de diversas maneiras com os conteúdos, podendo dar _upvote_ (like) ou _downvote_ ao mesmo, comentar sobre o recurso ou até mesmo guardá-lo como favorito. De maneira a tornar a pesquisa destes mais fácil, os utilizadores têm também a seu dispor diversos filtros e um motor de pesquisa. Mais à entramos em mais detalhes quanto a todos os requisitos.

Neste relatório vamos explicar as ferramentas e tecnologias usadas, a arquitetura que implementamos, tal como a maneira como lidamos com os nossos dados. -->

## Pré-Requisitos e Utilização

Para correr este projeto é necessário ter:

- Docker
- Docker Compose
- Node

## Requisitos Implementados

## Arquitetura da Aplicação

## Tratamento de Dados

## Considerações Finais

## 👥 Equipa

- Carlos Ribeiro, A100761
- Diogo Matos, A100741
- Júlio Pinto, A100742
