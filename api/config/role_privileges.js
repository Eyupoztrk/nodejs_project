module.exports ={
    privGroups: [
        {
            id: "USERS",
            name: "User Permissions"
        },
        {
            id: "ROLES",
            name: "Role Permissions"
        },
        {
            id: "CATEGORIES",
            name: "Category Permissions"
        },
        {
            id: "AUDITLOGS",
            name: "AuidtLog Permissions"
        }
    ],

    privileges: [
        {
            key: "user_view",
            name: "User View",
            group: "USERS",
            description: "Allows viewing user details",
        },
        {
            key: "user_add",
            name: "User Add",
            group: "USERS",
            description: "Allows add",
        },
        {
            key: "user_update",
            name: "User Update",
            group: "USERS",
            description: "Allows Update",
        },
         {
            key: "user_delete",
            name: "User Delete",
            group: "USERS",
            description: "Allows delete",
        },
        {
            key: "role_view",
            name: "Role View",
            group: "ROLES",
            description: "Allows viewing role details",
        },
        {
            key: "role_add",
            name: "Role Add",
            group: "ROLES",
            description: "Allows adding roles",
        },
        {
            key: "role_update",
            name: "Role Update",
            group: "ROLES",
            description: "Allows updating roles",
        },
        {
            key: "role_delete",
            name: "Role Delete",
            group: "ROLES",
            description: "Allows deleting roles",
        },
        {
            key: "category_view",
            name: "Category View",
            group: "CATEGORIES",
            description: "Allows viewing category details",
        },
        {
            key: "category_add",
            name: "Category Add",
            group: "CATEGORIES",
            description: "Allows adding categories",
        },
        {
            key: "category_update",
            name: "Category Update",
            group: "CATEGORIES",
            description: "Allows updating categories",
        },
        {
            key: "category_delete",
            name: "Category Delete",
            group: "CATEGORIES",
            description: "Allows deleting categories",
        },
        {
            key: "auditlog_view",
            name: "AuditLog View",
            group: "AUDITLOGS",
            description: "Allows viewing audit logs"
        }
        
    ]
}