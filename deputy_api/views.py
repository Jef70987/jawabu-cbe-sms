from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Q
from django.utils import timezone
from .models import *
from .serializers import *

class IsDeputyPrincipal(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.groups.filter(name='DeputyPrincipal').exists()

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [permissions.IsAuthenticated, IsDeputyPrincipal]

class DisciplineCaseViewSet(viewsets.ModelViewSet):
    queryset = DisciplineCase.objects.all()
    serializer_class = DisciplineCaseSerializer
    permission_classes = [permissions.IsAuthenticated, IsDeputyPrincipal]

class SuspensionViewSet(viewsets.ModelViewSet):
    queryset = Suspension.objects.all()
    serializer_class = SuspensionSerializer
    permission_classes = [permissions.IsAuthenticated, IsDeputyPrincipal]

class CounselingSessionViewSet(viewsets.ModelViewSet):
    queryset = CounselingSession.objects.all()
    serializer_class = CounselingSessionSerializer
    permission_classes = [permissions.IsAuthenticated, IsDeputyPrincipal]

class InterventionProgramViewSet(viewsets.ModelViewSet):
    queryset = InterventionProgram.objects.all()
    serializer_class = InterventionProgramSerializer
    permission_classes = [permissions.IsAuthenticated, IsDeputyPrincipal]

class InterventionPlanViewSet(viewsets.ModelViewSet):
    queryset = InterventionPlan.objects.all()
    serializer_class = InterventionPlanSerializer
    permission_classes = [permissions.IsAuthenticated, IsDeputyPrincipal]

class ReportTemplateViewSet(viewsets.ModelViewSet):
    queryset = ReportTemplate.objects.all()
    serializer_class = ReportTemplateSerializer
    permission_classes = [permissions.IsAuthenticated, IsDeputyPrincipal]

class GeneratedReportViewSet(viewsets.ModelViewSet):
    queryset = GeneratedReport.objects.all()
    serializer_class = GeneratedReportSerializer
    permission_classes = [permissions.IsAuthenticated, IsDeputyPrincipal]

class ScheduledReportViewSet(viewsets.ModelViewSet):
    queryset = ScheduledReport.objects.all()
    serializer_class = ScheduledReportSerializer
    permission_classes = [permissions.IsAuthenticated, IsDeputyPrincipal]

class CalendarEventViewSet(viewsets.ModelViewSet):
    queryset = CalendarEvent.objects.all()
    serializer_class = CalendarEventSerializer
    permission_classes = [permissions.IsAuthenticated, IsDeputyPrincipal]

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        self.get_queryset().update(read=True)
        return Response({'status': 'marked all as read'})

class UserSettingsViewSet(viewsets.ModelViewSet):
    serializer_class = UserSettingsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserSettings.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class StatisticsViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated, IsDeputyPrincipal]

    @action(detail=False, methods=['get'])
    def overview(self, request):
        total_cases = DisciplineCase.objects.count()
        active_cases = DisciplineCase.objects.exclude(status='Resolved').count()
        resolved_cases = DisciplineCase.objects.filter(status='Resolved').count()
        pending_review = DisciplineCase.objects.filter(status='Pending Review').count()
        avg_resolution_days = 5.2  # compute if needed
        repeat_offenders = Student.objects.filter(warnings_count__gt=0).count()
        suspension_rate = Suspension.objects.filter(status='Active').count()
        counseling_referrals = CounselingSession.objects.filter(status='Scheduled').count()

        data = {
            'totalCases': total_cases,
            'activeCases': active_cases,
            'resolvedCases': resolved_cases,
            'pendingReview': pending_review,
            'avgResolutionTime': f"{avg_resolution_days} days",
            'repeatOffenders': repeat_offenders,
            'suspensionRate': f"{suspension_rate}%",
            'counselingReferrals': counseling_referrals,
        }
        return Response(data)

    @action(detail=False, methods=['get'])
    def monthly_trends(self, request):
        # Simplified – group by month (implement with proper queryset)
        trends = [
            {'month': 'Jan', 'cases': 28, 'resolved': 24, 'suspensions': 4, 'referrals': 12},
            # ... populate from database
        ]
        return Response(trends)

    