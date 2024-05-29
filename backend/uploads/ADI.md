# Paradigmas representação de conhecimento
## Simbólico
- Baseia-se na lógica para representar conhecimento;
- Fundamenta o raciocínio na construção de sistemas de inferência;
## Não simbólico / conexionista
- Baseia o funcionamento do sistema na capacidade de aprender, generalizando;
- Resolve problemas com base em conhecimento passado ou dados sobre a resolução de outros problemas;

# Big Data
Termo popularizado para se referir a dados em grande quantidade e complexidade para serem tratados por abordagens tradicionais de computação.

- Volume
- Velocidade
- Variedade
- Variabilidade
- Valor

# Soft Computing vs Hard Computing

## Soft Computing
Tolerante a falhas, não exato, alguns exemplos são:
- Fuzzy Logic
- Redes Neuronais Artificiais
- Computação Genética e Evolutiva
- Raciocínio Probabilístico
- Particle Swarm Optimization
- Ant Colony

# Algoritmos genéticos
Acentam no princípio de aprendizagem iterativa, por gerações.

# Aprendizagem Automática
Paradigma de computação em que a característica essencial do sistema se revela pela sua
capacidade de aprender de modo autónomo e independente
## Com supervisão
Há uma noção clara e exta do resultado pretendido.
### Classificação
- ...
### Regressão

## Por reforço
Sabe-se se uma iteração é melhor que outra, mas não se sabe necessariamente a reposta _à priori_

## Sem supervisão
O algoritmo simplesmente procura padrões.
### Segmentação
### Redução

# Metodologias de análise de dados
## CRISP-DM
**CR**oss **I**ndustry **S**tandard **P**rocess for **D**ata **M**ining
Objetivos:
- Definir um processo de Análise de Dados para a indústria;
- Construir e disponibilizar ferramentas de apoio;
- Assegurar a qualidade dos projetos de Análise de Dados;
- Reduzir os conhecimentos específicos necessários para conduzir um processo de Análise de Dados
### Passos
![[image-removebg-preview.png]]
#### Business undersating
#### Data undersating
#### Data preparation
#### Modeling
#### Evaluation 
#### Deployment 



## SEMMA
**S**ample **E**xplore **M**odify **M**odel **A**cess

# Preparação de dados
O principal objetivo da preparação dos dados consiste em transformar os *data sets* por forma a que a informação neles contida esteja adequadamente exposta à ferramenta de análise de dados (AD);

Os dados têm de ser formatados para se adequarem a uma determinada ferramenta de AD;

Os dados recolhidos do “mundo real”:
- são incompletos;
- contêm lixo;
- podem conter inconsistências.
## Tarefas na preparação de dados
### Discretização/Enumeração
Permite destilar dados.
- Equal width binning
- Equal height binning
- 1R
- Baseado em entropia
- Baseado em impurezas
### Limpeza
### Integração
#### Transformação
- Alisamento (smoothing):
	- Remover lixo/ruído dos dados (binning, regressão,clustering);
- Agregação
	- Pressupõe que o resultado sumaria os dados iniciais (resumo de vendas trimestrais, durante 5 anos, em valores anuais)
- Generalização;
	 - Hierarquização de conceitos:
		- distrito → cidade → rua;
		- Valores diferentes: 18 → centenas → (largos) milhares
- Construção de Atributos;
	- Construção de novos atributos a partir de outros (cálculo do preço líquido baseado no preço ilíquido e no IVA);
- Uniformização;
	- Pretende evitar que atributos com uma gama alargada de valores sobressaiam em relação a outros atributos com menor quantidade de valores:
		- Normalização (normalization: [ 0;1 ]);
		- Padronização (standardization/Z-score normalization: ҧ 𝑥=0; ∂=1);
- Deteção de valores atípicos.

### Redução
Destilação dos dados