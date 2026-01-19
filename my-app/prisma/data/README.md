# Database Seed Data

This folder contains JSON files used for seeding the database with initial data.

## 📁 File Structure

```
data/
├── users.json       # User accounts
├── categories.json  # Todo categories
├── todos.json       # Todo items
└── README.md        # This file
```

## 📝 Data Files

### users.json

Contains user account information:

- **email**: User email address (unique)
- **name**: User full name
- **password**: Plain text password (will be hashed during seeding)

**Total Users**: 3

### categories.json

Contains category information:

- **name**: Category name
- **userEmail**: Associated user email (foreign key reference)

**Total Categories**: 9 (3 categories per user)

### todos.json

Contains todo items:

- **title**: Todo title
- **description**: Detailed description (optional)
- **completed**: Boolean completion status
- **priority**: Priority level (low, medium, high)
- **dueDate**: Due date in ISO format (optional)
- **userEmail**: Owner email (foreign key reference)
- **categoryName**: Associated category name (optional)

**Total Todos**: 60 (20 todos per user)

## 🔄 Data Distribution

### Users

1. **John Doe** (john@example.com)
   - 3 categories: Work, Personal, Health
   - 20 todos distributed across categories

2. **Jane Smith** (jane@example.com)
   - 3 categories: Work, Shopping, Learning
   - 20 todos distributed across categories

3. **Alice Johnson** (alice@example.com)
   - 3 categories: Work, Personal, Fitness
   - 20 todos distributed across categories

## 🔐 Test Credentials

All users have the same password for testing purposes:

- **Password**: `password123`

## 🛠️ How to Use

1. **Reset Database**:

   ```bash
   npm run prisma:reset
   # or
   npx prisma migrate reset
   ```

2. **Run Seed Only**:
   ```bash
   npm run seed
   # or
   npx tsx prisma/seed.ts
   ```

## 📊 Statistics

- **Total Users**: 3
- **Total Categories**: 9
- **Total Todos**: 60
- **Average Todos per User**: 20
- **Average Categories per User**: 3

## ✨ Best Practices

1. **Separation of Concerns**: Data is separated into logical JSON files
2. **Referential Integrity**: Uses email as reference to maintain relationships
3. **Realistic Data**: Includes diverse todo items with varying priorities and completion status
4. **Easy Maintenance**: JSON format makes it easy to add/modify data
5. **Type Safety**: TypeScript types ensure data consistency
6. **Error Handling**: Proper validation and error messages

## 📝 Modifying Data

To add or modify data:

1. Edit the appropriate JSON file
2. Ensure foreign key references (emails) are correct
3. Run `npm run prisma:reset` to reset and reseed the database

## ⚠️ Important Notes

- Always backup production data before running migrations
- The seed script will **delete all existing data**
- Use different passwords in production
- Validate JSON format before running seed script
