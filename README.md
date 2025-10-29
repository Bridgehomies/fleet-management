# Document and Fleet Management System

A comprehensive cloud-based solution for managing documents, fleet vehicles, maintenance records, and financial transactions with real-time expiry alerts and accounting integration.

## Features

### 1. Document Management
- Store and organize important documents (licenses, insurance, registrations, permits)
- Track document expiry dates with automatic status updates
- Upload and attach files to documents
- Search and filter documents by type and status
- Document version history and audit trails

### 2. Fleet Management
- Register and manage fleet vehicles
- Track vehicle details (make, model, year, VIN, license plate)
- Maintain comprehensive maintenance records
- Schedule and track maintenance tasks
- Vehicle status monitoring (active, maintenance, inactive)

### 3. Expiry Alerts System
- Automatic alerts for upcoming document expirations
- Maintenance due date notifications
- Customizable alert thresholds (7, 14, 30 days)
- Alert acknowledgment tracking
- Color-coded urgency levels (critical, warning, upcoming)

### 4. File Upload & Attachments
- Drag-and-drop file upload interface
- Secure file storage with Vercel Blob
- Support for multiple file types (PDF, DOC, XLS, images)
- 50MB file size limit per upload
- Mobile-friendly upload capabilities

### 5. Accounting Integration
- Track financial transactions (income, expenses, maintenance, fuel)
- Categorize expenses by type
- Record payment methods and reference numbers
- Generate financial reports
- Integration hooks for QuickBooks, Xero, FreshBooks, Wave

### 6. User Management
- Secure authentication with Supabase
- Role-based access control (admin, manager, user)
- User profiles with company information
- Notification preferences
- Account settings management

## Technology Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Backend**: Next.js API Routes, Server Actions
- **Database**: Supabase (PostgreSQL)
- **File Storage**: Vercel Blob
- **Authentication**: Supabase Auth
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS v4
- **Date Handling**: date-fns

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Vercel Blob token

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd fleet-management-system
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   Create a `.env.local` file with:
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   BLOB_READ_WRITE_TOKEN=your_blob_token
   \`\`\`

4. **Run database migrations**
   \`\`\`bash
   npm run db:migrate
   \`\`\`

5. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Schema

### Tables

- **profiles**: User account information
- **documents**: Document records with expiry tracking
- **vehicles**: Fleet vehicle information
- **maintenance_records**: Vehicle maintenance history
- **document_attachments**: File attachments for documents
- **expiry_alerts**: Alert notifications for expirations
- **accounting_transactions**: Financial transaction records

All tables include Row Level Security (RLS) policies to ensure data privacy and security.

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Documents
- `GET /api/documents` - List user documents
- `POST /api/documents` - Create document
- `PUT /api/documents/:id` - Update document
- `DELETE /api/documents/:id` - Delete document

### Fleet
- `GET /api/fleet` - List vehicles
- `POST /api/fleet` - Add vehicle
- `PUT /api/fleet/:id` - Update vehicle
- `DELETE /api/fleet/:id` - Delete vehicle

### Maintenance
- `GET /api/maintenance` - List maintenance records
- `POST /api/maintenance` - Create maintenance record
- `PUT /api/maintenance/:id` - Update maintenance record

### Accounting
- `GET /api/accounting/transactions` - List transactions
- `POST /api/accounting/transactions` - Create transaction
- `POST /api/accounting/sync` - Sync to accounting software

### File Upload
- `POST /api/upload` - Upload file to Vercel Blob

## Usage Guide

### Adding a Document
1. Navigate to Documents section
2. Click "Add Document"
3. Fill in document details (title, type, dates)
4. Upload file if available
5. Click "Create Document"

### Managing Fleet
1. Go to Fleet Management
2. Click "Add Vehicle" to register new vehicle
3. Enter vehicle details
4. Add maintenance records from vehicle detail page
5. Track maintenance history and costs

### Monitoring Alerts
1. Check Alerts dashboard for pending notifications
2. Review expiry dates and urgency levels
3. Acknowledge alerts after taking action
4. Set notification preferences in Settings

### Recording Transactions
1. Navigate to Accounting section
2. Click "Add Transaction"
3. Select transaction type and amount
4. Assign to vehicle if applicable
5. Sync to accounting software when ready

## Security Features

- **Row Level Security (RLS)**: All database tables protected with RLS policies
- **Authentication**: Secure email/password authentication via Supabase
- **Authorization**: User can only access their own data
- **File Security**: Files stored securely in Vercel Blob with private access
- **HTTPS**: All communications encrypted
- **Session Management**: Automatic session refresh and token management

## Deployment

### Deploy to Vercel

1. **Push to GitHub**
   \`\`\`bash
   git push origin main
   \`\`\`

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables
   - Deploy

3. **Configure Supabase**
   - Update redirect URLs in Supabase Auth settings
   - Set production domain

## Maintenance

### Regular Tasks
- Monitor database performance
- Review and archive old transactions
- Update alert thresholds as needed
- Backup important data regularly

### Troubleshooting

**Issue**: Files not uploading
- Check Blob token is valid
- Verify file size is under 50MB
- Check browser console for errors

**Issue**: Alerts not generating
- Verify expiry dates are set on documents
- Check alert service is running
- Review database for alert records

**Issue**: Authentication failing
- Verify Supabase credentials
- Check email confirmation status
- Clear browser cookies and try again

## Support & Documentation

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob)
- [shadcn/ui Components](https://ui.shadcn.com)

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Roadmap

- Mobile app (React Native)
- Advanced reporting and analytics
- Multi-user team collaboration
- Document OCR and auto-categorization
- GPS tracking for vehicles
- Predictive maintenance alerts
- Integration with more accounting software
- API for third-party integrations
