import { readToken } from '@/features/auth/infrastructure/auth.service';
import { ApiError } from '@/shared/infrastructure/http-client';
import {
  generateId,
  readCollection,
  simulateLatency,
  writeCollection,
} from '@/shared/infrastructure/mock-db';
import { matchTopic } from '../domain/knowledge';

// Simula o Módulo de Chatbot: cada pergunta vira uma ConsultaChatbot do cidadão (diagrama de classes)

export interface ChatEntry {
  id: string;
  citizenId: string;
  question: string;
  topicId: string;
  createdAt: string;
}

const COLLECTION = 'chatbot';
export const MAX_QUESTION_LENGTH = 300;

export const assistantService = {
  async history(token: string): Promise<ChatEntry[]> {
    const { sub } = readToken(token);
    return (readCollection<ChatEntry>(COLLECTION) ?? []).filter((e) => e.citizenId === sub);
  },

  async ask(token: string, question: string): Promise<ChatEntry> {
    const { sub, role } = readToken(token);
    if (role !== 'citizen') throw new ApiError('Apenas cidadãos podem usar o assistente.', 403);
    const text = question.trim();
    if (!text || text.length > MAX_QUESTION_LENGTH) {
      throw new ApiError(`A pergunta deve ter até ${MAX_QUESTION_LENGTH} caracteres.`, 422);
    }

    await simulateLatency(700);
    const entry: ChatEntry = {
      id: generateId(),
      citizenId: sub,
      question: text,
      topicId: matchTopic(text).id,
      createdAt: new Date().toISOString(),
    };
    writeCollection(COLLECTION, [...(readCollection<ChatEntry>(COLLECTION) ?? []), entry]);
    return entry;
  },

  async clear(token: string): Promise<void> {
    const { sub } = readToken(token);
    writeCollection(
      COLLECTION,
      (readCollection<ChatEntry>(COLLECTION) ?? []).filter((e) => e.citizenId !== sub),
    );
  },
};
