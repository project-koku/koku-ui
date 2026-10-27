"""Grant Sources administrator (Cloud administrator) to admin and viewer lab users.

Executed inside the rbac-api pod via ``manage.py shell``. Idempotent.

Assigns the seeded ``Sources administrator`` role (``sources:*:*``), shown in
the UI as Cloud administrator. Needed so viewer can create/manage sources;
admin is included so the grant is explicit even when admin_default mapping
has not run yet.
"""
from api.models import Tenant
from django.core.cache import cache
from management.models import Group, Policy, Principal, Role
from management.tenant_mapping.model import TenantMapping

usernames = ("admin", "viewer")
org_id = "1234567"
acct_number = "7890123"
role_name = "Sources administrator"
group_name = "On-Prem Cloud Administrators"
policy_name = "On-Prem Cloud Administrators Policy"

public = Tenant.objects.get(tenant_name="public")
role = Role.objects.filter(name=role_name, tenant=public).first()
if role is None:
    raise SystemExit(
        f"role {role_name!r} not found on public tenant — "
        "run RBAC seeding (operator/chart install) first"
    )

org_ids = [org_id]
if str(org_id).startswith("org"):
    org_ids.append(str(org_id)[3:])
else:
    org_ids.append("org" + str(org_id))

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
        f"role={role.name}",
        f"users={list(usernames)}",
    )

cache.clear()
