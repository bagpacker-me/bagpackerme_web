// Shared by the server-side guard (lib/spam-guard.ts) and the client forms, so
// this module must stay free of `server-only`.
//
// The field name is not a secret — a bot can read it out of the DOM. The point
// is that naive bots autofill every input they find, and real users never see
// this one.
export const HONEYPOT_FIELD = 'companyWebsite';
