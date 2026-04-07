from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

class Student(models.Model):
    GENDER_CHOICES = [('Male', 'Male'), ('Female', 'Female')]
    STATUS_CHOICES = [('Active', 'Active'), ('Probation', 'Probation'), ('Suspended', 'Suspended')]
    CONDUCT_CHOICES = [('A', 'A'), ('B', 'B'), ('C', 'C'), ('D', 'D'), ('F', 'F')]

    name = models.CharField(max_length=100)
    grade = models.CharField(max_length=5)
    age = models.PositiveSmallIntegerField()
    gender = models.CharField(max_length=6, choices=GENDER_CHOICES)
    address = models.TextField()
    parent_name = models.CharField(max_length=100)
    parent_phone = models.CharField(max_length=20)
    parent_email = models.EmailField()
    attendance = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    conduct = models.CharField(max_length=1, choices=CONDUCT_CHOICES, default='B')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')
    clubs = models.JSONField(default=list)  # list of club names
    achievements = models.JSONField(default=list)
    warnings_count = models.PositiveSmallIntegerField(default=0)

    def __str__(self):
        return self.name

class DisciplineCase(models.Model):
    SEVERITY_CHOICES = [('High', 'High'), ('Medium', 'Medium'), ('Low', 'Low')]
    STATUS_CHOICES = [('Investigation', 'Investigation'), ('Pending Review', 'Pending Review'), ('Resolved', 'Resolved')]

    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='discipline_cases')
    offense = models.CharField(max_length=100)
    description = models.TextField()
    date = models.DateField(auto_now_add=True)
    reported_by = models.CharField(max_length=100)
    severity = models.CharField(max_length=10, choices=SEVERITY_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Investigation')
    actions = models.JSONField(default=list)  # list of action strings

    def __str__(self):
        return f"{self.student.name} - {self.offense}"

class Suspension(models.Model):
    TYPE_CHOICES = [('In-School', 'In-School'), ('Out-of-School', 'Out-of-School')]
    STATUS_CHOICES = [('Active', 'Active'), ('Completed', 'Completed')]

    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='suspensions')
    reason = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    days = models.PositiveSmallIntegerField()
    type = models.CharField(max_length=15, choices=TYPE_CHOICES)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Active')
    assigned_by = models.CharField(max_length=100)
    parent_notified = models.BooleanField(default=False)

class CounselingSession(models.Model):
    TYPE_CHOICES = [('Academic Guidance', 'Academic Guidance'), ('Personal Counseling', 'Personal Counseling'),
                    ('Behavioral', 'Behavioral'), ('Group Counseling', 'Group Counseling')]
    STATUS_CHOICES = [('Scheduled', 'Scheduled'), ('In Progress', 'In Progress'), ('Completed', 'Completed')]

    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='counseling_sessions')
    counselor = models.CharField(max_length=100)
    type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    date = models.DateField()
    time = models.TimeField()
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='Scheduled')
    notes = models.TextField(blank=True)

class InterventionProgram(models.Model):
    TYPE_CHOICES = [('Behavioral', 'Behavioral'), ('Academic', 'Academic'), ('Social', 'Social')]
    STATUS_CHOICES = [('Active', 'Active'), ('Scheduled', 'Scheduled'), ('Completed', 'Completed')]

    name = models.CharField(max_length=200)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    students = models.ManyToManyField(Student, related_name='intervention_programs')
    duration = models.CharField(max_length=20)  # e.g., "8 weeks"
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Scheduled')
    progress = models.PositiveSmallIntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    facilitator = models.CharField(max_length=100)
    sessions = models.PositiveSmallIntegerField()
    completed = models.PositiveSmallIntegerField(default=0)
    success = models.CharField(max_length=10, blank=True, null=True)  # e.g., "82%"

class InterventionPlan(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='intervention_plans')
    program = models.ForeignKey(InterventionProgram, on_delete=models.CASCADE)
    start_date = models.DateField()
    goals = models.JSONField(default=list)
    progress = models.PositiveSmallIntegerField(default=0)
    next_session = models.DateField()
    status = models.CharField(max_length=20, default='On Track')  # On Track, Needs Attention, Just Started
    notes = models.TextField(blank=True)

class ReportTemplate(models.Model):
    TYPE_CHOICES = [('daily', 'Daily'), ('weekly', 'Weekly'), ('monthly', 'Monthly'), ('quarterly', 'Quarterly'),
                    ('suspension', 'Suspension'), ('counseling', 'Counseling')]
    FORMAT_CHOICES = [('PDF', 'PDF'), ('Excel', 'Excel')]

    name = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    description = models.TextField()
    format = models.CharField(max_length=10, choices=FORMAT_CHOICES, default='PDF')
    includes = models.JSONField(default=list)  # list of strings

class GeneratedReport(models.Model):
    STATUS_CHOICES = [('Draft', 'Draft'), ('Final', 'Final')]

    name = models.CharField(max_length=200)
    type = models.CharField(max_length=20)  # same as above
    generated_by = models.CharField(max_length=100)
    generated_date = models.DateField(auto_now_add=True)
    format = models.CharField(max_length=10, default='PDF')
    size = models.CharField(max_length=20)  # e.g., "1.2 MB"
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Final')
    summary = models.JSONField(default=dict)  # e.g., {"totalCases": 8, ...}
    downloads = models.PositiveIntegerField(default=0)

class ScheduledReport(models.Model):
    FREQUENCY_CHOICES = [('Daily', 'Daily'), ('Every Monday', 'Every Monday'), ('1st of Month', '1st of Month')]

    name = models.CharField(max_length=100)
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES)
    time = models.TimeField()
    recipients = models.JSONField(default=list)  # list of email addresses
    format = models.CharField(max_length=10, default='PDF')
    next_run = models.DateField()
    status = models.CharField(max_length=10, default='Active')

class CalendarEvent(models.Model):
    TYPE_CHOICES = [('hearing', 'Hearing'), ('counseling', 'Counseling'), ('meeting', 'Meeting'), ('deadline', 'Deadline')]
    PRIORITY_CHOICES = [('High', 'High'), ('Medium', 'Medium'), ('Low', 'Low')]

    title = models.CharField(max_length=200)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    date = models.DateField()
    time = models.TimeField()
    duration = models.CharField(max_length=20)  # e.g., "1 hour"
    location = models.CharField(max_length=100)
    participants = models.JSONField(default=list)
    status = models.CharField(max_length=20, default='Scheduled')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='Medium')
    description = models.TextField()

class Notification(models.Model):
    PRIORITY_CHOICES = [('High', 'High'), ('Medium', 'Medium'), ('Low', 'Low')]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    type = models.CharField(max_length=20)  # case, hearing, appeal, etc.
    title = models.CharField(max_length=200)
    message = models.TextField()
    time = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='Medium')
    actionable = models.BooleanField(default=False)
    link = models.CharField(max_length=200, blank=True)

class UserSettings(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='settings')
    profile = models.JSONField(default=dict)
    notifications = models.JSONField(default=dict)
    preferences = models.JSONField(default=dict)
    security = models.JSONField(default=dict)
    discipline_settings = models.JSONField(default=dict)

    def __str__(self):
        return f"Settings for {self.user.username}"