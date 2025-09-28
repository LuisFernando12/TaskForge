import { Inject, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

export interface IProject {
  project: string;
  level: string;
  description: string;
  epics: IEpics;
}
export interface IEpics {
  title: string;
  stories: IStory[];
}

export interface IStory {
  title: string;
  acceptance_criteria: string[];
  tasks: string[];
}

export class AIService {
  private openai: OpenAI;
  private baseUrl: string;
  private apiKey: string;
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.getOrThrow('AI_BASE_URL');
    this.apiKey = this.configService.getOrThrow('AI_API_KEY');
    this.openai = new OpenAI({
      apiKey: this.apiKey,
      baseURL: this.baseUrl,
    });
  }
  async executePrompt(prompt: string): Promise<IProject> {
    try {
      const systemPrompt = `
      Você é um assistente especializado em engenharia de software e metodologias ágeis.
      Sua tarefa é quebrar um projeto macro em backlog no formato Scrum.
  
      Regras gerais:
      1. Analise a descrição do projeto e determine automaticamente se o nível é "iniciante" ou "avançado".
      - Iniciante → Projeto simples, sem termos técnicos avançados, voltado para aprendizado.
      - Avançado → Projeto com termos técnicos, frameworks, microserviços, arquitetura complexa.
      2. Organize o backlog em Épicos → Histórias de Usuário → Tasks técnicas.
      3. Sempre retorne APENAS JSON válido, sem explicações adicionais.
      4. Cada História deve conter critérios de aceitação.
      5. Adapte o nível de detalhe das tasks conforme o perfil do usuário:
        - Se o nível for "iniciante": use tasks simples, curtas, focadas em aprendizado e passos básicos.
        - Se o nível for "avançado": use tasks mais técnicas, detalhadas e voltadas para boas práticas e arquitetura.
      6. Estrutura obrigatória:
  
      {
        "project": "Título do Projeto",
        "level": "iniciante | avançado",
        "description": " descrição de explicação do projeto";
        "epics": [
          {
            "title": "Nome do épico",
            "stories": [
              {
                "title": "História de usuário",
                "acceptance_criteria": [
                  "Critério 1",
                  "Critério 2"
                ],
                "tasks": [
                  "Task 1",
                  "Task 2"
                ]
              }
            ]
          }
        ]
      }`;
      const response = await this.openai.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        model: 'models/gemini-2.0-flash',
        temperature: 0.3,
      });
      const project: IProject = JSON.parse(
        response.choices[0].message.content
          .replace('```json', '')
          .replace('```', ''),
      );
      return project;
    } catch (error) {
      throw new InternalServerErrorException(
        error.message ? error.message : error,
      );
    }
  }
}
