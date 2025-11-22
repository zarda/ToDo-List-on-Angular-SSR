# An experimental website: Collaborative Todo List Application

## What is it?

A modern web application that lets people create, manage, and **share** todo lists with their team members or family. Think of it like Google Docs, but for task lists - multiple people can work on the same list together.

## Key Features (What Users Can Do)

### 1. Personal Task Management

- Create multiple todo lists (e.g., "Work Projects", "Home Chores", "Shopping")
- Add tasks with optional due dates (click date button to set via calendar picker)
- Check off completed items
- Drag-and-drop to reorder tasks
- Search and filter tasks
- Switch between light/dark themes
- Visual indicators for overdue and due-soon tasks

### 2. Team Collaboration (Main Innovation)

- **Share lists with others** by simply entering their email
- Everyone with access can add, edit, or complete tasks
- See who has access to each list with profile pictures
- Owner controls who can access the list

### 3. Smart Organization

- Sort tasks by due date, creation date, or custom order
- Hide completed tasks to reduce clutter
- Quick search across all tasks

## Technical Architecture (Simplified)

```
┌─────────────────────────────────────────────┐
│         USER'S WEB BROWSER                  │
│  (Angular App - Beautiful Interface)       │
└─────────────────┬───────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────┐
│       GOOGLE FIREBASE CLOUD                 │
│  • Authentication (Secure Login)            │
│  • Database (Stores All Data)               │
│  • Security Rules (Access Control)          │
└─────────────────────────────────────────────┘
```

### Technology Stack

- **Frontend**: Angular 20 (Latest modern web framework from Google)
- **Backend**: Firebase (Google's cloud platform - no server maintenance needed)
- **Authentication**: Google Sign-In (users login with their Google account)
- **Database**: Firestore (Real-time cloud database)
- **Rendering**: Hybrid SSR/CSR (Server-Side Rendering for login, Client-Side Rendering for interactive todo lists)

## Why This Architecture?

### Benefits

1. **No Server Maintenance**: Firebase handles all infrastructure
2. **Scales Automatically**: Works for 10 users or 10,000 users
3. **Security Built-In**: Database rules ensure people only see their own data
4. **Fast & Modern**: Latest Angular version with best practices
5. **Real-time Updates**: Changes sync across all devices
6. **Low Cost**: Firebase free tier supports significant usage

### Business Value

- **Collaboration**: Teams can coordinate without meetings
- **Accessibility**: Works on any device with a browser
- **User-Friendly**: Clean, intuitive Material Design interface
- **Secure**: Industry-standard authentication and data protection

## How It Works (User Journey)

1. **Login**: User signs in with Google account
2. **Create Lists**: User creates lists like "Team Sprint Tasks"
3. **Add Tasks**: User adds items with due dates
4. **Share**: User shares list with teammate's email
5. **Collaborate**: Both users can now manage tasks together
6. **Track Progress**: Everyone sees real-time updates

## Current Status

- ✅ Fully functional core features
- ✅ Working theme switcher (light/dark)
- ✅ Sharing permissions resolved
- ✅ Inline calendar picker for due dates
- ✅ Visual status indicators (overdue/due soon)
- ✅ Test coverage improved
- ✅ Hybrid SSR/CSR rendering optimized
- ✅ i18n support (10 languages including login page)
- 📊 Version: Early release (0.7.21)

## User Permissions

| Action | Owner | Collaborator | Non-Member |
|--------|-------|--------------|------------|
| View List | ✓ | ✓ | ✗ |
| Add Todo | ✓ | ✓ | ✗ |
| Edit Todo | ✓ | ✓ | ✗ |
| Delete Todo | ✓ | ✓ | ✗ |
| Reorder Todos | ✓ | ✓ | ✗ |
| Rename List | ✓ | ✗ | ✗ |
| Delete List | ✓ | ✗ | ✗ |
| Share List | ✓ | ✗ | ✗ |
| Unshare List | ✓ | ✗ | ✗ |

## Data Structure

### Todo Lists

Each list contains:
- Name
- Owner information (email, photo)
- List of collaborators
- Creation date

### Todo Items

Each task contains:
- Task text
- Completion status
- Due date (optional, defaults to "Unknown" until set)
- Created/updated timestamps
- Custom order position
- Visual status indicators (overdue, due soon)

## Security Features

- **Firebase Authentication**: Google OAuth 2.0
- **Firestore Security Rules**: Enforce access control at database level
- **Owner Validation**: Only owners can modify list settings
- **Member-only Operations**: Tasks editable only by list members
- **Email Verification**: Users must exist in system to receive shares
- **Self-sharing Prevention**: Can't share lists with their own account

## Internationalization (i18n)

Supports **10 languages** with instant language switching via the globe icon in the navigation bar - no page reload required!

### Supported Languages

| Language | Native Name | Code |
|----------|-------------|------|
| English | English | en |
| Spanish | Español | es |
| French | Français | fr |
| German | Deutsch | de |
| Italian | Italiano | it |
| Portuguese | Português | pt |
| Korean | 한국어 | ko |
| Simplified Chinese | 简体中文 | zh-Hans |
| Traditional Chinese | 繁體中文 | zh-Hant |
| Japanese | 日本語 | ja |

### Key Features

- **Runtime switching** using ngx-translate - instant language changes
- **Browser detection** - automatically uses user's preferred language
- **localStorage persistence** - remembers user's choice
- **44 translated strings** across all UI components including login page and sharing features
- **Full login page localization** - welcome messages and authentication buttons in all languages

---

**In Simple Terms**: This is a **team-friendly todo list app** that combines the simplicity of a checklist with the power of real-time collaboration, built on enterprise-grade Google technology.
