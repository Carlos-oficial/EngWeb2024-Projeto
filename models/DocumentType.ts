import { model, models, Schema } from 'mongoose';

interface IDocumentType {
  name: string;
}

const DocumentTypeSchema = new Schema<IDocumentType>({
  name: { type: String, unique: true, required: true },
});

const DocumentType =
  models.DocumentType ||
  model<IDocumentType>('DocumentType', DocumentTypeSchema);

export default DocumentType;
