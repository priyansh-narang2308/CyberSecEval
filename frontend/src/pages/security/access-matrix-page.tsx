import React from 'react';
import DashboardLayout from '../../components/dashboard-layout';
import { Shield, Check, X } from 'lucide-react';

type Permission = 'read' | 'write' | 'update' | 'deny';

interface AccessCell {
  permission: Permission;
}

const AccessMatrixPage = () => {
  const resources = ['Exams', 'Results', 'User Records', 'System Logs', 'Keys'];
  const roles = ['Student', 'Faculty', 'Admin'];

  const matrix: Record<string, Record<string, Permission[]>> = {
    Student: {
      Exams: ['read'],
      Results: ['read'],
      'User Records': ['read'],
      'System Logs': ['deny'],
      Keys: ['deny'],
    },
    Faculty: {
      Exams: ['read', 'write', 'update'],
      Results: ['read', 'write', 'update'],
      'User Records': ['read'],
      'System Logs': ['deny'],
      Keys: ['deny'],
    },
    Admin: {
      Exams: ['read', 'write', 'update'],
      Results: ['read', 'write', 'update'],
      'User Records': ['read', 'write', 'update'],
      'System Logs': ['read'],
      Keys: ['read', 'write', 'update'],
    },
  };

  const getPermissionBadge = (permission: Permission) => {
    switch (permission) {
      case 'read':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-primary/10 text-primary">
            <Check className="h-3 w-3" /> R
          </span>
        );
      case 'write':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-success/10 text-success">
            <Check className="h-3 w-3" /> W
          </span>
        );
      case 'update':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-warning/10 text-warning">
            <Check className="h-3 w-3" /> U
          </span>
        );
      case 'deny':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-destructive/10 text-destructive">
            <X className="h-3 w-3" /> Deny
          </span>
        );
    }
  };

  return (
    <DashboardLayout role="admin" userName="Admin">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">Access Control Matrix</h1>
          <p className="text-muted-foreground">
            Role-Based Access Control (RBAC) permissions for all system resources.
          </p>
        </div>

        {/* Legend */}
        <div className="mb-6 p-4 bg-card border rounded-lg">
          <h3 className="text-sm font-medium text-foreground mb-3">Permission Legend</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              {getPermissionBadge('read')}
              <span className="text-sm text-muted-foreground">Read - View access</span>
            </div>
            <div className="flex items-center gap-2">
              {getPermissionBadge('write')}
              <span className="text-sm text-muted-foreground">Write - Create access</span>
            </div>
            <div className="flex items-center gap-2">
              {getPermissionBadge('update')}
              <span className="text-sm text-muted-foreground">Update - Modify access</span>
            </div>
            <div className="flex items-center gap-2">
              {getPermissionBadge('deny')}
              <span className="text-sm text-muted-foreground">Deny - No access</span>
            </div>
          </div>
        </div>

        {/* Matrix Table */}
        <div className="bg-card border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Role / Resource
                  </th>
                  {resources.map((resource) => (
                    <th key={resource} className="px-6 py-4 text-center text-sm font-semibold text-foreground">
                      {resource}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {roles.map((role, index) => (
                  <tr key={role} className={index !== roles.length - 1 ? 'border-b' : ''}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        <span className="font-medium text-foreground">{role}</span>
                      </div>
                    </td>
                    {resources.map((resource) => (
                      <td key={resource} className="px-6 py-4 text-center">
                        <div className="flex flex-wrap justify-center gap-1">
                          {matrix[role][resource].map((permission, idx) => (
                            <React.Fragment key={idx}>
                              {getPermissionBadge(permission)}
                            </React.Fragment>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Explanation */}
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-card border">
            <h3 className="font-semibold text-foreground mb-2">Student Access</h3>
            <p className="text-sm text-muted-foreground">
              Students can only read their own exams, results, and profile. They have no access to system logs or encryption keys.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-card border">
            <h3 className="font-semibold text-foreground mb-2">Faculty Access</h3>
            <p className="text-sm text-muted-foreground">
              Faculty can create and manage exams, evaluate submissions, and sign results. They cannot access system logs or keys.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-card border">
            <h3 className="font-semibold text-foreground mb-2">Admin Access</h3>
            <p className="text-sm text-muted-foreground">
              Administrators have full access to all resources including user management, system logs, and encryption key management.
            </p>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-foreground">Principle of Least Privilege</h3>
              <p className="text-sm text-muted-foreground mt-1">
                This access control matrix follows the principle of least privilege. Each role is granted only the minimum 
                permissions necessary to perform their functions. Access decisions are enforced at both the application 
                and database levels.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AccessMatrixPage;
