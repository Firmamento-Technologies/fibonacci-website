# Appointment Scheduling and Management

> ⚠️ **Verified against the application on 2026-08-10.** The items listed here are those that actually exist. If you find one described but don’t see it on screen, it’s a guide defect: please report it.

This guide explains how to use Fibonacci’s integrated calendar to schedule visits, manage a shared multi-provider schedule, send automated SMS reminders to patients, export and sync appointments with external calendars. It is intended for physicians and front-office staff.

The calendar is designed for small to medium-sized practices, from one to twenty providers. The default view is weekly to prioritize daily operational planning, but daily and monthly views are available for different needs.

## Prerequisites

- Account with role `Physician`, `Receptionist`, or `Practice admin`.
- Existing patient record for appointment creation; alternatively, the patient can be created on the fly from the appointment modal.
- For automated SMS reminders: a subscribed plan that includes the `Communications` module, or optional pay-per-use activation. The provider is Brevo or MessageBird depending on tenant configuration.
- Patient’s mobile number in `+39 333 1234567` format for correct reminder delivery.

## Step 1: Accessing the Calendar

From the main navigation bar, the calendar icon opens the `Appointments` section. The screen displays:

- Top left: view selector: `Daily`, `Week`, `Month`.
- Top right: provider selector with filters `All`, `Only me`, `Multi-provider`.
- Center: time grid with appointments shown as colored blocks.
- Right sidebar: appointment details panel for the selected appointment.

The weekly view is the default and shows five or seven days depending on preferences: `Settings > Appointments > Visible days`.

## Step 2: Creating a New Appointment

Left-click on an available time slot opens the `New appointment` modal. Fields include:

- **Patient**: Combo box with autocomplete on existing records. The adjacent `Add` button opens quick patient creation.
- **Provider**: Selection from active practice providers. Default: current user if role is physician, otherwise the first available provider.
- **Reason** or **Visit type**: Selection from a configurable practice catalog—the available options are those you see in the menu, not a fixed list.
- **Duration**: Value in minutes with a default of thirty; quick options for fifteen, thirty, forty-five, sixty, ninety.
- **Status**: Modifiable later from the appointment details.
- **Notes**: Free-text field for provider memos not visible to the patient.
- **Patient notes**: Free-text field included in automated reminders.

The `Save` button records the appointment. The time slot immediately appears in the grid with the color associated with the provider or visit type based on configured preference.

## Step 3: Managing Calendar Conflicts

The system checks in real time for overlaps with existing appointments for the same provider. In case of conflict, the modal shows a yellow warning with details of the conflicting appointment and three options:

- `Edit time`: Return to the form.
- `Assign to another provider`: Change provider while keeping the same time.
- `Save anyway`: Record the overlap and mark it with a warning icon in the grid.

The `Save anyway` overlap is useful in specific cases, such as double appointments for a companion and patient, but is generally not recommended.

## Step 4: Managing Appointment Statuses

Each appointment has a current status, represented graphically by color and icon:

- **Scheduled**: Initial status, light blue.
- **Confirmed**: Patient confirmed following a reminder, solid blue.
- **Check-in**: Patient arrived at the practice, light green.
- **In progress**: Visit started, solid green.
- **Completed**: Visit finished, gray.
- **No-show**: Patient did not show up, orange.
- **Cancelled**: Appointment cancelled before start, light red.

Status changes are made by clicking on the appointment and selecting the new status from the right sidebar. The system records timestamps for each change in the audit log.

The `Check-in` status can be activated automatically by an optional in-office kiosk (optional module). The `In progress` status can be activated automatically when opening the patient’s visit record.

## Step 5: Automated SMS Reminders

SMS reminders are sent automatically to the patient’s mobile number recorded in their profile. The standard message follows this format:

`Dear [name], this is a reminder for your appointment on [date time] at [practice name]. To confirm, reply 1; to cancel, reply 2. [link]`

Reminder settings are in `Settings > Communications > Reminders`:

- **T-24h**: Reminder twenty-four hours before the appointment, enabled by default.
- **T-2h**: Reminder two hours before, disabled by default, can be enabled.
- **T-7d**: Reminder seven days before for long-term appointments, disabled by default.

