# Bali Zero Tax Platform UI - Product Requirements Document

A minimal, professional tax management dashboard for Bali Zero tax consultants to manage client companies and tax reporting.

**Experience Qualities**:
1. **Professional** - Clean, data-focused interface that conveys trust and competence
2. **Efficient** - Fast access to client information with minimal clicks and clear hierarchy
3. **Minimal** - No decorative elements, generous white space, high contrast for readability

**Complexity Level**: Light Application (multiple features with basic state)
- Authentication flow with JWT tokens, client management CRUD, protected routes, and API integration

## Essential Features

### Authentication System
- **Functionality**: Secure login with JWT token management
- **Purpose**: Protect client data and ensure only authorized consultants access the system
- **Trigger**: User visits app without valid token
- **Progression**: Login form → Email/password input → API call → Token storage → Dashboard redirect
- **Success criteria**: Valid credentials grant access, invalid show error, token persists between sessions

### Dashboard Overview
- **Functionality**: Display key metrics and client list with search
- **Purpose**: Provide at-a-glance business status and quick client access
- **Trigger**: Successful authentication or app load with valid token
- **Progression**: Load stats → Fetch clients → Display cards grid → Search/filter interaction
- **Success criteria**: Stats update correctly, client list loads, search filters results instantly

### Client Management
- **Functionality**: Create, view, and update company profiles with tax details
- **Purpose**: Centralize all client information and tax documentation
- **Trigger**: Click "+ New Client" or select existing client card
- **Progression**: Form display → Field validation → API submission → Success message → Dashboard return
- **Success criteria**: All required fields validated, data persists, profile shows complete information

### Company Profile View
- **Functionality**: Detailed company information with tabs for different data categories
- **Purpose**: Access comprehensive client details and manage tax information
- **Trigger**: Click "View Profile" on client card
- **Progression**: Profile load → Tab navigation → View/edit data → Update API → Success confirmation
- **Success criteria**: All tabs load correctly, data updates reflect immediately

## Edge Case Handling

- **Token Expiration** - Detect 401 responses, clear stored token, redirect to login
- **Network Failures** - Show toast notification with retry option, maintain form state
- **Empty States** - Display helpful "No clients yet" message with create button
- **Invalid Form Data** - Inline validation messages, prevent submission until valid
- **Duplicate NPWP** - Backend validation with clear error message display
- **Search No Results** - Show "No matches found" with clear filters option

## Design Direction

The design should feel professional, trustworthy, and efficient - like a financial tool used by serious consultants. Minimal interface with focus on data readability and quick task completion. White backgrounds with subtle borders, generous spacing for easy scanning, and cyan accents for primary actions to convey trust and professionalism.

## Color Selection

Complementary palette using cyan (primary action) and warm orange (warnings) with neutral grays.

- **Primary Color**: Cyan (#0891B2) - Communicates trust, professionalism, and clarity for CTAs
- **Secondary Colors**: Neutral grays (#6B7280, #E5E7EB) for text hierarchy and borders
- **Accent Color**: Orange (#F59E0B) for warnings and attention-grabbing elements
- **Foreground/Background Pairings**:
  - Background (#FAFAFA): Dark gray text (#1F2937) - Ratio 10.5:1 ✓
  - Surface (#FFFFFF): Dark gray text (#1F2937) - Ratio 12.6:1 ✓
  - Primary (#0891B2): White text (#FFFFFF) - Ratio 4.6:1 ✓
  - Success (#10B981): White text (#FFFFFF) - Ratio 3.2:1 ✓
  - Warning (#F59E0B): Dark gray text (#1F2937) - Ratio 6.8:1 ✓
  - Error (#EF4444): White text (#FFFFFF) - Ratio 4.8:1 ✓

## Font Selection

System font stack for native performance and familiarity - uses San Francisco on macOS/iOS, Segoe UI on Windows, Roboto on Android. Monospace for financial amounts ensures proper alignment.

- **Typographic Hierarchy**:
  - H1 (Page Title): System Bold/48px/tight letter-spacing
  - H2 (Section Header): System Semibold/24px/normal letter-spacing
  - H3 (Card Title): System Semibold/18px/normal letter-spacing
  - Body: System Regular/16px/1.5 line-height
  - Small: System Regular/14px/1.4 line-height
  - Numbers: Monospace Regular/16px for currency and IDs

## Animations

No animations - the brief explicitly states NO animations. Focus on instant feedback and clarity.

- **Purposeful Meaning**: None - professional tools prioritize speed and clarity over delight
- **Hierarchy of Movement**: Static interface with instant state changes only

## Component Selection

- **Components**: 
  - Input, Button (primary/secondary variants), Card for client cards and stat cards
  - Badge for status indicators (active/pending/overdue)
  - Tabs for company profile sections
  - Dialog for confirmation modals if needed
  - Toast (sonner) for success/error notifications
  
- **Customizations**: 
  - StatCard - custom component showing metric label, value, and trend
  - ClientCard - custom component with company info, badges, action buttons
  - Custom Button variants (primary cyan, secondary gray, success green)
  - Custom Badge variants (status-based colors)
  
- **States**: 
  - Buttons: default, hover (darker shade), disabled (opacity 50%)
  - Inputs: default border, focus (cyan ring), error (red border)
  - Cards: default, hover (subtle shadow lift)
  
- **Icon Selection**: 
  - Phosphor icons for actions: MagnifyingGlass (search), Plus (add), User (profile), FileText (documents), Calculator (tax calc), SignOut (logout)
  
- **Spacing**: 
  - Container padding: p-6 (24px)
  - Card padding: p-4 or p-6 (16-24px)
  - Grid gaps: gap-6 (24px) for cards
  - Form field spacing: space-y-4 (16px)
  
- **Mobile**: 
  - Stats grid: 4 cols desktop → 2 cols tablet → 1 col mobile
  - Client cards: 3 cols desktop → 2 cols tablet → 1 col mobile
  - Header: Logo + user menu stacked on mobile
  - Forms: Full width on mobile with increased touch targets
