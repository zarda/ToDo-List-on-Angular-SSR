import { Timestamp } from '@angular/fire/firestore';
import { User } from './user';

export interface List {
  id: string;
  name: string;
  ownerUid: string;
  ownerEmail: string;
  ownerPhotoURL: string;
  createdAt: Timestamp;
  sharedWith: Record<string, boolean>; // Map of emails to true
  collaborators?: User[]; // Array of User objects for display
}