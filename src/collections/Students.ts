import type { CollectionConfig } from 'payload'
import { admins } from '../access'
import { ownStudentRecordOrAdmin } from '../access'

/**
 * Student/Parent directory — the gated "member directory" equivalent.
 *
 * SECURITY NOTE (read before going live):
 * The church site authenticates with Membership ID + Date of Birth. DOB is
 * LOW-ENTROPY and guessable, so do NOT ship it as the only factor for real
 * student PII. This collection is auth-enabled for the dummy build; for the
 * real site, keep Admission No as the identifier but add a one-time code
 * (email/SMS/WhatsApp) before exposing records, plus rate limiting + lockout.
 */
export const Students: CollectionConfig = {
  slug: 'students',
  auth: {
    // For the dummy site we use Payload's standard email+password auth UI.
    // Replace with a custom login (Admission No + OTP) for production — see CLAUDE.md.
    maxLoginAttempts: 5,
    lockTime: 600000, // 10 minutes
  },
  admin: { useAsTitle: 'admissionNo', defaultColumns: ['admissionNo', 'name', 'class', 'section'], group: 'Directory' },
  access: {
    read: ownStudentRecordOrAdmin,
    create: admins,
    update: admins,
    delete: admins,
    admin: () => false, // students never see the Payload admin UI
  },
  fields: [
    { name: 'admissionNo', type: 'text', required: true, unique: true, index: true },
    { name: 'name', type: 'text', required: true },
    { name: 'dateOfBirth', type: 'date', required: true },
    { name: 'class', type: 'text' },
    { name: 'section', type: 'text' },
    { name: 'rollNo', type: 'text' },
    { name: 'guardianName', type: 'text' },
    { name: 'guardianPhone', type: 'text' },
  ],
}
