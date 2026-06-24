import type { Access, FieldAccess } from 'payload'

// Anyone (including logged-out visitors) can read.
export const anyone: Access = () => true

// Only authenticated users (any collection) may proceed.
export const authenticated: Access = ({ req: { user } }) => Boolean(user)

// Only admin Users may proceed (used for all content management).
export const admins: Access = ({ req: { user } }) =>
  Boolean(user && user.collection === 'users')

export const adminsFieldLevel: FieldAccess = ({ req: { user } }) =>
  Boolean(user && user.collection === 'users')

// Public can read only published docs; admins can read everything (incl. drafts).
export const adminsOrPublished: Access = ({ req: { user } }) => {
  if (user && user.collection === 'users') return true
  return { _status: { equals: 'published' } }
}

// A student may read only their OWN record; admins read all.
export const ownStudentRecordOrAdmin: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.collection === 'users') return true
  if (user.collection === 'students') return { id: { equals: user.id } }
  return false
}
