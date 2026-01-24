/**
 * ACCESS CONTROL MATRIX (ACM)
 * 
 * This module defines the explicit Access Control Matrix for the SecureExamVault system.
 * It maps Roles (Subjects) to Objects (Resources) and Actions (Permissions).
 * 
 * MODEL:
 * The Access Control Matrix model represents the state of a protection system.
 * It strictly defines the rights of each subject over each object in the system.
 * 
 * JUSTIFICATION FOR POLICIES:
 * 
 * 1. Student Role:
 *    - Exams (read): Students need to view exam papers to take them, but must NOT verify/modify them (Integrity).
 *    - Submissions (write): Students must be able to submit their answers (Availability/write permission).
 *    - Results (read): Students are entitled to see their own grades (Confidentiality/read).
 * 
 * 2. Faculty Role:
 *    - Exams (read, write): Faculty create and review exam content.
 *    - Submissions (read, evaluate): Faculty need to read answers and grade (evaluate) them. 
 *      They should NOT delete submissions (manage) to preserve audit trails.
 *    - Results (sign): Faculty must digitally sign results to ensure authenticity (Non-repudiation).
 * 
 * 3. Admin Role:
 *    - Management (manage): Admins oversee the system lifecycle, user management, and maintenance.
 *    - Admin does NOT evaluate submissions to maintain separation of duties (SoD) - 
 *      preventing administrative override of academic grading.
 */

const ROLES = {
    STUDENT: 'student',
    FACULTY: 'faculty',
    ADMIN: 'admin'
};

const RESOURCES = {
    EXAMS: 'exams',
    SUBMISSIONS: 'submissions',
    RESULTS: 'results',
    USERS: 'users' // Added for admin management
};

const ACTIONS = {
    READ: 'read',
    WRITE: 'write',
    EVALUATE: 'evaluate',
    SIGN: 'sign',
    MANAGE: 'manage'
};

// THE ACCESS CONTROL MATRIX
const ACCESS_CONTROL_MATRIX = {
    [ROLES.STUDENT]: {
        [RESOURCES.EXAMS]: [ACTIONS.READ],
        [RESOURCES.SUBMISSIONS]: [ACTIONS.WRITE],
        [RESOURCES.RESULTS]: [ACTIONS.READ]
    },
    [ROLES.FACULTY]: {
        [RESOURCES.EXAMS]: [ACTIONS.READ, ACTIONS.WRITE],
        [RESOURCES.SUBMISSIONS]: [ACTIONS.READ, ACTIONS.EVALUATE],
        [RESOURCES.RESULTS]: [ACTIONS.SIGN]
    },
    [ROLES.ADMIN]: {
        [RESOURCES.EXAMS]: [ACTIONS.READ, ACTIONS.WRITE, ACTIONS.MANAGE],
        [RESOURCES.SUBMISSIONS]: [ACTIONS.READ, ACTIONS.MANAGE],
        [RESOURCES.RESULTS]: [ACTIONS.READ, ACTIONS.MANAGE],
        [RESOURCES.USERS]: [ACTIONS.MANAGE, ACTIONS.READ]
    }
};

export { ROLES, RESOURCES, ACTIONS, ACCESS_CONTROL_MATRIX };
