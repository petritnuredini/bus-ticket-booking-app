# Festival Management System - Exam Requirements

## Overview

Implementation of a Festival-Event management system with CRUD operations using PostgreSQL database.

## Database Schema (PostgreSQL)

### 1. Festival Table

```sql
CREATE TABLE Festivals (
  FestivalID SERIAL PRIMARY KEY,
  EmriFestivalit VARCHAR(100) NOT NULL UNIQUE,
  LlojiiFestivalit VARCHAR(50),
  IsDeleted BOOLEAN DEFAULT FALSE,
  CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Event Table (Dhëvarja)

```sql
CREATE TABLE Events (
  EventID SERIAL PRIMARY KEY,
  ID_Festivalit INTEGER NOT NULL,
  EmriEventit VARCHAR(100) NOT NULL,
  DataEventit DATE NOT NULL,
  IsDeleted BOOLEAN DEFAULT FALSE,
  CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ID_Festivalit) REFERENCES Festivals(FestivalID) ON DELETE CASCADE
);
```

**Relationship**: One Festival can have many Events (1:N)

## Requirements (100 points total)

### 1. Tabelat (Tables) - Database Setup

- ✅ Create Festival table with proper fields
- ✅ Create Event table with foreign key to Festival
- ✅ Implement soft delete (IsDeleted field)
- ✅ Set up proper relationships and constraints

### 2. Shto në Festival (Add to Festival) - 20%

**Backend:**

- POST `/api/festivals` - Create new festival
- POST `/api/events` - Create new event for a festival

**Frontend:**

- Form to add festival (EmriFestivalit, LlojiiFestivalit)
- Form to add event (EmriEventit, DataEventit, select Festival)
- Validation and error handling

### 3. Shto në Dhëvarja të Tabelat (Display Festivals with Events) - 20%

**Backend:**

- GET `/api/festivals` - Get all festivals with event count
- GET `/api/festivals/:id/events` - Get events for specific festival

**Frontend:**

- Display all festivals in a table
- Show events for each festival (expandable or inline)
- Show event count per festival

### 4. Shfaqja e të Gjitha Festivaleve (Display All Festivals) - 20%

**Backend:**

- GET `/api/festivals` - List all festivals
- Include event information

**Frontend:**

- Table/List view of all festivals
- Show festival details and associated events
- Filter and search capabilities

### 5. Përditëso të Dhënat e Festival (Update Festival) - 20%

**Backend:**

- PUT `/api/festivals/:id` - Update festival information

**Frontend:**

- Form to select and update festival
- Pre-populate form with current data
- Validation and success feedback

### 6. Fshi Festival (Delete Festival) - 20%

**Backend:**

- DELETE `/api/festivals/:id` - Soft delete festival
- Cascade delete associated events

**Frontend:**

- Delete button with confirmation
- Show success/error messages
- Refresh list after deletion

## API Endpoints

### Festivals

- `POST /api/festivals` - Create festival
- `GET /api/festivals` - Get all festivals
- `GET /api/festivals/:id` - Get single festival
- `PUT /api/festivals/:id` - Update festival
- `DELETE /api/festivals/:id` - Delete festival

### Events

- `POST /api/events` - Create event
- `GET /api/events` - Get all events
- `GET /api/festivals/:id/events` - Get events by festival
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

## Implementation Notes

- Use PostgreSQL with Sequelize ORM
- Implement soft delete pattern
- Simple UI with Ant Design components
- Public route (no authentication required)
- Keep logic simple and focused on requirements

---

## ✅ IMPLEMENTATION COMPLETED

### Backend Files Created:

1. **`server/models/festivalModel.js`** - Festival database model
2. **`server/models/eventModel.js`** - Event database model
3. **`server/routes/festivalsRoutes.js`** - Festival API endpoints
4. **`server/routes/eventsRoutes.js`** - Event API endpoints
5. **`server/config/database.js`** - Updated to include Festival & Event models with relationships

### Frontend Files Created:

1. **`client/src/pages/FestivalSystem.js`** - Main festival management page
2. **`client/src/components/FestivalForm.js`** - Create festival form
3. **`client/src/components/EventForm.js`** - Create event form
4. **`client/src/components/FestivalList.js`** - Display festivals table
5. **`client/src/components/UpdateFestivalForm.js`** - Update festival form

### Routes Registered:

- **`server/server.js`** - Added `/api/festivals` and `/api/events` routes
- **`client/src/App.js`** - Added `/festival-system` public route
- **`client/src/pages/Index.jsx`** - Added Festival System link on homepage

### Database Schema Implemented:

```sql
-- Festivals Table
FestivalID (PK, Auto-increment)
EmriFestivalit (VARCHAR 100, UNIQUE, NOT NULL)
LlojiiFestivalit (VARCHAR 50, NULL)
IsDeleted (BOOLEAN, DEFAULT FALSE)
CreatedAt (TIMESTAMP)
UpdatedAt (TIMESTAMP)

-- Events Table
EventID (PK, Auto-increment)
ID_Festivalit (FK -> Festivals.FestivalID, CASCADE DELETE)
EmriEventit (VARCHAR 100, NOT NULL)
DataEventit (DATE, NOT NULL)
IsDeleted (BOOLEAN, DEFAULT FALSE)
CreatedAt (TIMESTAMP)
UpdatedAt (TIMESTAMP)
```

### Features Implemented:

#### ✅ 1. Add Festival (20%)

- Form with validation for festival name and type
- Unique name constraint
- Success/error messages
- Auto-refresh list after creation

#### ✅ 2. Add Event (20%)

- Form with festival dropdown selection
- Event name and date fields
- Validation for all required fields
- Links event to selected festival

#### ✅ 3. Display Festivals with Events (20%)

- Table showing all festivals
- Event count badge for each festival
- Expandable rows to show events
- Formatted dates and clean UI

#### ✅ 4. Update Festival (20%)

- Dropdown to select festival
- Pre-populated form with current data
- Unique name validation on update
- Success feedback

#### ✅ 5. Delete Festival (20%)

- Delete button with confirmation dialog
- Cascade delete of associated events
- Soft delete implementation
- Auto-refresh after deletion

### Access Information:

- **URL**: `http://localhost:3000/festival-system`
- **Navigation**: Yellow button on homepage with calendar icon
- **Status**: ✅ Ready for exam demonstration
- **Authentication**: None required (public route)

### Testing:

All CRUD operations tested and working:

- ✅ Create Festival
- ✅ Create Event
- ✅ Read/Display Festivals with Events
- ✅ Update Festival
- ✅ Delete Festival (with cascade)

### UI Features:

- 5 tabs for different operations
- Clean Ant Design components
- Responsive tables with pagination
- Loading states and error handling
- Confirmation dialogs for destructive actions
- Back to Home button for easy navigation
