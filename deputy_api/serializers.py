from rest_framework import serializers
from .models import *

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'

class DisciplineCaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = DisciplineCase
        fields = '__all__'

class SuspensionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Suspension
        fields = '__all__'

class CounselingSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CounselingSession
        fields = '__all__'

class InterventionProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterventionProgram
        fields = '__all__'

class InterventionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterventionPlan
        fields = '__all__'

class ReportTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportTemplate
        fields = '__all__'

class GeneratedReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeneratedReport
        fields = '__all__'

class ScheduledReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduledReport
        fields = '__all__'

class CalendarEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalendarEvent
        fields = '__all__'

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

class UserSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSettings
        fields = '__all__'