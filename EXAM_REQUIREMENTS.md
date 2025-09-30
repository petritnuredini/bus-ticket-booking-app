# Group-Member System Exam Requirements

## Database Schema

### Group Table
- **PK**: GroupID (Primary Key)
- **GroupName**: Name of the group
- **Description**: Description of the group

### Member Table  
- **PK**: MemberID (Primary Key)
- **Name**: Member name
- **Role**: Member role
- **FK**: GroupID (Foreign Key referencing Group.GroupID)

## Required Operations

### a) Group Management (Frontend & Backend)
Implement code for inserting a new Group with the following operations:
- Create form to insert new groups
- Backend API endpoint for group creation
- Proper validation and error handling

### b) Member Management (Frontend & Backend)
Implement code for inserting a new Member with the following operations:
- Create form to insert new members
- Backend API endpoint for member creation
- Dropdown to select which group the member belongs to
- Proper validation and error handling

**Note**: When inserting a Member, ensure the GroupID is properly referenced and the Group exists in the database.

### c) Display Groups and Members (Frontend & Backend)
Implement code to display all Groups and their Members:
- Show all groups in a list/table format
- Show all members for each group
- Proper data fetching from backend APIs

### d) Update Group Information (Frontend & Backend)
Implement code to update Group information:
- Form to edit group name and description
- Backend API endpoint for group updates
- Proper validation and error handling

**Note**: Ensure that when updating a Group, the form is populated with current data and the GroupID is properly maintained.

### e) Delete Members (Frontend & Backend)
Implement code to delete Members:
- Delete functionality for individual members
- Backend API endpoint for member deletion
- Proper confirmation dialogs
- Update UI after successful deletion

**Note**: Ensure that when deleting a Member, only the Member is removed from the database, and the Group remains intact with other members.

## Technical Requirements

### Backend (Node.js/Express)
- Use proper database models for Group and Member
- Implement RESTful API endpoints
- Proper error handling and validation
- Use appropriate HTTP status codes
- Implement proper foreign key relationships

### Frontend (React)
- Create reusable components for forms and lists
- Use Ant Design for consistent UI
- Implement proper state management
- Handle loading states and error messages
- Create intuitive user interface with tabs/sections

### Database
- Proper table relationships (Group 1:N Member)
- Foreign key constraints
- Appropriate data types and constraints
- Primary keys for both tables

## Implementation Structure

### Backend Files
- `server/models/groupModel.js` - Group database model
- `server/models/memberModel.js` - Member database model  
- `server/routes/groupsRoutes.js` - Group API endpoints
- `server/routes/membersRoutes.js` - Member API endpoints

### Frontend Files
- `client/src/pages/GroupMemberSystem.js` - Main page with tabs
- `client/src/components/GroupForm.js` - Group creation form
- `client/src/components/MemberForm.js` - Member creation form
- `client/src/components/GroupList.js` - Display groups and members
- `client/src/components/UpdateGroupForm.js` - Group update form
- `client/src/components/MemberList.js` - Member management with delete

## User Interface Requirements
- Clean, intuitive interface using Ant Design
- Tabbed interface for different operations
- Proper form validation and error messages
- Loading states for all async operations
- Confirmation dialogs for destructive operations
- Responsive design for different screen sizes
