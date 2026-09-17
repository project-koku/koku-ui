"""Grant read-only IAM RBAC permissions to the Keycloak ``viewer`` lab user.

Executed inside the rbac-api pod via ``manage.py shell``. Idempotent.

Grants scoped IAM read permissions for Users/Roles/Groups/Overview route guards
without ``rbac:*:*``, which the IAM UI treats as User Access Administrator.
"""
from api.models import Tenant
from django.core.cache import cache
from management.models import Access, Group, Permission, Policy, Principal, Role
from management.tenant_mapping.model import TenantMapping

viewer_username = "viewer"
org_id = "1234567"
acct_number = "7890123"

# V1 route guards (see insights-rbac-ui/src/v1/Routing.tsx). Do not grant rbac:*:*
# — useUserData() maps that wildcard to the User Access Administrator badge.
IAM_READ_PERMISSIONS = (
    ("rbac", "*", "read", "rbac:*:read", "Read all RBAC resources"),
    ("rbac", "principal", "read", "rbac:principal:read", "Read RBAC principals"),
    ("rbac", "role", "read", "rbac:role:read", "Read RBAC roles"),
    ("rbac", "group", "read", "rbac:group:read", "Read RBAC groups"),
)

PLATFORM_VIEWER_ROLES = ("User Access principal viewer",)


def ensure_permission(application, resource_type, verb, permission_string, description):
    perm, _ = Permission.objects.get_or_create(
        tenant=public,
        application=application,
        resource_type=resource_type,
        verb=verb,
        defaults={
            "permission": permission_string,
            "description": description,
        },
    )
    if perm.permission != permission_string:
        perm.permission = permission_string
        perm.save(update_fields=["permission"])
    return perm


public = Tenant.objects.get(tenant_name="public")

org_ids = [org_id]
if str(org_id).startswith("org"):
    org_ids.append(str(org_id)[3:])
else:
    org_ids.append("org" + str(org_id))

role, _ = Role.objects.get_or_create(
    name="On-Prem IAM Viewer",
    tenant=public,
    defaults={
        "description": "Read-only IAM access for lab viewer user",
        "system": False,
        "version": 2,
    },
)
Access.objects.filter(role=role).delete()
granted_permissions = []
for application, resource_type, verb, permission_string, description in IAM_READ_PERMISSIONS:
    perm = ensure_permission(application, resource_type, verb, permission_string, description)
    Access.objects.get_or_create(role=role, permission=perm, tenant=public)
    granted_permissions.append(permission_string)

platform_roles = list(
    Role.objects.filter(name__in=PLATFORM_VIEWER_ROLES, tenant=public)
)

for resolved_org_id in org_ids:
    tenant, _ = Tenant.objects.get_or_create(
        org_id=resolved_org_id,
        defaults={"tenant_name": "acct" + acct_number, "ready": True},
    )
    TenantMapping.objects.get_or_create(
        tenant=tenant, defaults={"v2_write_activated_at": None}
    )

    grp, _ = Group.objects.get_or_create(
        name="On-Prem IAM Viewers",
        tenant=tenant,
        defaults={
            "description": "Lab viewer IAM read access",
            "admin_default": False,
            "system": True,
        },
    )
    pol, _ = Policy.objects.get_or_create(
        name="On-Prem IAM Viewers Policy",
        tenant=tenant,
        group=grp,
    )
    pol.roles.clear()
    pol.roles.add(role)
    for platform_role in platform_roles:
        pol.roles.add(platform_role)

    principal, _ = Principal.objects.get_or_create(
        username=viewer_username,
        tenant=tenant,
        defaults={"type": "user"},
    )
    grp.principals.add(principal)

    print(
        "viewer_rbac_granted",
        f"tenant={resolved_org_id}",
        f"permissions={granted_permissions}",
        f"roles={[role.name] + [r.name for r in platform_roles]}",
    )

cache.clear()
