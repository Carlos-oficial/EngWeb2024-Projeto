import { DocumentTypeDB } from '@/lib/types';
import DocumentType from '@/models/DocumentType';

export const list = () => {
  return DocumentType.find().exec();
};

export const listByIds = (ids: string[]) => {
  return DocumentType.find({ _id: { $in: ids } }).exec();
};

export const get = (id: string) => {
  return DocumentType.findById(id).exec();
};

export const create = (documentType: Partial<DocumentTypeDB>) => {
  return DocumentType.create(documentType);
};

export const update = (id: string, documentType: Partial<DocumentTypeDB>) => {
  return DocumentType.findByIdAndUpdate(id, documentType).exec();
};
