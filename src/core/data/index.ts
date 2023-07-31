export const StatusCode:any = 
{
    active: 1,
    inactive: 2,
    new: 3,
    seen: 4,
    online: 5,
    offline: 6,
    resigned: 7,
    retired: 8,
    terminated: 9,
    onleave: 10,
    unapproved: 11,
    unboarded: 12,
    unprofiled: 13,
    onboarding: 14,
    suspended: 15,
    locked: 16,
    unverified: 17,
    verified: 18,
    confirmed: 19,
    unconfirmed: 20, 
    rejected: 21, 
    unprocessed: 22,
    approved: 23,
    revoked: 24,
    expired: 25,
    profiling: 26
}

const AccessPermission = {
    wild_card: 1,
    employee: 2,
    finance: 3, 
}

export const UserRole = {
    super_admin: 1, // App-wide access
    admin: 2, // Subsidiary-wide access
    moderator: 3, // Office-wide access
}

 
export const OTPDuration = 5 //in minutes;

export const OnboardingStatus = {
   completed: 99,
   bio: 1,
   education: 2,
   work_experience: 3,
   surity: 4,
   employee: 5
}