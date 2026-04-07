# deputy_api/management/commands/seed_data.py
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User, Group
from deputy_api.models import (
    Student, DisciplineCase, Suspension, CounselingSession,
    InterventionProgram, InterventionPlan, ReportTemplate,
    GeneratedReport, ScheduledReport, CalendarEvent,
    Notification, UserSettings
)
from datetime import date, time, timedelta
import random

class Command(BaseCommand):
    help = 'Seeds the database with initial data for Deputy Principal portal'

    def handle(self, *args, **options):
        self.stdout.write('Seeding data...')

        # Create DeputyPrincipal group
        group, _ = Group.objects.get_or_create(name='DeputyPrincipal')
        
        # Create a deputy user (optional)
        deputy_user, created = User.objects.get_or_create(
            username='deputy',
            defaults={
                'email': 'deputy@school.edu',
                'first_name': 'Sarah',
                'last_name': 'Martinez',
                'is_staff': True
            }
        )
        if created:
            deputy_user.set_password('deputy123')
            deputy_user.save()
            deputy_user.groups.add(group)
            self.stdout.write('Created deputy user (username: deputy, password: deputy123)')

        # ---- Students ----
        students_data = [
            {
                'name': 'Emma Thompson', 'grade': '10B', 'age': 16, 'gender': 'Female',
                'address': '123 Main St, Springfield', 'parent_name': 'Robert Thompson',
                'parent_phone': '+1 234-567-8901', 'parent_email': 'r.thompson@email.com',
                'attendance': 95.00, 'conduct': 'A', 'status': 'Active',
                'clubs': ['Debate Club', 'Student Council'],
                'achievements': ['Honor Roll', 'Perfect Attendance'], 'warnings_count': 0
            },
            {
                'name': 'James Wilson', 'grade': '11A', 'age': 17, 'gender': 'Male',
                'address': '456 Oak Ave, Springfield', 'parent_name': 'Sarah Wilson',
                'parent_phone': '+1 234-567-8902', 'parent_email': 's.wilson@email.com',
                'attendance': 82.00, 'conduct': 'C', 'status': 'Active',
                'clubs': ['Basketball Team'], 'achievements': [], 'warnings_count': 2
            },
            {
                'name': 'Sophia Lee', 'grade': '9C', 'age': 15, 'gender': 'Female',
                'address': '789 Pine Rd, Springfield', 'parent_name': 'David Lee',
                'parent_phone': '+1 234-567-8903', 'parent_email': 'd.lee@email.com',
                'attendance': 98.00, 'conduct': 'A', 'status': 'Active',
                'clubs': ['Art Club', 'Volunteer Group'],
                'achievements': ['Art Competition Winner'], 'warnings_count': 0
            },
            {
                'name': 'Michael Brown', 'grade': '12C', 'age': 18, 'gender': 'Male',
                'address': '321 Elm St, Springfield', 'parent_name': 'Lisa Brown',
                'parent_phone': '+1 234-567-8904', 'parent_email': 'l.brown@email.com',
                'attendance': 75.00, 'conduct': 'D', 'status': 'Probation',
                'clubs': [], 'achievements': [], 'warnings_count': 3
            },
        ]
        for s in students_data:
            Student.objects.get_or_create(name=s['name'], defaults=s)
        self.stdout.write(f'Created {len(students_data)} students')

        # ---- Discipline Cases ----
        student_james = Student.objects.get(name='James Wilson')
        student_michael = Student.objects.get(name='Michael Brown')
        cases_data = [
            {
                'student': student_james, 'offense': 'Bullying',
                'description': 'Repeated verbal harassment of fellow student',
                'reported_by': 'Ms. Thompson', 'severity': 'High', 'status': 'Investigation',
                'actions': ['Parent notified', 'Witness statements collected']
            },
            {
                'student': student_james, 'offense': 'Truancy',
                'description': 'Skipped 5 classes this week',
                'reported_by': 'Mr. Davis', 'severity': 'Medium', 'status': 'Pending Review',
                'actions': ['Attendance record flagged']
            },
            {
                'student': student_michael, 'offense': 'Class Disruption',
                'description': 'Repeated interruptions during lessons',
                'reported_by': 'Dr. Martinez', 'severity': 'Low', 'status': 'Resolved',
                'actions': ['Verbal warning issued', 'Parent meeting scheduled']
            },
        ]
        for case in cases_data:
            DisciplineCase.objects.get_or_create(
                student=case['student'], offense=case['offense'],
                date=date(2024, 3, 15), defaults=case
            )
        self.stdout.write(f'Created {len(cases_data)} discipline cases')

        # ---- Suspensions ----
        suspensions_data = [
            {
                'student': student_james, 'reason': 'Physical altercation with another student',
                'start_date': date(2024, 3, 10), 'end_date': date(2024, 3, 17),
                'days': 7, 'type': 'Out-of-School', 'status': 'Active',
                'assigned_by': 'Dr. Martinez', 'parent_notified': True
            },
            {
                'student': student_michael, 'reason': 'Repeated disciplinary infractions',
                'start_date': date(2024, 3, 12), 'end_date': date(2024, 3, 14),
                'days': 3, 'type': 'In-School', 'status': 'Active',
                'assigned_by': 'Ms. Thompson', 'parent_notified': True
            },
        ]
        for sus in suspensions_data:
            Suspension.objects.get_or_create(
                student=sus['student'], start_date=sus['start_date'],
                defaults=sus
            )
        self.stdout.write(f'Created {len(suspensions_data)} suspensions')

        # ---- Counseling Sessions ----
        counseling_data = [
            {
                'student': student_james, 'counselor': 'Dr. Sarah Wilson',
                'type': 'Behavioral', 'date': date(2024, 3, 15), 'time': time(10, 0),
                'status': 'Scheduled', 'notes': 'Discuss behavioral issues'
            },
            {
                'student': student_james, 'counselor': 'Dr. Sarah Wilson',
                'type': 'Personal Counseling', 'date': date(2024, 3, 14), 'time': time(14, 0),
                'status': 'Completed', 'notes': 'Follow-up session'
            },
        ]
        for cs in counseling_data:
            CounselingSession.objects.get_or_create(
                student=cs['student'], date=cs['date'], time=cs['time'],
                defaults=cs
            )
        self.stdout.write(f'Created {len(counseling_data)} counseling sessions')

        # ---- Intervention Programs ----
        programs = [
            {
                'name': 'Behavior Improvement Program', 'type': 'Behavioral',
                'duration': '8 weeks', 'start_date': date(2024, 3, 1),
                'end_date': date(2024, 4, 26), 'status': 'Active', 'progress': 65,
                'facilitator': 'Dr. Wilson', 'sessions': 16, 'completed': 10, 'success': '82%'
            },
            {
                'name': 'Academic Support Group', 'type': 'Academic',
                'duration': '12 weeks', 'start_date': date(2024, 2, 15),
                'end_date': date(2024, 5, 10), 'status': 'Active', 'progress': 45,
                'facilitator': 'Ms. Thompson', 'sessions': 24, 'completed': 11, 'success': '75%'
            },
        ]
        for prog in programs:
            p, _ = InterventionProgram.objects.get_or_create(name=prog['name'], defaults=prog)
            p.students.add(student_james, student_michael)
        self.stdout.write(f'Created {len(programs)} intervention programs')

        # ---- Calendar Events ----
        events = [
            {
                'title': 'Disciplinary Hearing - James Wilson', 'type': 'hearing',
                'date': date(2024, 3, 18), 'time': time(10, 0), 'duration': '1 hour',
                'location': 'Room 204', 'participants': ['James Wilson', 'Dr. Martinez', 'Ms. Thompson'],
                'priority': 'High', 'description': 'Review of bullying case #DC001'
            },
            {
                'title': 'Counseling Session - Sarah Chen', 'type': 'counseling',
                'date': date(2024, 3, 18), 'time': time(14, 0), 'duration': '45 mins',
                'location': 'Counseling Office', 'participants': ['Sarah Chen', 'Dr. Wilson'],
                'priority': 'Medium', 'description': 'Follow-up on anxiety management'
            },
            {
                'title': 'Staff Meeting - Discipline Review', 'type': 'meeting',
                'date': date(2024, 3, 19), 'time': time(9, 0), 'duration': '1.5 hours',
                'location': 'Conference Room A', 'participants': ['Dr. Martinez', 'Ms. Thompson', 'Dr. Wilson'],
                'priority': 'High', 'description': 'Monthly discipline case review'
            },
            {
                'title': 'Deadline - Appeal Submissions', 'type': 'deadline',
                'date': date(2024, 3, 21), 'time': time(17, 0), 'duration': 'All day',
                'location': 'Online', 'participants': ['All pending appeals'],
                'priority': 'High', 'description': 'Last day for appeal submissions'
            },
        ]
        for ev in events:
            CalendarEvent.objects.get_or_create(
                title=ev['title'], date=ev['date'],
                defaults=ev
            )
        self.stdout.write(f'Created {len(events)} calendar events')

        # ---- Notifications for the deputy user ----
        notifications = [
            {
                'user': deputy_user, 'type': 'case', 'title': 'New Disciplinary Case Filed',
                'message': 'James Wilson - Physical altercation reported by Ms. Thompson',
                'priority': 'High', 'actionable': True, 'link': '/deputy/discipline/cases/DC001'
            },
            {
                'user': deputy_user, 'type': 'hearing', 'title': 'Hearing Scheduled',
                'message': 'Sarah Chen - Truancy case hearing scheduled for tomorrow at 10:00 AM',
                'priority': 'High', 'actionable': True, 'link': '/deputy/calendar/hearings'
            },
            {
                'user': deputy_user, 'type': 'appeal', 'title': 'Appeal Submitted',
                'message': 'Michael Brown has submitted an appeal for suspension decision',
                'priority': 'High', 'actionable': True, 'link': '/deputy/discipline/appeals'
            },
        ]
        for n in notifications:
            Notification.objects.get_or_create(
                user=n['user'], title=n['title'], defaults=n
            )
        self.stdout.write(f'Created {len(notifications)} notifications')

        # ---- UserSettings for deputy ----
        UserSettings.objects.get_or_create(
            user=deputy_user,
            defaults={
                'profile': {
                    'name': 'Dr. Sarah Martinez',
                    'email': 's.martinez@school.edu',
                    'phone': '+1 234-567-8900',
                    'department': 'Deputy Principal',
                    'office': 'Room 205'
                },
                'notifications': {
                    'emailAlerts': True, 'smsAlerts': True, 'caseUpdates': True,
                    'hearingReminders': True, 'weeklyReports': True, 'urgentAlerts': True
                },
                'preferences': {'theme': 'light', 'language': 'English', 'timezone': 'EST'},
                'security': {'twoFactorAuth': False, 'sessionTimeout': 30, 'loginAlerts': True},
                'discipline_settings': {
                    'autoEscalate': True, 'requireApproval': True,
                    'maxWarningsBeforeSuspension': 3, 'suspensionReviewDays': 5,
                    'notifyPrincipalOnHighSeverity': True, 'allowStudentAppeal': True
                }
            }
        )
        self.stdout.write('Created user settings for deputy')

        self.stdout.write(self.style.SUCCESS('Database seeding completed successfully!'))