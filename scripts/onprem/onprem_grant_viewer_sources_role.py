"""Grant sources:*:read to the Keycloak viewer lab user.

Executed inside the rbac-api pod via ``manage.py shell``. Idempotent.

Read access sets the user-access ``sources`` flag, which opens Cost Management
Settings and the Integrations tab. It does not include ``sources:*:*`` or
``sources:*:write``, so the viewer is not a Cloud administrator.
"""
from api.models import Tenant
from django.core.cache import cache
from management.models import Access, Group, Permission, Policy, Principal, Role
from management.tenant_mapping.model import TenantMapping

viewer_username = "viewer"
org_id = "1234567"
acct_number = "7890123"
role_name = "On-Prem Sources Viewer"
group_name = "On-Prem Sources Viewers"
policy_name = "On-Prem Sources Viewers Policy"

SOURCES_READ_PERMISSIONS = (
    ("sources", "*", "read", "sources:*:read", "Read all sources"),
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
        "description": "Lab sources read access (sources:*:read)",
        "system": False,
        "version": 2,
    },
)
Access.objects.filter(role=role).delete()
granted_permissions = []
for application, resource_type, verb, permission_string, description in SOURCES_READ_PERMISSIONS:
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
            "description": "Lab sources read access (sources:*:read)",
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

    principal, _ = Principal.objects.get_or_create(
        username=viewer_username,
        tenant=tenant,
        defaults={"type": "user"},
    )
    grp.principals.add(principal)

    print(
        "viewer_sources_granted",
        f"tenant={resolved_org_id}",
        f"permissions={granted_permissions}",
        f"users={[viewer_username]}",
    )

cache.clear()