The SMS provider in use is visible in settings: Brevo for standard plans, MessageBird for international plans. Cost per SMS depends on the subscribed plan.

Reminders require:

- Mobile number in international format `+39` for Italian numbers.
- `Communications consent` flag active in the patient’s profile.
- Sufficient SMS balance in the plan.

The patient’s response to reminders (`1` to confirm, `2` to cancel) automatically updates the appointment status and notifies the provider.

## Step 6: Multi-Provider View

For practices with multiple physicians or concurrent providers, the multi-provider view shows:

- A vertical column for each selected provider.
- Header with name and specialty.
- Distinct color coding for each provider.
- Common time row.

The selector in the top right allows choosing which providers to display. The preference is saved per user.

The `Only me` filter reduces the view to the personal calendar, useful for individual physician planning. The `Multi-provider` filter aggregates providers configured in the main workgroup.

## Step 7: Drag and Drop and Quick Edits

The calendar supports direct interactions for quick edits:

- **Drag** an appointment to another time slot to change date or time while keeping duration and details.
- **Drag** the bottom edge of an appointment to modify duration.
- **Double-click** on an appointment to open the detailed panel with all fields.
- **Right-click** on an appointment to open the quick menu with `Edit`, `Cancel`, `Duplicate`, `Move`, `Mark check-in`.
- **Right-click** on an available slot to open the quick menu for creating an appointment in that slot.

Drag-and-drop edits automatically generate a notification to the patient with the new time if the appointment was already confirmed.

## Step 8: Export and iCal Synchronization

The `Export` button opens two options:

- **Weekly PDF export**: Generates a printable PDF with the weekly grid, useful for paper archiving or sharing with the practice owner.
- **Export iCal**: Downloads an `.ics` file with all appointments in the selected range.

Automatic synchronization with external calendars is available in `Settings > Integrations > Calendars`. The system supports:

- Google Calendar via OAuth.
- Microsoft Outlook via OAuth.
- Any calendar that supports read-only iCal URLs.

Synchronization is bidirectional for Google and Microsoft (creating an event in the external calendar creates the appointment in Fibonacci and vice versa) and unidirectional for other calendars (read-only from Fibonacci).

For privacy, synchronized external appointments show only a generic title (`Medical visit`) and time, without patient data.

## Tips

- Configure recurring visit types for your practice in `Settings > Appointments > Visit types` with predefined duration and color: creating new appointments becomes faster.
- For practices with recurring schedules, block lunch breaks and meeting times using `Block slot` repeated: appointments cannot be created in those slots.
- Set T-24h reminders as default and activate T-2h only for complex appointments or first visits: reduces notification overload.
- For telemedicine appointments, the system automatically generates the videocall link in the confirmation and reminder if the telemedicine module is active.
- Double-click on a day in the monthly view to open the detailed daily view for that date.

## Troubleshooting

**SMS reminders not received by the patient.** Check in order: mobile number in international format `+39 333 1234567`; `Communications consent` flag active in the patient’s profile; sufficient SMS balance in the `communications settings` panel; send history for the individual appointment in the `Communications > History` panel showing any provider errors.

**Overlapping appointment created by mistake.** Open the appointment and use `Edit time` to reschedule, or `Assign to another provider` to redistribute the workload. In any case, the system notifies any patients already informed with the new time or provider change.

**Google Calendar synchronization interrupted.** Often caused by OAuth token expiration after prolonged inactivity. Open `Settings > Integrations > Google Calendar` and reauthorize. Already synchronized appointments remain intact.

**Drag and drop not working on tablet or touchscreen.** On some mobile devices, drag mode requires a long press before starting to drag. Alternatively, use the `Edit` side panel to change date and time with the virtual keyboard.

**`No-show` status not updated automatically.** The status remains the initial or `Confirmed` if not manually marked. Configure in `Settings > Appointments > Auto no-show` the timeout after which an unstarted appointment is automatically marked as `No-show`: disabled by default, recommended value sixty minutes.

## See Also

- [Patient Record Creation and Management](/manuale/anagrafica-paziente)
- [First Access and Initial Setup](/manuale/installazione)
- [Audit Log and Access Traceability](/manuale/audit-log)

Last revision: {ULTIMA_REVISIONE}
