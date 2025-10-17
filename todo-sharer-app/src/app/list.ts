import { Timestamp } from '@angular/fire/firestore';
import { User } from './user';

export interface List {
  id: string;
  name: string;
  ownerUid: string;
  ownerEmail: string;
  ownerPhotoURL: string;
  createdAt: Timestamp;
  sharedWith: string[]; // Array of emails
  collaborators?: User[]; // Array of User objects for display
}