# Practice Users and Access Revocation

This guide explains how to invite a collaborator, what they can do, and most importantly **how to revoke their access when they leave**. It is aimed at practice administrators.

The last operation is the one that is always postponed but matters the most: a former collaborator who retains credentials can still access medical records, and no log will flag this as an anomaly because they are formally still authorized.

## Prerequisites

- Account with the `admin studio` role.
- For invitations: email configured on the server. Without it, the invitee's account is created but **they will not receive the message with the link to set their password**, and the request will still appear successful. If an invitee says they haven’t received anything, this is the first thing to check.

## Step 1: Inviting a Collaborator

In `Settings`, the `Practice members` section lists who has access. The `Invite user` button asks for first name, last name, email address, role, and access policy.

Every invitee receives **mandatory two-factor authentication**: they will be asked to set it up on their first login. It cannot be disabled, and the reason is that these accounts access health-related data.

The access policy determines what they can see: the physician policy limits visibility to their own patients; practice policies extend visibility to all patients in the practice. The choice must be made consciously, as it is the difference between a colleague who sees only their patients and one who sees everyone’s.

## Step 2: Revoking Access for Someone Who Leaves

In the same table, the `Access` column contains the `Remove access` button.

Before confirming, the window explains exactly what happens, and it’s worth reading:

- **Access is revoked immediately**, including any active sessions: anyone working at that moment will be logged out on their next action.
- **Clinical data remains**. Visits, consents, and signatures continue to be attributed to that physician. This is not a technical detail: a report cannot change authorship because the person who wrote it has changed practices.
- **This action cannot be reversed from the interface**: to reinstate someone, they must be invited again.

The operation is recorded in the audit log: who performed it, on whom, and when.

### Why There Is No "Temporary Suspension"

This is the question anyone asks when they can’t find the button. The answer is that in this system, the field that might seem useful ("inactive user") **does not block access**: it is descriptive. A "suspend" button built on that field would mislead the administrator into thinking access was revoked when it wasn’t, which is worse than not having the button at all.

If the absence is temporary and you still want to close access, the solution is to remove access and reinvite upon return.

## Step 3: Cases Where the Button Does Not Appear

Instead of the button, you’ll see a dash, and hovering over it reveals the reason:

- **Your own account**: No one can revoke their own access. If it were a mistake, no one would be left to fix it from the interface.
- **The last administrator**: Removing them would lock the practice out of its own project.
- **Service identities** (integrations and automations): These are disabled where they are configured, not from the colleagues screen.

## Common Mistakes

- **Postponing revocation to "when there’s time."** This is the only operation in this guide with a time window: the risk exists between departure and revocation.
- **Inviting someone with a practice-wide policy "for convenience."** This extends visibility to all patients, and it cannot be undone automatically.
- **Assuming an invitation was successful without confirmation from the invitee.** If email isn’t configured, the request succeeds but the message is never sent.

## Frequently Asked Questions

**What happens to the records they were responsible for?** They remain where they are. What changes is who can access them, not who they are attributed to.

**Can I see who revoked whose access?** Yes, in the audit log: the operation is tracked as a security event, distinct from a clinical deletion.

**Can a revoked collaborator still use an open app?** No. The active session stops working on the next action: revocation does not wait for the token to expire.
