"""Grant sources:*:* to the Keycloak admin and viewer lab users.

Executed inside the rbac-api pod via ``manage.py shell``. Idempotent.

Sources UI enables write controls only when /api/rbac/v1/access/?application=sources
includes the exact string ``sources:*:*`` or ``sources:*:write``. This creates
that permission instead of depending on a seeded role name.
"""
from api.models import Tenant
from django.core.cache import cache
from management.models import Access, Group, Permission, Policy, Principal, Role
from management.tenant_mapping.model import TenantMapping

usernames = ("admin", "viewer")
org_id = "1234567"
acct_number = "7890123"
role_name = "On-Prem Cloud Administrator"
group_name = "On-Prem Cloud Administrators"
policy_name = "On-Prem Cloud Administrators Policy"

# sources-ui redux/user/actions.js loadWritePermissions
SOURCES_WRITE_PERMISSIONS = (
    ("sources", "*", "*", "sources:*:*", "All sources permissions"),
)


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
    name=role_name,
    tenant=public,
    defaults={
        "description": "Lab Cloud administrator (sources:*:*) access",
        "system": False,
        "version": 2,
    },
)
Access.objects.filter(role=role).delete()
granted_permissions = []
for application, resource_type, verb, permission_string, description in SOURCES_WRITE_PERMISSIONS:
    perm = ensure_permission(application, resource_type, verb, permission_string, description)
    Access.objects.get_or_create(role=role, permission=perm, tenant=public)
    granted_permissions.append(permission_string)

for resolved_org_id in org_ids:
    tenant, _ = Tenant.objects.get_or_create(
        org_id=resolved_org_id,
        defaults={"tenant_name": "acct" + acct_number, "ready": True},
    )
    TenantMapping.objects.get_or_create(
        tenant=tenant, defaults={"v2_write_activated_at": None}
    )

    grp, _ = Group.objects.get_or_create(
        name=group_name,
        tenant=tenant,
        defaults={
            "description": "Lab Cloud administrator (sources:*:*) access",
            "admin_default": False,
            "system": True,
        },
    )
    pol, _ = Policy.objects.get_or_create(
        name=policy_name,
        tenant=tenant,
        group=grp,
    )
    pol.roles.add(role)

    for username in usernames:
        principal, _ = Principal.objects.get_or_create(
            username=username,
            tenant=tenant,
            defaults={"type": "user"},
        )
        grp.principals.add(principal)

    print(
        "cloud_administrator_granted",
        f"tenant={resolved_org_id}",
        f"permissions={granted_permissions}",
        f"users={list(usernames)}",
    )

cache.clear()
