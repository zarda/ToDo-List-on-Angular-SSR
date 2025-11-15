import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharingManagerComponent } from './sharing-manager.component';
import { TodoStore } from '../todo-list/todo.store';
import { signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

describe('SharingManagerComponent', () => {
  let component: SharingManagerComponent;
  let fixture: ComponentFixture<SharingManagerComponent>;
  let mockStore: any;
  let selectedListSignal: any;
  let showSharingManagerSignal: any;

  beforeEach(async () => {
    selectedListSignal = signal(null);
    showSharingManagerSignal = signal(false);

    mockStore = {
      selectedList: selectedListSignal,
      currentUser: signal(null),
      unsharingEmail: signal(null),
      unshareList: jasmine.createSpy('unshareList').and.resolveTo(),
      isSharing: signal(false),
      shareEmail: signal(''),
      setShareEmail: jasmine.createSpy('setShareEmail'),
      shareList: jasmine.createSpy('shareList').and.resolveTo(),
      isSharingList: signal(false),
      cancelSharing: jasmine.createSpy('cancelSharing'),
      startSharing: jasmine.createSpy('startSharing'),
      showSharingManager: showSharingManagerSignal,
      toggleSharingManager: jasmine.createSpy('toggleSharingManager'),
    };

    await TestBed.configureTestingModule({
      imports: [SharingManagerComponent, TranslateModule.forRoot()],
      providers: [
        { provide: TodoStore, useValue: mockStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SharingManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject TodoStore', () => {
    expect(component['store']).toBe(mockStore as TodoStore);
  });

  it('should have access to store methods', () => {
    expect(component['store']).toBeDefined();
    expect(typeof component['store']).toBe('object');
  });

  describe('Sharing Manager Toggle', () => {
    it('should display toggle button for expanding/collapsing members', () => {
      const list = {
        id: '1',
        name: 'Test List',
        ownerUid: 'user1',
        ownerEmail: 'owner@test.com',
        ownerPhotoURL: 'https://example.com/photo.jpg',
        collaborators: [],
        sharedWith: {},
        createdAt: new Date(),
      };
      selectedListSignal.set(list);
      fixture.detectChanges();

      const toggleButton = fixture.nativeElement.querySelector('.sharing-label-button');
      expect(toggleButton).toBeTruthy();
    });

    it('should call toggleSharingManager when toggle button is clicked', () => {
      const list = {
        id: '1',
        name: 'Test List',
        ownerUid: 'user1',
        ownerEmail: 'owner@test.com',
        ownerPhotoURL: 'https://example.com/photo.jpg',
        collaborators: [],
        sharedWith: {},
        createdAt: new Date(),
      };
      selectedListSignal.set(list);
      fixture.detectChanges();

      const toggleButton = fixture.nativeElement.querySelector('.sharing-label-button');
      toggleButton?.click();

      expect(mockStore.toggleSharingManager).toHaveBeenCalled();
    });

    it('should display expand_more icon when sharing manager is hidden', () => {
      const list = {
        id: '1',
        name: 'Test List',
        ownerUid: 'user1',
        ownerEmail: 'owner@test.com',
        ownerPhotoURL: 'https://example.com/photo.jpg',
        collaborators: [],
        sharedWith: {},
        createdAt: new Date(),
      };
      mockStore.selectedList = signal(list);
      showSharingManagerSignal.set(false);
      fixture.detectChanges();

      const icon = fixture.nativeElement.querySelector('.toggle-icon');
      expect(icon?.textContent?.trim()).toBe('expand_more');
    });

    it('should display expand_less icon when sharing manager is shown', () => {
      const list = {
        id: '1',
        name: 'Test List',
        ownerUid: 'user1',
        ownerEmail: 'owner@test.com',
        ownerPhotoURL: 'https://example.com/photo.jpg',
        collaborators: [],
        sharedWith: {},
        createdAt: new Date(),
      };
      mockStore.selectedList = signal(list);
      showSharingManagerSignal.set(true);
      fixture.detectChanges();

      const icon = fixture.nativeElement.querySelector('.toggle-icon');
      expect(icon?.textContent?.trim()).toBe('expand_less');
    });

    it('should display member avatars when sharing manager is hidden', () => {
      const list = {
        id: '1',
        name: 'Test List',
        ownerUid: 'user1',
        ownerEmail: 'owner@test.com',
        ownerPhotoURL: 'https://example.com/photo.jpg',
        collaborators: [
          { uid: 'user2', email: 'collab@test.com', photoURL: 'https://example.com/collab.jpg' }
        ],
        sharedWith: { 'collab@test.com': true },
        createdAt: new Date(),
      };
      mockStore.selectedList = signal(list);
      showSharingManagerSignal.set(false);
      fixture.detectChanges();

      const avatars = fixture.nativeElement.querySelectorAll('.member-avatars .avatar');
      expect(avatars.length).toBe(2); // Owner + 1 collaborator
    });

    it('should hide member chips when sharing manager is hidden', () => {
      const list = {
        id: '1',
        name: 'Test List',
        ownerUid: 'user1',
        ownerEmail: 'owner@test.com',
        ownerPhotoURL: 'https://example.com/photo.jpg',
        collaborators: [],
        sharedWith: {},
        createdAt: new Date(),
      };
      mockStore.selectedList = signal(list);
      showSharingManagerSignal.set(false);
      fixture.detectChanges();

      const memberChips = fixture.nativeElement.querySelector('.member-chips');
      expect(memberChips).toBeFalsy();
    });

    it('should show member chips when sharing manager is shown', () => {
      const list = {
        id: '1',
        name: 'Test List',
        ownerUid: 'user1',
        ownerEmail: 'owner@test.com',
        ownerPhotoURL: 'https://example.com/photo.jpg',
        collaborators: [],
        sharedWith: {},
        createdAt: new Date(),
      };
      mockStore.selectedList = signal(list);
      showSharingManagerSignal.set(true);
      fixture.detectChanges();

      const memberChips = fixture.nativeElement.querySelector('.member-chips');
      expect(memberChips).toBeTruthy();
    });
  });
});
