export interface AudioRecord {
  id: number;
  translationId: number;
  userId: number;
  audioUrl: string;
  createdAt: string;
}

export interface CreateAudioInput {
  translationId: number;
}
